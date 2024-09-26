import supabase from "@/modules/shared/services/supabaseClient";
import { APIError } from "@/types/response";

export class ResolutionResponseRepository {
  async createResponse(
    resolutionId: string,
    userId: string,
    response: "accepted" | "declined",
    satisfactionRating?: number,
  ): Promise<void> {
    const { error } = await supabase.from("resolution_responses").insert({
      resolution_id: resolutionId,
      user_id: userId,
      response,
      satisfaction_rating: response === "accepted" ? satisfactionRating : null,
    });

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error:
          "An unexpected error occurred while creating a resolution response.",
      });
    }
  }

  async getAcceptedUsers(
    resolutionId: string,
  ): Promise<{ userId: string; satisfactionRating: number | null }[]> {
    const { data, error } = await supabase
      .from("resolution_responses")
      .select("user_id, satisfaction_rating")
      .eq("resolution_id", resolutionId)
      .eq("response", "accepted");

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while fetching accepted users.",
      });
    }

    return data.map((row) => ({
      userId: row.user_id,
      satisfactionRating: row.satisfaction_rating,
    }));
  }

  async getAverageSatisfactionRating(
    resolutionId: string,
  ): Promise<number | null> {
    const { data, error } = await supabase
      .from("resolution_responses")
      .select("satisfaction_rating")
      .eq("resolution_id", resolutionId)
      .eq("response", "accepted")
      .not("satisfaction_rating", "is", null);

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error:
          "An unexpected error occurred while fetching satisfaction ratings.",
      });
    }

    if (data.length === 0) {
      return null;
    }

    const sum = data.reduce((acc, curr) => acc + curr.satisfaction_rating!, 0);
    return sum / data.length;
  }

  async getResolutionResponse(resolutionId: string, userId: string) {
    const { data, error } = await supabase
      .from("resolution_responses")
      .select()
      .eq("resolution_id", resolutionId)
      .eq("user_id", userId)
      /* NOTE: If a user has more than 1 issue in a cluster
       * they would have multiple responses with the same
       * resolution and user ID. Maybe we should replace
       * the user ID with an issue ID */
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("getUserResponse: ", error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while fetching user response",
      });
    }

    return data;
  }

  async getAverageSatisfactionRatingForUser(userId: string, organizationId: string, startDate: Date, endDate: Date): Promise<number | null> {
    const { data, error } = await supabase
      .from('resolution_responses')
      .select('satisfaction_rating, resolution:resolution_id(resolver_id, organization_id, created_at)')
      .eq('user_id', userId)
      .eq('resolution.organization_id', organizationId)
      .eq('response', 'accepted')
      .gte('resolution.created_at', startDate.toISOString())
      .lte('resolution.created_at', endDate.toISOString())
      .not('satisfaction_rating', 'is', null);

    if (error) {
      console.error('Error getting average satisfaction rating:', error);
      throw APIError({
        code: 500,
        success: false,
        error: 'An error occurred while getting average satisfaction rating.',
      });
    }

    if (data.length === 0) {
      return null;
    }

    const validRatings = data.filter(item => item.satisfaction_rating !== null);
    const sum = validRatings.reduce((acc, curr) => acc + (curr.satisfaction_rating || 0), 0);
    return sum / validRatings.length;
  }

  async getOverallAverageSatisfactionRating(startDate: Date, endDate: Date): Promise<number> {
    const { data, error } = await supabase
      .from('resolution_responses')
      .select('satisfaction_rating, resolution:resolution_id(created_at)')
      .gte('resolution.created_at', startDate.toISOString())
      .lte('resolution.created_at', endDate.toISOString())
      .not('satisfaction_rating', 'is', null);
  
    if (error) {
      console.error('Error getting overall average satisfaction rating:', error);
      throw APIError({
        code: 500,
        success: false,
        error: 'An error occurred while getting overall average satisfaction rating.',
      });
    }
  
    if (data.length === 0) {
      return 0;
    }
  
    const sum = data.reduce((acc, curr) => acc + curr.satisfaction_rating, 0);
    return sum / data.length;
  }

  async getOrganizationAverageSatisfactionRating(organizationId: string, startDate: Date, endDate: Date): Promise<number> {
    const { data, error } = await supabase
      .from('resolution_responses')
      .select('satisfaction_rating, resolution:resolution_id(organization_id, created_at, status)')
      .eq('resolution.organization_id', organizationId)
      .eq('resolution.status', 'accepted')
      .gte('resolution.created_at', startDate.toISOString())
      .lte('resolution.created_at', endDate.toISOString())
      .not('satisfaction_rating', 'is', null);
  
    if (error) {
      console.error('Error getting organization average satisfaction rating:', error);
      throw APIError({
        code: 500,
        success: false,
        error: 'An error occurred while getting organization average satisfaction rating.',
      });
    }
  
    if (data.length === 0) {
      return 0;
    }
  
    const sum = data.reduce((acc, curr) => acc + curr.satisfaction_rating, 0);
    return sum / data.length;
  }
}
