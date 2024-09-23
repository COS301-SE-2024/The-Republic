import supabase from "@/modules/shared/services/supabaseClient";
import { APIError } from "@/types/response";

export class ResolutionResponseRepository {
  async createResponse(resolutionId: string, userId: string, response: 'accepted' | 'declined', satisfactionRating?: number): Promise<void> {
    const { error } = await supabase
      .from('resolution_responses')
      .insert({ 
        resolution_id: resolutionId, 
        user_id: userId, 
        response,
        satisfaction_rating: response === 'accepted' ? satisfactionRating : null
      });

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while creating a resolution response.",
      });
    }
  }

  async getAcceptedUsers(resolutionId: string): Promise<{ userId: string, satisfactionRating: number | null }[]> {
    const { data, error } = await supabase
      .from('resolution_responses')
      .select('user_id, satisfaction_rating')
      .eq('resolution_id', resolutionId)
      .eq('response', 'accepted');

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while fetching accepted users.",
      });
    }

    return data.map(row => ({ userId: row.user_id, satisfactionRating: row.satisfaction_rating }));
  }

  async getAverageSatisfactionRating(resolutionId: string): Promise<number | null> {
    const { data, error } = await supabase
      .from('resolution_responses')
      .select('satisfaction_rating')
      .eq('resolution_id', resolutionId)
      .eq('response', 'accepted')
      .not('satisfaction_rating', 'is', null);

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while fetching satisfaction ratings.",
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
      .from('resolution_responses')
      .select()
      .eq('resolution_id', resolutionId)
      .eq('user_id', userId)
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
}
