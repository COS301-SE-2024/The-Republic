import supabase from "@/modules/shared/services/supabaseClient";
import { APIError } from "@/types/response";

export class ResolutionResponseRepository {
  async createResponse(resolutionId: string, userId: string, response: 'accepted' | 'declined'): Promise<void> {
    const { error } = await supabase
      .from('resolution_responses')
      .insert({ resolution_id: resolutionId, user_id: userId, response });

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while creating a resolution response.",
      });
    }
  }

  async getAcceptedUsers(resolutionId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('resolution_responses')
      .select('user_id')
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

    return data.map(row => row.user_id);
  }
}