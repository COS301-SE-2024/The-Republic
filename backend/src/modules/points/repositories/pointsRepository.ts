import supabase from "@/modules/shared/services/supabaseClient";
import { APIError } from "@/types/response";

export class PointsRepository {
    async updateUserScore(userId: string, points: number) {
        const { data, error } = await supabase
          .rpc('increment_score', { input_user_id: userId, score_increment: points });
      
        if (error) {
          console.error(error);
          throw APIError({
            code: 500,
            success: false,
            error: "An unexpected error occurred while updating user score.",
          });
        }
      
        return data;
      }

  async logPointsTransaction(userId: string, points: number, reason: string) {
    const { error } = await supabase.from("points_history").insert({
      user_id: userId,
      points: points,
      action: reason,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while logging points transaction.",
      });
    }
  }

  async getUserScore(userId: string) {
    const { data, error } = await supabase
      .from("user")
      .select("user_score")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while fetching user score.",
      });
    }

    return data.user_score;
  }

  async suspendUserFromResolving(userId: string) {
    const suspensionEnd = new Date();
    suspensionEnd.setHours(suspensionEnd.getHours() + 24);

    const { error } = await supabase
      .from("user")
      .update({ resolve_suspension_end: suspensionEnd.toISOString() })
      .eq("user_id", userId);

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while suspending user from resolving.",
      });
    }
  }

  async blockUser(userId: string) {
    const { error } = await supabase
      .from("user")
      .update({ is_blocked: true })
      .eq("user_id", userId);

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while blocking user.",
      });
    }
  }
}