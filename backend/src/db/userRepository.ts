import supabase from "../services/supabaseClient";
import { User } from "../models/issue";

export default class UserRepository {
  async getUserById(userId: string): Promise<User> {
    const { data, error } = await supabase
      .from("user")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (error) throw new Error(error.message);
    return data as User;
  }
}
