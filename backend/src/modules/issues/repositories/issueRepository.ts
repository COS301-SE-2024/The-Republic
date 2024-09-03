import { Issue } from "../../shared/models/issue";
import { Resolution } from "@/modules/shared/models/resolution";
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
          district,
          latitude,
          longitude
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
        const pendingResolution = await this.getPendingResolutionForIssue(issue.issue_id);
        const resolutions = await this.getResolutionsForIssue(issue.issue_id);
        const userHasIssueInCluster = user_id ? await this.userHasIssueInCluster(user_id, issue.cluster_id ?? null ) : false;
        const { issues: relatedIssues, totalCount: relatedIssuesCount } = await this.getRelatedIssues(issue.cluster_id ?? null, issue.issue_id);

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
          hasPendingResolution: !!pendingResolution,
          pendingResolutionId: pendingResolution?.resolution_id || null,
          resolutions,
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
    const pendingResolution = await this.getPendingResolutionForIssue(data.issue_id);
    const resolutions = await this.getResolutionsForIssue(data.issue_id);
    const { issues: relatedIssues, totalCount: relatedIssuesCount } = await this.getRelatedIssues(data.cluster_id, data.issue_id);
    const userHasIssueInCluster = user_id ? await this.userHasIssueInCluster(user_id, data.cluster_id) : false;

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
      hasPendingResolution: !!pendingResolution,
      pendingResolutionId: pendingResolution?.resolution_id || null,
      resolutions,
      relatedIssuesCount,
      userHasIssueInCluster,
      relatedIssues,
    } as Issue;
  }

  async getRelatedIssues(clusterId: string | null, currentIssueId: number): Promise<{ issues: Issue[]; totalCount: number }> {
    if (!clusterId) return { issues: [], totalCount: 0 };
    
    const { data, error, count } = await supabase
      .from('issue')
      .select(`
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
      `, { count: 'exact' })
      .eq('cluster_id', clusterId)
      .neq('issue_id', currentIssueId)
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
        const existingLocations = await locationRepository.getLocationByPlacesId(
          locationDataObj.place_id
        );
  
        if (existingLocations.length > 0) {
          // If locations exist, use the first one
          locationId = existingLocations[0].location_id;
        } else {
          // If no location exists, create a new one
          const newLocation = await locationRepository.createLocation({
            place_id: locationDataObj.place_id,
            province: locationDataObj.province,
            city: locationDataObj.city,
            suburb: locationDataObj.suburb,
            district: locationDataObj.district,
            latitude: locationDataObj.lat,
            longitude: locationDataObj.lng
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
          sentiment: issue.sentiment,
          is_anonymous: issue.is_anonymous,
          location_id: locationId,
          created_at: issue.created_at,
          image_url: issue.image_url || null,
          updated_at: new Date().toISOString()
        })
        .select(`
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
        `)
        .single();
  
      if (error) {
        console.error("Error inserting issue:", error);
        throw APIError({
          code: 500,
          success: false,
          error: `An error occurred while inserting the issue: ${error.message}`,
        });
      }

      return {
        ...data,
        reactions: [],
        user_reaction: null,
        comment_count: 0,
        is_owner: true,
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
              location: null
            }
          : data.user,
        hasPendingResolution: false,
        pendingResolutionId: null,
        resolutions: [],
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
      .from('issue')
      .update({ 
        cluster_id: clusterId,
        updated_at: new Date().toISOString()
      })
      .eq('issue_id', issueId);

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
    const { error } = await supabase
      .from('issue_embeddings')
      .insert({ 
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

  async updateIssueResolutionStatus(issueId: number, resolved: boolean): Promise<void> {
    const resolvedAt = DateTime.now().setZone("UTC+2").toISO();
    const { error } = await supabase
      .from('issue')
      .update({ 
        resolved_at: resolved ? resolvedAt : null,
        updated_at: new Date().toISOString()
      })
      .eq('issue_id', issueId);

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while updating the issue resolution status.",
      });
    }
  }

  async isIssueResolved(issueId: number): Promise<boolean> {
    const { data, error } = await supabase
      .from('issue')
      .select('resolved_at')
      .eq('issue_id', issueId)
      .single();

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while checking the issue resolution status.",
      });
    }

    return data.resolved_at !== null;
  }

  async getPendingResolutionForIssue(issueId: number): Promise<Resolution | null> {
    const { data, error } = await supabase
      .from('resolution')
      .select('*')
      .eq('issue_id', issueId)
      .eq('status', 'pending')
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while checking for pending resolutions.",
      });
    }

    return data || null;
  }

  async getResolutionsForIssue(issueId: number): Promise<Resolution[]> {
    const { data, error } = await supabase
      .from('resolution')
      .select('*')
      .eq('issue_id', issueId)
      .order('created_at', { ascending: false });
  
    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while fetching resolutions for the issue.",
      });
    }
  
    return data as Resolution[];
  }

  async userHasIssueInCluster(userId: string, clusterId: string | null): Promise<boolean> {
    if (!clusterId) return false;
    const { count } = await supabase
      .from('issue')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('cluster_id', clusterId);
    return (count || 0) > 0;
  }

  async hasUserIssuesInCluster(userId: string, clusterId: string): Promise<boolean> {
    const { count, error } = await supabase
      .from('issue')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('cluster_id', clusterId);
  
    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while checking user issues in the cluster.",
      });
    }
  
    return count !== null && count > 0;
  }

  async getUserIssueInCluster(userId: string, clusterId: string): Promise<Issue | null> {
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
      .from('issue')
      .select('*')
      .eq('cluster_id', clusterId);
  
    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while fetching issues in the cluster.",
      });
    }
  
    return data;
  }
}
