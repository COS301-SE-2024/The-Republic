import { LocationRepository } from "@/modules/locations/repositories/locationRepository";
import { APIData, APIError } from "@/types/response";

export class LocationService {
  private locationRepository: LocationRepository;

  constructor() {
    this.locationRepository = new LocationRepository();
  }

  async getAllLocations() {
    const locations = await this.locationRepository.getAllLocations();

    return APIData({
      code: 200,
      success: true,
      data: locations,
    });
  }

  async getLocationById(locationId: number) {
    const location = await this.locationRepository.getLocationById(locationId);

    if (!location) {
      throw APIError({
        code: 404,
        success: false,
        error: "Location not found",
      });
    }

    return APIData({
      code: 200,
      success: true,
      data: location,
    });
  }

  async getLocationIds(filter: { province?: string; city?: string; suburb?: string }) {
    return this.locationRepository.getLocationIds(filter);
  }
}
