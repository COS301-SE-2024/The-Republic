import { LocationRepository } from "../repositories/locationRepository";
import { APIData } from "../types/response";

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
}
