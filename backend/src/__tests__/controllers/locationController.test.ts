import { Request, Response } from "express";
import { LocationService } from "@/modules/locations/services/locationService";
import { sendResponse } from "@/modules/infrastructure/utilities/response";
import { APIResponse } from "@/types/response";
import { getAllLocations } from "@/modules/locations/controllers/locationController";

jest.mock("@/modules/locations/services/locationService");
jest.mock("@/modules/infrastructure/utilities/response");

describe("Location Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockLocationService: jest.Mocked<LocationService>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
    };
    mockLocationService = {
      getAllLocations: jest.fn(),
    } as unknown as jest.Mocked<LocationService>;
    (
      LocationService as jest.MockedClass<typeof LocationService>
    ).mockImplementation(() => mockLocationService);
  });

  describe("getAllLocations", () => {
    it("should call sendResponse", async () => {
      const mockAPIResponse: APIResponse<string[]> = {
        success: true,
        code: 200,
        data: [],
      };
      mockLocationService.getAllLocations.mockResolvedValue(mockAPIResponse);

      await getAllLocations(mockRequest as Request, mockResponse as Response);

      expect(sendResponse).toHaveBeenCalled();
    });

    it("should handle errors", async () => {
      const mockError = new Error("Test error");
      mockLocationService.getAllLocations.mockRejectedValue(mockError);

      await getAllLocations(mockRequest as Request, mockResponse as Response);

      expect(sendResponse).toHaveBeenCalled();
    });
  });
});
