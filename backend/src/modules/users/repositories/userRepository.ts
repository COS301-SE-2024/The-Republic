import supabase from "../../shared/services/supabaseClient";
import { User } from "../../shared/models/issue";
import { APIError } from "../../../types/response";
import { UserExists } from "@/types/users";

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

  async updateUserLocation(userId: string, locationId: number) {
    const { data, error } = await supabase
      .from("user")
      .update({ location_id: locationId })
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while updating user location.",
      });
    }

    return data;
  }

  async getUserWithLocation(userId: string) {
    const { data, error } = await supabase
      .from("user")
      .select(`
        *,
        location:location_id (
          location_id,
          province,
          city,
          suburb,
          district
        )
      `)
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while fetching user data.",
      });
    }

    return data;
  }

  async isUsernameTaken(
    params: Partial<UserExists>
  ): Promise<boolean> {
    try {
      const { username, user_id: excludeUserId } = params;
      
      console.log("Paramenters: ", params);

      if (username) {
        let query = supabase
          .from("user")
          .select("username")
          .eq("username", username);
        
        if (excludeUserId) {
          query = query.neq("user_id", excludeUserId);
        }
  
        const { data, error } = await query;
  
        if (error) {
          throw error;
        }
  
        return data.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error checking username availability:", error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while checking username availability.",
      });
    }
  }

  async updateUsername(userId: string, newUsername: string): Promise<User> {
    try {

      const isUsernameTaken = await this.isUsernameTaken({"username": newUsername, "user_id": userId});

      if (isUsernameTaken) {
        throw APIError({
          code: 409,
          success: false,
          error: "Username already exists.",
        });
      }

      const { data, error } = await supabase
        .from("user")
        .update({ username: newUsername })
        .eq("user_id", userId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        throw APIError({
          code: 404,
          success: false,
          error: "User not found.",
        });
      }

      return data;
    } catch (error) {
      console.error("Error updating username:", error);

      if (error instanceof APIError) {
        throw error;
      }

      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while updating username.",
      });
    }
  }
}
