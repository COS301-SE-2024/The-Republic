import supabase from "../services/supabaseClient";
import { APIError } from "../types/response";

export interface Location {
  location_id: number;
  province: string;
  city: string;
  suburb: string;
  district: string;
  place_id: string;
}

export class LocationRepository {
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
        error: "An unexpected error occurred. Please try again later."
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
        error: "An unexpected error occurred. Please try again later."
      });
    }

    return data as Location;
  }
}
