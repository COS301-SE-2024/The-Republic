import supabase from "../services/supabaseClient";
import { User } from "../models/issue";
import { APIError } from "../types/response";

export default class UserRepository {
  async getUserById(userId: string) {
    const { data, error } = await supabase
      .from("user")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error(error);

      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred. Please try again later."
      });
    }

    if (!data) {
      throw APIError({
        code: 404,
        success: false,
        error: "User does not exist"
      });
    }

    return data as User;
  }
}
