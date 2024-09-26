import { LocationService } from "@/modules/locations/services/locationService";
import { LocationRepository } from "@/modules/locations/repositories/locationRepository";
import { APIData } from "@/types/response";

jest.mock("@/modules/locations/repositories/locationRepository");

describe("LocationService", () => {
  let locationService: LocationService;
  let locationRepositoryMock: jest.Mocked<LocationRepository>;

  beforeEach(() => {
    locationRepositoryMock =
      new LocationRepository() as jest.Mocked<LocationRepository>;
    locationService = new LocationService();
    locationService["locationRepository"] = locationRepositoryMock;
  });

  it("should return all locations with a 200 status code", async () => {
    const mockLocations = [
      { id: 1, name: "Location 1" },
      { id: 2, name: "Location 2" },
    ];
    locationRepositoryMock.getAllLocations.mockResolvedValue(mockLocations);

    const result = await locationService.getAllLocations();

    expect(result).toEqual(
      APIData({
        code: 200,
        success: true,
        data: mockLocations,
      }),
    );
    expect(locationRepositoryMock.getAllLocations).toHaveBeenCalled();
  });

  it("should handle empty locations array", async () => {
    locationRepositoryMock.getAllLocations.mockResolvedValue([]);

    const result = await locationService.getAllLocations();

    expect(result).toEqual(
      APIData({
        code: 200,
        success: true,
        data: [],
      }),
    );
    expect(locationRepositoryMock.getAllLocations).toHaveBeenCalled();
  });
});
