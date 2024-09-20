import supabase from "@/modules/shared/services/supabaseClient";
import { APIError } from "@/types/response";
import { UserExists } from "@/types/users";
import { generateRandomString } from "@/utilities/randomString";

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

  async deleteAccountById(userId: string, username: string, email_address: string) {
    const tables = [
      'points_history',
      'subscriptions',
      'organisation_members',
      'join_requests'
    ];

    async function deleteUserRecords() {
      try {
        const deletePromises = tables.map(async (table) => {
          const { data, error } = await supabase
            .from(table)
            .delete()
            .eq('user_id', userId);

          if (error && error.code !== 'PGRST116') {
            throw new Error(`Error deleting from ${table}: ${error.message}`);
          }

          return data;
        });

        await Promise.all(deletePromises);
      } catch (error) {
        // Do Nothing
      }
    }

    const rand = generateRandomString();
    const { data: existingUser, error: fetchError } = await supabase
      .from('user')
      .select('*')
      .eq('user_id', userId)
      .eq('username', username)
      .eq('email_address', email_address)
      .maybeSingle();

    console.log("Error: ", fetchError);
    console.log("User: ",rand ,existingUser);

    if (fetchError || !existingUser) {
      throw APIError({
        code: 500,
        success: false,
        error: "Error occurred, Please confirm details and retry later.",
      });
    } else {
      console.log("Here in Delete 2");
      const { error } = await supabase
        .from('user')
        .update({
          email_address: `deleted_${rand}@gmail.com`,
          username: `deleted_${rand}`,
          image_url: "https://plvofqwscloxamqxcxhz.supabase.co/storage/v1/object/public/user/profile_pictures/default.png",
          fullname: 'deleted_user',
          user_score: 0,
          location_id: null,
          bio: null,
          suspended_until: null,
          suspension_reason: null
        })
        .eq("user_id", userId);

      if (error) {
        console.error("Supabase error:", error);
        throw APIError({
          code: 500,
          success: false,
          error: "Invadid Inputs, Please confirm details and retry later.",
        });
      }

      deleteUserRecords();
      return {
        "deleted": true
      };
    }
  }
}
