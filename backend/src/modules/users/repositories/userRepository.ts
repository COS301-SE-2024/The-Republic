import supabase from "@/modules/shared/services/supabaseClient";
import { User } from "@/modules/shared/models/issue";
import { APIError } from "@/types/response";
import { Suspension } from "@/types/suspension";
import UserAdminRepository from "@/modules/users/repositories/userAdminRepository";

export default class UserRepository {
  private userAdminRepository: UserAdminRepository;

  constructor() {
    this.userAdminRepository = new UserAdminRepository();
  }

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

  async updateUsername(userId: string, newUsername: string): Promise<User> {
    try {
      const isUsernameTaken = await this.userAdminRepository.usernameExists({"username": newUsername, "user_id": userId});

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

  async searchForUser(name?: string, username?: string) {
    let usersQuery = supabase
      .from('user')
      .select(`
        user_id,
        username,
        fullname,
        image_url,
        created_at
      `)
      .limit(3);


    if (username) {
      usersQuery = usersQuery.ilike("username", `%${username}%`);
    } else if (name) {
      usersQuery = usersQuery.or(`username.ilike.%${name}%, fullname.ilike.%${name}%`);
    }

    const { data: users, error: usersError } = await usersQuery; 

    if (usersError) {
      console.log("searchForUser (user): ", usersError);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while searching for a user",
      });
    }

    let orgsQuery = supabase
      .from('organizations')
      .select(`
        id,
        name,
        username,
        profile_photo,
        created_at
      `)
      .limit(3);

    if (username) {
      orgsQuery = orgsQuery.ilike("username", `%${username}%`);
    } else if (name) {
      orgsQuery = orgsQuery.or(`username.ilike.%${name}%, name.ilike.%${name}%`);
    }

    const { data: orgs, error: orgsError } = await orgsQuery;

    if (orgsError) {
      console.log("searchForUser (org): ", orgsError);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while searching for an organization",
      });
    }

    return [...users, ...orgs]
      .map((user) => ({
        id: 'id' in user ? user.id : user.user_id,
        name: 'name' in user ? user.name : user.fullname,
        username: user.username,
        image_url: 'image_url' in user ? user.image_url : user.profile_photo,
        created_at: user.created_at,
        type: 'user_id' in user ? 'user' : 'org'
      }))
      .sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  }

  async suspendUser(userId: string, reason: string, until: Date) {
    const { 
      data: currentSuspension, 
      error: currentSuspensionError 
    } = await supabase
      .from("user")
      .select("suspended_until")
      .eq("user_id", userId)
      .single();

    if (currentSuspensionError) {
      console.error("suspendUser: ", currentSuspensionError);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while suspending user from resolving.",
      });
    }

    if (new Date(currentSuspension.suspended_until) > until) {
      return; // User already has longer suspension
    }

    const { error } = await supabase
      .from("user")
      .update({
        suspended_until: until,
        suspension_reason: reason
      })
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

  async getSuspension(userId: string): Promise<Suspension> {
    const { error, data } = await supabase
      .from("user")
      .select("suspended_until, suspension_reason")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.log("getSuspension: ", error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while checking suspension.",
      });
    }

    return {
      ...data,
      is_suspended: new Date() < new Date(data.suspended_until),
    };
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
