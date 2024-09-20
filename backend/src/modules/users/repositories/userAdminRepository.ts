import supabase from "@/modules/shared/services/supabaseClient";
import { APIError } from "@/types/response";
import { UserExists } from "@/types/users";

export default class UserAdminRepository {
  async usernameExists({
    username,
    user_id,
  }: Partial<UserExists>): Promise<boolean> {
    try {
      let query = supabase
        .from("user")
        .select("username")
        .eq("username", username);
      
      if (user_id) {
        query = query.neq("user_id", user_id);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data.length > 0;
    } catch (error) {
      console.error("Error checking username availability:", error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while checking username availability.",
      });
    }
  }

  async deleteAccountById(userId: string, username: string, email: string) {
    const { data, error } = await supabase
      .from("user")
      .select("*")
      .eq("user_id", userId)
      .eq("username", username)
      .eq("email", email)
      .maybeSingle();

    if (error) {
      console.error("Supabase error:", error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      });
    }

    if (!data) {
      console.error("User not found in database - userId:", userId);
      return null;
    }

    return null;
  }
}
