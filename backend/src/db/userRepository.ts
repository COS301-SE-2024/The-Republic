import supabase from "../services/supabaseClient";

export default class UserRepository {
  async getUserById(userId: string): Promise<any> {
    const { data, error } = await supabase
      .from("user")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (error) throw new Error(error.message);
    return data;
  }
}
