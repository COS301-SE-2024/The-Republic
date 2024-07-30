import { Issue } from "../../shared/models/issue";
import supabase from "@/modules/shared/services/supabaseClient";
import { DateTime } from "luxon";
import { APIError } from "@/types/response";
import { GetIssuesParams } from "@/types/issue";
import ReactionRepository from "@/modules/reactions/repositories/reactionRepository";
import { CategoryRepository } from "@/modules/issues/repositories/categoryRepository";
import { CommentRepository } from "@/modules/comments/repositories/commentRepository";
import { LocationRepository } from "@/modules/locations/repositories/locationRepository";

const reactionRepository = new ReactionRepository();
const categoryRepository = new CategoryRepository();
const commentRepository = new CommentRepository();

export default class IssueRepository {
  async getIssues({
    from,
    amount,
    category,
    mood,
    user_id,
    order_by = "created_at",
    ascending = false,
    location,
  }: Partial<GetIssuesParams>) {
    let locationIds: number[] = [];

    if (location) {
      let locationQuery = supabase.from("location").select("location_id");

      if (location.province) {
        locationQuery = locationQuery.ilike(
          "province",
          `%${location.province}%`,
        );
      }
      if (location.city) {
        locationQuery = locationQuery.ilike("city", `%${location.city}%`);
      }
      if (location.suburb) {
        locationQuery = locationQuery.ilike("suburb", `%${location.suburb}%`);
      }
      if (location.district) {
        locationQuery = locationQuery.ilike(
          "district",
          `%${location.district}%`,
        );
      }

      const { data: locationData, error: locationError } = await locationQuery;

      if (locationError) {
        console.error("Error fetching locations:", locationError);
        throw APIError({
          code: 500,
          success: false,
          error: "An error occurred while fetching locations.",
        });
      }

      locationIds = locationData.map((loc) => loc.location_id);
    }

    let query = supabase
      .from("issue")
      .select(
        `
        *,
        user: user_id (
          user_id,
          email_address,
          username,
          fullname,
          image_url,
          user_score
        ),
        category: category_id (
          name
        ),
        location: location_id (
          province,
          city,
          suburb,
          district
        ),
        comment_count
      `,
      )
      .order(order_by, { ascending })
      .order("created_at", { ascending })
      .range(from!, from! + amount! - 1);

    if (locationIds.length > 0) {
      query = query.in("location_id", locationIds);
    }

    if (category) {
      const categoryId = await categoryRepository.getCategoryId(category);
      query = query.eq("category_id", categoryId);
    }

    if (mood) {
      query = query.eq("sentiment", mood);
    }

    const { data, error } = await query;

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      });
    }

    const issues = await Promise.all(
      data.map(async (issue: Issue) => {
        const reactions = await reactionRepository.getReactionCountsByIssueId(
          issue.issue_id,
        );
        const userReaction = user_id
          ? await reactionRepository.getReactionByUserAndIssue(
              issue.issue_id,
              user_id,
            )
          : null;
        return {
          ...issue,
          reactions,
          user_reaction: userReaction?.emoji || null,
          is_owner: issue.user_id === user_id,
          user: issue.is_anonymous
            ? {
                user_id: null,
                email_address: null,
                username: "Anonymous",
                fullname: "Anonymous",
                image_url: null,
              }
            : issue.user,
        };
      }),
    );

    return issues as Issue[];
  }

  async getIssueById(issueId: number, user_id?: string) {
    const { data, error } = await supabase
      .from("issue")
      .select(
        `
        *,
        user: user_id (
          user_id,
          email_address,
          username,
          fullname,
          image_url
        ),
        category: category_id (
          name
        ),
        location: location_id (
          suburb,
          city,
          province
        )
      `,
      )
      .eq("issue_id", issueId)
      .maybeSingle();

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      });
    }

    if (!data) {
      throw APIError({
        code: 404,
        success: false,
        error: "Issue does not exist",
      });
    }

    const reactions = await reactionRepository.getReactionCountsByIssueId(
      data.issue_id,
    );
    const userReaction = user_id
      ? await reactionRepository.getReactionByUserAndIssue(
          data.issue_id,
          user_id,
        )
      : null;
    const commentCount = await commentRepository.getNumComments(data.issue_id);

    return {
      ...data,
      reactions,
      user_reaction: userReaction?.emoji || null,
      comment_count: commentCount,
      is_owner: data.user_id === user_id,
      user: data.is_anonymous
        ? {
            user_id: null,
            email_address: null,
            username: "Anonymous",
            fullname: "Anonymous",
            image_url: null,
          }
        : data.user,
    } as Issue;
  }

  async createIssue(issue: Partial<Issue>) {
    issue.created_at = new Date().toISOString();

    let locationId: number | null = null;

    if (issue.location_data) {
      // console.log("Raw location data:", issue.location_data);

      let locationDataObj;
      try {
        locationDataObj =
          typeof issue.location_data === "string"
            ? JSON.parse(issue.location_data)
            : issue.location_data;

        // console.log("Parsed location data:", locationDataObj);

        const locationRepository = new LocationRepository();
        const existingLocation = await locationRepository.getLocationByPlacesId(
          locationDataObj.place_id,
        );

        if (existingLocation) {
          locationId = existingLocation.location_id;
        } else {
          const newLocation = await locationRepository.createLocation({
            place_id: locationDataObj.place_id,
            province: locationDataObj.province,
            city: locationDataObj.city,
            suburb: locationDataObj.suburb,
            district: locationDataObj.district,
          });
          locationId = newLocation.location_id;
        }
      } catch (error) {
        console.error("Error processing location data:", error);
        throw APIError({
          code: 500,
          success: false,
          error: "An error occurred while processing location data.",
        });
      }
    }

    const { data, error } = await supabase
      .from("issue")
      .insert({
        user_id: issue.user_id,
        category_id: issue.category_id,
        content: issue.content,
        sentiment: issue.sentiment,
        is_anonymous: issue.is_anonymous,
        location_id: locationId,
        created_at: issue.created_at,
        image_url: issue.image_url || null,
      })
      .select()
      .single();

    if (error) {
      console.error(error);

      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      });
    }

    const reactions = await reactionRepository.getReactionCountsByIssueId(
      data.issue_id,
    );

    return {
      ...data,
      reactions,
      is_owner: true,
      user: data.is_anonymous
        ? {
            user_id: null,
            email_address: null,
            username: "Anonymous",
            fullname: "Anonymous",
            image_url: null,
          }
        : data.user,
    } as Issue;
  }

  async updateIssue(issueId: number, issue: Partial<Issue>, user_id: string) {
    const { data, error } = await supabase
      .from("issue")
      .update(issue)
      .eq("issue_id", issueId)
      .eq("user_id", user_id)
      .select()
      .maybeSingle();

    if (error) {
      console.error(error);

      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      });
    }

    if (!data) {
      throw APIError({
        code: 404,
        success: false,
        error: "Issue does not exist",
      });
    }

    const reactions = await reactionRepository.getReactionCountsByIssueId(
      data.issue_id,
    );

    return {
      ...data,
      reactions,
      is_owner: true,
      user: data.is_anonymous
        ? {
            user_id: null,
            email_address: null,
            username: "Anonymous",
            fullname: "Anonymous",
            image_url: null,
          }
        : data.user,
    } as Issue;
  }

  async deleteIssue(issueId: number, user_id: string) {
    const { data, error } = await supabase
      .from("issue")
      .delete()
      .eq("issue_id", issueId)
      .eq("user_id", user_id)
      .select()
      .maybeSingle();

    if (error) {
      console.error(error);

      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      });
    }

    if (!data) {
      throw APIError({
        code: 404,
        success: false,
        error: "Issue does not exist",
      });
    }
  }

  async resolveIssue(issueId: number, user_id: string) {
    const resolvedAt = DateTime.now().setZone("UTC+2").toISO();
    const { data, error } = await supabase
      .from("issue")
      .update({ resolved_at: resolvedAt })
      .eq("issue_id", issueId)
      .eq("user_id", user_id)
      .select()
      .maybeSingle();

    if (error) {
      console.error(error);

      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      });
    }

    if (!data) {
      throw APIError({
        code: 404,
        success: false,
        error: "Issue does not exist",
      });
    }

    return data as Issue;
  }

  async getUserIssues(userId: string) {
    const { data, error } = await supabase
      .from("issue")
      .select(
        `
        *,
        user: user_id (
          user_id,
          email_address,
          username,
          fullname,
          image_url
        ),
        category: category_id (
          name
        ),
        location: location_id (
          suburb,
          city,
          province
        )
      `,
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      });
    }

    const issues = await Promise.all(
      data.map(async (issue: Issue) => {
        const reactions = await reactionRepository.getReactionCountsByIssueId(
          issue.issue_id,
        );
        const userReaction = await reactionRepository.getReactionByUserAndIssue(
          issue.issue_id,
          userId,
        );
        const commentCount = await commentRepository.getNumComments(
          issue.issue_id,
        );
        return {
          ...issue,
          reactions,
          user_reaction: userReaction?.emoji || null,
          comment_count: commentCount,
          is_owner: issue.user_id === userId,
          user: issue.is_anonymous
            ? {
                user_id: null,
                email_address: null,
                username: "Anonymous",
                fullname: "Anonymous",
                image_url: null,
              }
            : issue.user,
        };
      }),
    );

    return issues as Issue[];
  }

  async getUserResolvedIssues(userId: string) {
    const { data, error } = await supabase
      .from("issue")
      .select(
        `
        *,
        user: user_id (
          user_id,
          email_address,
          username,
          fullname,
          image_url
        ),
        category: category_id (
          name
        ),
        location: location_id (
          suburb,
          city,
          province
        )
      `,
      )
      .eq("user_id", userId)
      .not("resolved_at", "is", null)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      });
    }

    const issues = await Promise.all(
      data.map(async (issue: Issue) => {
        const reactions = await reactionRepository.getReactionCountsByIssueId(
          issue.issue_id,
        );
        const userReaction = await reactionRepository.getReactionByUserAndIssue(
          issue.issue_id,
          userId,
        );
        const commentCount = await commentRepository.getNumComments(
          issue.issue_id,
        );
        return {
          ...issue,
          reactions,
          user_reaction: userReaction?.emoji || null,
          comment_count: commentCount,
          is_owner: issue.user_id === userId,
          user: issue.is_anonymous
            ? {
                user_id: null,
                email_address: null,
                username: "Anonymous",
                fullname: "Anonymous",
                image_url: null,
              }
            : issue.user,
        };
      }),
    );

    return issues as Issue[];
  }
}
