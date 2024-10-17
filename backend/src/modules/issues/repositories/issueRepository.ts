import { Issue } from "@/modules/shared/models/issue";
import { Resolution } from "@/modules/shared/models/resolution";
import supabase from "@/modules/shared/services/supabaseClient";
import { DateTime } from "luxon";
import { APIError } from "@/types/response";
import { GetIssuesParams } from "@/types/issue";
import ReactionRepository from "@/modules/reactions/repositories/reactionRepository";
import { CategoryRepository } from "@/modules/issues/repositories/categoryRepository";
import { CommentRepository } from "@/modules/comments/repositories/commentRepository";
import { LocationRepository } from "@/modules/locations/repositories/locationRepository";
import { formatTime } from "@/utilities/formatTime";
import { ResolutionResponseRepository } from "@/modules/resolutions/repositories/resolutionResponseRepository";

export default class IssueRepository {
  private reactionRepository: ReactionRepository;
  private categoryRepository: CategoryRepository;
  private commentRepository: CommentRepository;
  private resolutionResponseRepository: ResolutionResponseRepository;

  constructor() {
    this.reactionRepository = new ReactionRepository();
    this.categoryRepository = new CategoryRepository();
    this.commentRepository = new CommentRepository();
    this.resolutionResponseRepository = new ResolutionResponseRepository();
  }

  async getIssues({
    from,
    amount,
    category,
    user_id,
    order_by = "created_at",
    ascending = false,
    location,
  }: Partial<GetIssuesParams>) {
    let query = supabase
      .from("issue")
      .select(
        `*,
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
          district,
          latitude,
          longitude
        ),
        resolution: resolution_id (*),
        comment_count
      `,
      )
      .order(order_by, { ascending })
      .range(from!, from! + amount! - 1);

    if (location) {
      query = query
        .ilike("location.province", `%${location.province}%`)
        .ilike("location.city", `%${location.city}%`)
        .ilike("location.suburb", `%${location.suburb}%`)
        .ilike("location.district", `%${location.district}%`);
    }

    let category_id = 0;
    if (category) {
      category_id = await this.categoryRepository.getCategoryId(category);
      query = query.eq("category_id", category_id);
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

    // I Might Fetch The Data In Parallel Instead of Mapping Through The List While Fetching
    const issues = await Promise.all(
      data.map(async (issue: Issue) => {
        const reactions =
          await this.reactionRepository.getReactionCountsByItemId(
            issue.issue_id.toString(),
            "issue",
          );

        const userReaction = user_id
          ? await this.reactionRepository.getReactionByUserAndItem(
              issue.issue_id.toString(),
              "issue",
              user_id,
            )
          : null;

        const pendingResolution = await this.getPendingResolutionForIssue(
          issue.issue_id,
        );
        const userHasIssueInCluster = user_id
          ? await this.userHasIssueInCluster(user_id, issue.cluster_id ?? null)
          : false;
        const { issues: relatedIssues, totalCount: relatedIssuesCount } =
          await this.getRelatedIssues(issue.cluster_id ?? null, issue.issue_id);
        const { data: forecastData, error: forecastError } = await supabase.rpc(
          "avg_resolution_time",
          {
            category_id_param: issue.category_id,
            suburb_param: issue.location?.suburb,
          },
        );
        const resolutionResponse = pendingResolution
          ? await this.resolutionResponseRepository.getResolutionResponse(
              pendingResolution.resolution_id,
              issue.user_id,
            )
          : null;

        const days =
          forecastData && !forecastError ? formatTime(forecastData) : `${(category_id % 2) + 6} days`;
        const information = !issue.resolved_at
          ? `This issue may take around ${days} to be resolved based on similar issues in this area.`
          : "This issue has already been resolved.";

        return {
          ...issue,
          reactions,
          user_reaction: userReaction?.emoji || null,
          is_owner: issue.user_id === user_id,
          forecast: information,
          user: issue.is_anonymous
            ? {
                user_id: null,
                email_address: null,
                username: "Anonymous",
                fullname: "Anonymous",
                image_url: null,
              }
            : issue.user,
          hasPendingResolution: !!pendingResolution,
          pendingResolutionId: pendingResolution?.resolution_id || null,
          resolutionResponse,
          relatedIssuesCount,
          userHasIssueInCluster,
          relatedIssues,
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
          image_url,
          user_score
        ),
        category: category_id (
          name
        ),
        location: location_id (
          suburb,
          city,
          province,
          latitude,
          longitude
        ),
        resolution: resolution_id (*),
        cluster_id
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

    const reactions = await this.reactionRepository.getReactionCountsByItemId(
      data.issue_id.toString(),
      "issue",
    );

    const userReaction = user_id
      ? await this.reactionRepository.getReactionByUserAndItem(
          data.issue_id.toString(),
          "issue",
          user_id,
        )
      : null;
    const commentCount = await this.commentRepository.getNumComments(
      data.issue_id,
      "issue",
    );
    const pendingResolution = await this.getPendingResolutionForIssue(
      data.issue_id,
    );
    const { issues: relatedIssues, totalCount: relatedIssuesCount } =
      await this.getRelatedIssues(data.cluster_id, data.issue_id);
    const userHasIssueInCluster = user_id
      ? await this.userHasIssueInCluster(user_id, data.cluster_id)
      : false;
    const { data: forecastData, error: forecastError } = await supabase.rpc(
      "avg_resolution_time",
      {
        category_id_param: data.category_id,
        suburb_param: data.location?.suburb,
      },
    );
    const resolutionResponse = pendingResolution
      ? await this.resolutionResponseRepository.getResolutionResponse(
          pendingResolution.resolution_id,
          data.user_id,
        )
      : null;

    const days =
      forecastData && !forecastError ? formatTime(forecastData) : "6 days";
    const information = !data.resolved_at
      ? `This issue may take around ${days} to be resolved based on similar issues in this area.`
      : "This issue has already been resolved.";

    return {
      ...data,
      reactions,
      user_reaction: userReaction?.emoji || null,
      comment_count: commentCount,
      is_owner: data.user_id === user_id,
      forecast: information,
      user: data.is_anonymous
        ? {
            user_id: null,
            email_address: null,
            username: "Anonymous",
            fullname: "Anonymous",
            image_url: null,
          }
        : data.user,
      hasPendingResolution: !!pendingResolution,
      pendingResolutionId: pendingResolution?.resolution_id || null,
      resolutionResponse,
      relatedIssuesCount,
      userHasIssueInCluster,
      relatedIssues,
    } as Issue;
  }

  async getRelatedIssues(
    clusterId: string | null,
    currentIssueId: number,
  ): Promise<{ issues: Issue[]; totalCount: number }> {
    if (!clusterId) return { issues: [], totalCount: 0 };

    const { data, error, count } = await supabase
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
          suburb,
          city,
          province,
          latitude,
          longitude
        )
      `,
        { count: "exact" },
      )
      .eq("cluster_id", clusterId)
      .neq("issue_id", currentIssueId)
      .limit(3);

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while fetching related issues.",
      });
    }

    return { issues: data as Issue[], totalCount: (count || 0) - 1 };
  }

  async createIssue(issue: Partial<Issue>) {
    issue.created_at = new Date().toISOString();

    let locationId: number | null = null;

    if (issue.location_data) {
      let locationDataObj;
      try {
        locationDataObj =
          typeof issue.location_data === "string"
            ? JSON.parse(issue.location_data)
            : issue.location_data;

        const locationRepository = new LocationRepository();
        const existingLocations =
          await locationRepository.getLocationByPlacesId(
            locationDataObj.place_id,
          );

        if (existingLocations.length > 0) {
          locationId = existingLocations[0].location_id;
        } else {
          const newLocation = await locationRepository.createLocation({
            place_id: locationDataObj.place_id,
            province: locationDataObj.province,
            city: locationDataObj.city,
            suburb: locationDataObj.suburb,
            district: locationDataObj.district,
            latitude: locationDataObj.lat,
            longitude: locationDataObj.lng,
          });
          locationId = newLocation.location_id;
        }
      } catch (error) {
        console.error("Error processing location data:", error);
        throw APIError({
          code: 500,
          success: false,
          error: `An error occurred while processing location data: ${error instanceof Error ? error.message : JSON.stringify(error)}`,
        });
      }
    }

    try {
      const { data, error } = await supabase
        .from("issue")
        .insert({
          user_id: issue.user_id,
          category_id: issue.category_id,
          content: issue.content,
          is_anonymous: issue.is_anonymous,
          location_id: locationId,
          created_at: issue.created_at,
          image_url: issue.image_url || null,
          updated_at: new Date().toISOString(),
        })
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
            suburb,
            city,
            province,
            latitude,
            longitude
          ),
          cluster_id
        `,
        )
        .single();

      if (error) {
        console.error("Error inserting issue:", error);
        throw APIError({
          code: 500,
          success: false,
          error: `An error occurred while inserting the issue: ${error.message}`,
        });
      }

      const { data: forecastData, error: forecastError } = await supabase.rpc(
        "avg_resolution_time",
        {
          category_id_param: issue.category_id,
          suburb_param: issue.location?.suburb,
        },
      );

      const days =
        forecastData && !forecastError ? formatTime(forecastData) : "6 days";
      const information = !issue.resolved_at
        ? `This issue may take around ${days} to be resolved based on similar issues in this area.`
        : "This issue has already been resolved.";

      return {
        ...data,
        reactions: [],
        user_reaction: null,
        comment_count: 0,
        is_owner: true,
        forecast: information,
        user: data.is_anonymous
          ? {
              user_id: null,
              email_address: null,
              username: "Anonymous",
              fullname: "Anonymous",
              image_url: null,
              total_issues: null,
              resolved_issues: null,
              user_score: 0,
              location_id: null,
              location: null,
            }
          : data.user,
        hasPendingResolution: false,
        pendingResolutionId: null,
        resolution: null,
        resolutionResponse: null,
        relatedIssuesCount: 0,
        userHasIssueInCluster: false,
      } as Issue;
    } catch (error) {
      console.error("Unexpected error in createIssue:", error);
      throw APIError({
        code: 500,
        success: false,
        error: `An unexpected error occurred: ${error}`,
      });
    }
  }

  async updateIssueCluster(issueId: number, clusterId: string): Promise<void> {
    const { error } = await supabase
      .from("issue")
      .update({
        cluster_id: clusterId,
        updated_at: new Date().toISOString(),
      })
      .eq("issue_id", issueId);

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while updating issue cluster.",
      });
    }
  }

  async setIssueEmbedding(issueId: number, embedding: number[]): Promise<void> {
    const { error } = await supabase.from("issue_embeddings").insert({
      issue_id: issueId,
      content_embedding: embedding,
    });

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while updating issue embedding.",
      });
    }
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

    const reactions = await this.reactionRepository.getReactionCountsByItemId(
      data.issue_id.toString(),
      "issue",
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
          image_url,
          user_score
        ),
        category: category_id (
          name
        ),
        location: location_id (
          suburb,
          city,
          province
        ),
        resolution: resolution_id (*)
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
        const reactions =
          await this.reactionRepository.getReactionCountsByItemId(
            issue.issue_id.toString(),
            "issue",
          );
        const userReaction =
          await this.reactionRepository.getReactionByUserAndItem(
            issue.issue_id.toString(),
            "issue",
            userId,
          );

        const commentCount = await this.commentRepository.getNumComments(
          issue.issue_id.toString(),
          "issue",
        );

        const { data: forecastData, error: forecastError } = await supabase.rpc(
          "avg_resolution_time",
          {
            category_id_param: issue.category_id,
            suburb_param: issue.location?.suburb,
          },
        );

        const days =
          forecastData && !forecastError ? formatTime(forecastData) : "6 days";
        const information = !issue.resolved_at
          ? `This issue may take around ${days} to be resolved based on similar issues in this area.`
          : "This issue has already been resolved.";

        return {
          ...issue,
          reactions,
          user_reaction: userReaction?.emoji || null,
          comment_count: commentCount,
          is_owner: issue.user_id === userId,
          forecast: information,
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
          image_url,
          user_score
        ),
        category: category_id (
          name
        ),
        location: location_id (
          suburb,
          city,
          province,
          latitude,
          longitude
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
        const reactions =
          await this.reactionRepository.getReactionCountsByItemId(
            issue.issue_id.toString(),
            "issue",
          );
        const userReaction =
          await this.reactionRepository.getReactionByUserAndItem(
            issue.issue_id.toString(),
            "issue",
            userId,
          );

        const commentCount = await this.commentRepository.getNumComments(
          issue.issue_id.toString(),
          "issue",
        );

        const { data: forecastData, error: forecastError } = await supabase.rpc(
          "avg_resolution_time",
          {
            category_id_param: issue.category_id,
            suburb_param: issue.location?.suburb,
          },
        );

        const days =
          forecastData && !forecastError ? formatTime(forecastData) : "6 days";
        const information = !issue.resolved_at
          ? `This issue may take around ${days} to be resolved based on similar issues in this area.`
          : "This issue has already been resolved.";

        return {
          ...issue,
          reactions,
          user_reaction: userReaction?.emoji || null,
          comment_count: commentCount,
          is_owner: issue.user_id === userId,
          forecast: information,
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

  async updateIssueResolutionStatus(
    issueId: number,
    resolved: boolean,
  ): Promise<void> {
    const resolvedAt = DateTime.now().setZone("UTC+2").toISO();
    const { error } = await supabase
      .from("issue")
      .update({
        resolved_at: resolved ? resolvedAt : null,
        updated_at: new Date().toISOString(),
      })
      .eq("issue_id", issueId);

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error:
          "An unexpected error occurred while updating the issue resolution status.",
      });
    }
  }

  async isIssueResolved(issueId: number): Promise<boolean> {
    const { data, error } = await supabase
      .from("issue")
      .select("resolved_at")
      .eq("issue_id", issueId)
      .single();

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error:
          "An unexpected error occurred while checking the issue resolution status.",
      });
    }

    return data.resolved_at !== null;
  }

  async getPendingResolutionForIssue(
    issueId: number,
  ): Promise<Resolution | null> {
    const { data, error } = await supabase
      .from("issue")
      .select("*, resolution: resolution_id(*)")
      .eq("issue_id", issueId)
      .eq("resolution.status", "pending")
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 is the error code for no rows returned
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error:
          "An unexpected error occurred while checking for pending resolutions.",
      });
    }

    return data?.resolution || null;
  }

  async getResolutionsForIssue(issueId: number): Promise<Resolution[]> {
    const { data, error } = await supabase
      .from("resolution")
      .select("*")
      .eq("issue_id", issueId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error:
          "An unexpected error occurred while fetching resolutions for the issue.",
      });
    }

    return data as Resolution[];
  }

  async assignResolutionToIssues(resolutionId: string, issuesIds: number[]) {
    const { error } = await supabase
      .from("issue")
      .update({ resolution_id: resolutionId })
      .in("issue_id", issuesIds);

    if (error) {
      console.error("assignResolutionToIssues: ", error);
      throw APIError({
        code: 500,
        success: false,
        error:
          "An unexpected error occurred while assigning resolution to issues",
      });
    }
  }

  async userHasIssueInCluster(
    userId: string,
    clusterId: string | null,
  ): Promise<boolean> {
    if (!clusterId) return false;
    const { count } = await supabase
      .from("issue")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("cluster_id", clusterId);
    return (count || 0) > 0;
  }

  async hasUserIssuesInCluster(
    userId: string,
    clusterId: string,
  ): Promise<boolean> {
    const { count, error } = await supabase
      .from("issue")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("cluster_id", clusterId);

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error:
          "An unexpected error occurred while checking user issues in the cluster.",
      });
    }

    return count !== null && count > 0;
  }

  async getUserIssueInCluster(
    userId: string,
    clusterId: string,
  ): Promise<Issue | null> {
    const { data, error } = await supabase
      .from("issue")
      .select("*")
      .eq("user_id", userId)
      .eq("cluster_id", clusterId)
      .single();

    if (error) {
      console.error("Error fetching user's issue in cluster:", error);
      throw error;
    }

    return data as Issue;
  }

  async getIssuesInCluster(clusterId: string): Promise<Issue[]> {
    const { data, error } = await supabase
      .from("issue")
      .select("*")
      .eq("cluster_id", clusterId);

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error:
          "An unexpected error occurred while fetching issues in the cluster.",
      });
    }

    return data;
  }

  async getIssueEmbedding(issueId: number): Promise<Issue> {
    const { data, error } = await supabase
      .from("issue_embeddings")
      .select("*")
      .eq("issue_id", issueId)
      .single();

    if (error) {
      console.error("Error fetching issue embedding:", error);
      throw APIError({
        code: 500,
        success: false,
        error:
          "An unexpected error occurred while fetching the issue embedding.",
      });
    }

    if (!data) {
      throw APIError({
        code: 404,
        success: false,
        error: "Issue embedding not found",
      });
    }

    return data;
  }

  async getIssueCount(organizationId: string /*params?: { startDate: Date; endDate: Date }*/): Promise<number> {
    const { data, error } = await supabase
      .rpc("org_issues_count", {
        p_org_id: organizationId,
      });
      /* .gte("created_at", params.startDate.toISOString())
      .lte("created_at", params.endDate.toISOString()); */
  
    if (error) {
      console.error("Error getting issue count:", error);
      throw APIError({
        code: 500,
        success: false,
        error: "An error occurred while getting issue count.",
      });
    }
  
    return data || 0;
  }

  async getIssueCountByUser(userId: string, startDate: Date, endDate: Date): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('issue')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());
  
      if (error) {
        console.error('Error getting issue count:', error);
        throw new Error(error.message || 'An error occurred while getting issue count.');
      }
  
      return count || 0;
    } catch (error) {
      console.error('Unexpected error in getIssueCountByUser:', error);
      throw APIError({
        code: 500,
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred while getting issue count.',
      });
    }
  }

  async getIssuesByCategoryInDateRange(organizationId: string, startDate: Date, endDate: Date): Promise<{ category: string; issues: Issue[] }[]> {
    const { data, error } = await supabase
      .from('issue')
      .select(`
        *,
        category:category_id (name)
      `)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());
  
    if (error) {
      console.error('Error getting issues by category:', error);
      throw APIError({
        code: 500,
        success: false,
        error: 'An error occurred while getting issues by category.',
      });
    }
  
    const issuesByCategory = data.reduce<Record<string, Issue[]>>((acc, issue) => {
      const categoryName = issue.category.name;
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(issue);
      return acc;
    }, {});
  
    return Object.entries(issuesByCategory).map(([category, issues]) => ({ category, issues })) as { category: string; issues: Issue[] }[];
  }
  
  async getIssuesByLocationInDateRange(organizationId: string, startDate: Date, endDate: Date): Promise<{ location: string; issues: Issue[] }[]> {
    const { data, error } = await supabase
      .from('issue')
      .select(`
        *,
        location:location_id (city)
      `)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());
  
    if (error) {
      console.error('Error getting issues by location:', error);
      throw APIError({
        code: 500,
        success: false,
        error: 'An error occurred while getting issues by location.',
      });
    }
  
    const issuesByLocation = data.reduce<Record<string, Issue[]>>((acc, issue) => {
      const locationName = issue.location?.city ?? 'Unknown';
      if (!acc[locationName]) {
        acc[locationName] = [];
      }
      acc[locationName].push(issue);
      return acc;
    }, {});
  
    return Object.entries(issuesByLocation).map(([location, issues]) => ({ location, issues })) as { location: string; issues: Issue[] }[];
  }

  async getResolvedIssueCount(params: { startDate: Date; endDate: Date }): Promise<number> {
    const { count, error } = await supabase
      .from("issue")
      .select("*", { count: "exact", head: true })
      .not("resolved_at", "is", null)
      .gte("created_at", params.startDate.toISOString())
      .lte("created_at", params.endDate.toISOString());
  
    if (error) {
      console.error("Error getting resolved issue count:", error);
      throw APIError({
        code: 500,
        success: false,
        error: "An error occurred while getting resolved issue count.",
      });
    }
  
    return count || 0;
  }
}
