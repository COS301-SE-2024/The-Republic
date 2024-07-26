import supabase from "@/utils/supabaseClient";
import { APIError } from "@/types/response";

export interface Location {
  location_id: number;
  province: string;
  city: string;
  suburb: string;
  district: string;
  place_id: string;
}

export class LocationRepository {
  async getAllLocations() {
    const { data, error } = await supabase
      .from("location")
      .select("*")
      .order("province", { ascending: true })
      .order("city", { ascending: true })
      .order("suburb", { ascending: true });

    if (error) {
      console.error("Error fetching locations:", error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while fetching locations.",
      });
    }

    const uniqueLocations = Array.from(
      new Set(
        data.map((loc) =>
          JSON.stringify({
            province: loc.province,
            city: loc.city,
            suburb: loc.suburb,
          }),
        ),
      ),
    ).map((strLoc) => {
      const parsedLoc = JSON.parse(strLoc);
      return data.find(
        (loc) =>
          loc.province === parsedLoc.province &&
          loc.city === parsedLoc.city &&
          loc.suburb === parsedLoc.suburb,
      );
    });

    return uniqueLocations;
  }

  async getLocationByPlacesId(placesId: string): Promise<Location | null> {
    const { data, error } = await supabase
      .from("location")
      .select("*")
      .eq("place_id", placesId)
      .maybeSingle();

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      });
    }

    return data as Location | null;
  }

  async createLocation(location: Partial<Location>): Promise<Location> {
    const { data, error } = await supabase
      .from("location")
      .insert(location)
      .select()
      .single();

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      });
    }

    return data as Location;
  }
}
