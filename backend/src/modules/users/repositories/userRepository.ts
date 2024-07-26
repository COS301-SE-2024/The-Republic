import supabase from "@/modules/shared/services/supabaseClient";
import { User } from "@/modules/shared/models/issue";
import { APIError } from "@/types/response";

export default class UserRepository {
  async getUserById(userId: string) {
    const { data, error } = await supabase
      .from("user")
      .select("*")
      .eq("user_id", userId)
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
      throw APIError({
        code: 404,
        success: false,
        error: "User does not exist",
      });
    }

    const [{ count: totalIssues }, { count: resolvedIssues }] =
      await Promise.all([
        supabase
          .from("issue")
          .select("*", { count: "exact" })
          .eq("user_id", userId),
        supabase
          .from("issue")
          .select("*", { count: "exact" })
          .eq("user_id", userId)
          .not("resolved_at", "is", null),
      ]);

    return {
      ...data,
      total_issues: totalIssues,
      resolved_issues: resolvedIssues,
    } as User;
  }

  async updateUserProfile(userId: string, updateData: Partial<User>) {
    const { data, error } = await supabase
      .from("user")
      .update(updateData)
      .eq("user_id", userId)
      .select()
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
      console.error(
        "User not found in database after update - userId:",
        userId,
      );
      throw APIError({
        code: 404,
        success: false,
        error: "User does not exist",
      });
    }

    return data as User;
  }
}
