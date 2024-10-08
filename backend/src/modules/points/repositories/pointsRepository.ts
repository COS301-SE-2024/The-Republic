import { DatabaseUser, User } from "@/modules/shared/models/issue";
import supabase from "@/modules/shared/services/supabaseClient";
import { APIError } from "@/types/response";

export class PointsRepository {
  async updateUserScore(userId: string, points: number) {
    const { data, error } = await supabase.rpc("increment_score", {
      input_user_id: userId,
      score_increment: points,
    });

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

  async getLeaderboard(locationFilter: {
    province?: string;
    city?: string;
    suburb?: string;
  }) {
    let query = supabase
      .from("user")
      .select(
        `
        user_id,
        username,
        fullname,
        image_url,
        user_score,
        location:location_id (
          location_id,
          province,
          city,
          suburb,
          district
        )
      `,
      )
      .order("user_score", { ascending: false })
      .limit(10);

    if (
      locationFilter.province ||
      locationFilter.city ||
      locationFilter.suburb
    ) {
      query = query.not("location_id", "is", null);
      if (locationFilter.province)
        query = query.eq("location.province", locationFilter.province);
      if (locationFilter.city)
        query = query.eq("location.city", locationFilter.city);
      if (locationFilter.suburb)
        query = query.eq("location.suburb", locationFilter.suburb);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching leaderboard:", error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while fetching the leaderboard.",
      });
    }

    const filteredData =
      locationFilter.province || locationFilter.city || locationFilter.suburb
        ? data.filter((user) => user.location !== null)
        : data;

    return filteredData;
  }

  async getUserPosition(
    userId: string,
    locationFilter: { province?: string; city?: string; suburb?: string },
  ) {
    const { data: userData, error: userError } = await supabase
      .from("user")
      .select(
        `
        user_id,
        username,
        fullname,
        email_address,
        image_url,
        user_score,
        location_id,
        location:location_id (
          location_id,
          province,
          city,
          suburb,
          district
        )
      `,
      )
      .eq("user_id", userId)
      .single();

    if (userError || !userData) {
      console.error("Error fetching user:", userError);
      throw APIError({
        code: 404,
        success: false,
        error: "User not found.",
      });
    }

    const databaseUser: DatabaseUser = {
      ...userData,
      location: userData.location ? userData.location[0] : null,
    };

    const user: User = {
      ...databaseUser,
      is_owner: true,
      total_issues: 0,
      resolved_issues: 0,
      location_id: userData.location_id || null,
      location: databaseUser.location || null,
    };

    let query = supabase
      .from("user")
      .select("user_id", { count: "exact" })
      .gt("user_score", user.user_score);

    let locationMessage = "";

    if (
      locationFilter.province ||
      locationFilter.city ||
      locationFilter.suburb
    ) {
      query = query.not("location_id", "is", null);
      const locationParts = [];
      if (locationFilter.suburb) locationParts.push(locationFilter.suburb);
      if (locationFilter.city) locationParts.push(locationFilter.city);
      if (locationFilter.province) locationParts.push(locationFilter.province);
      locationMessage = `in ${locationParts.join(", ")}`;

      if (!this.userMatchesLocationFilter(user, locationFilter)) {
        return {
          ...user,
          position: null,
          message: `User not found ${locationMessage}.`,
        };
      }
    } else {
      locationMessage = "nationwide";
    }

    const { count, error: countError } = await query;

    if (countError) {
      console.error("Error fetching user count:", countError);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while calculating user position.",
      });
    }

    const position = count !== null ? count + 1 : null;

    return {
      ...user,
      position: position !== null ? position.toString() : null,
      message: `User ranked ${position} ${locationMessage}.`,
    };
  }

  async updateOrganizationScore(organizationId: string, points: number) {
    // First, get the current score
    const { data: currentData, error: fetchError } = await supabase
      .from("organizations")
      .select("points")
      .eq("id", organizationId)
      .single();

    if (fetchError) {
      console.error("Error fetching organization score:", fetchError);
      throw APIError({
        code: 500,
        success: false,
        error:
          "An unexpected error occurred while fetching organization score.",
      });
    }

    const currentPoints = currentData?.points || 0;
    const newPoints = currentPoints + points;

    // Now, update the score
    const { data, error } = await supabase
      .from("organizations")
      .update({ points: newPoints })
      .eq("id", organizationId)
      .select("points")
      .single();

    if (error) {
      console.error("Error updating organization score:", error);
      throw APIError({
        code: 500,
        success: false,
        error:
          "An unexpected error occurred while updating organization score.",
      });
    }

    return data?.points;
  }

  async logOrganizationPointsTransaction(
    organizationId: string,
    points: number,
    reason: string,
  ) {
    const { error } = await supabase.from("points_history").insert({
      organization_id: organizationId,
      points: points,
      action: reason,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error:
          "An unexpected error occurred while logging organization points transaction.",
      });
    }
  }

  async getOrganizationScore(organizationId: string) {
    const { data, error } = await supabase
      .from("organizations")
      .select("points")
      .eq("id", organizationId)
      .single();

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error:
          "An unexpected error occurred while fetching organization score.",
      });
    }

    return data.points;
  }

  private userMatchesLocationFilter(
    user: DatabaseUser,
    locationFilter: { province?: string; city?: string; suburb?: string },
  ): boolean {
    if (!user.location) return false;
    if (
      locationFilter.province &&
      user.location.province !== locationFilter.province
    )
      return false;
    if (locationFilter.city && user.location.city !== locationFilter.city)
      return false;
    if (locationFilter.suburb && user.location.suburb !== locationFilter.suburb)
      return false;
    return true;
  }
}
