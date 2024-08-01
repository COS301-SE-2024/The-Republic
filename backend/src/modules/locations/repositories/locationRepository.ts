import supabase from "@/modules/shared/services/supabaseClient";
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

  async getLocationById(locationId: number): Promise<Location | null> {
    const { data, error } = await supabase
      .from("location")
      .select("*")
      .eq("location_id", locationId)
      .single();

    if (error) {
      console.error("Error fetching location by ID:", error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while fetching the location.",
      });
    }

    return data as Location | null;
  }

  async getLocationIds(filter: { province?: string; city?: string; suburb?: string }) {
    let query = supabase.from("location").select("location_id");

    if (filter.province) {
      query = query.eq("province", filter.province);
    }
    if (filter.city) {
      query = query.eq("city", filter.city);
    }
    if (filter.suburb) {
      query = query.eq("suburb", filter.suburb);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching location IDs:", error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while fetching location IDs.",
      });
    }

    return data.map(loc => loc.location_id);
  }
}
