import { Request, Response, NextFunction } from "express";
import * as locationController from "@/modules/locations/controllers/locationController";
import { LocationService } from "@/modules/locations/services/locationService";
import { sendResponse } from "@/utilities/response";
import { APIResponse } from "@/types/response";
import { cacheMiddleware } from "@/middleware/cacheMiddleware";
import { Location } from "@/modules/locations/repositories/locationRepository"; // Adjust the import path as necessary

jest.mock("@/modules/locations/services/locationService");
jest.mock("@/utilities/response");
jest.mock("@/middleware/cacheMiddleware");
jest.mock("@/utilities/cacheUtils");

jest.mock("@/modules/shared/services/redisClient", () => ({
  __esModule: true,
  default: {
    on: jest.fn(),
    get: jest.fn(),
    setex: jest.fn(),
    del: jest.fn(),
    keys: jest.fn().mockResolvedValue([]),
  },
}));

describe("Location Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let mockLocationService: jest.Mocked<LocationService>;

  beforeEach(() => {
    mockRequest = { body: {}, query: {}, params: {} };
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    mockLocationService = {
      getAllLocations: jest.fn(),
      getLocationById: jest.fn(),
    } as unknown as jest.Mocked<LocationService>;
    (LocationService as jest.MockedClass<typeof LocationService>).mockImplementation(() => mockLocationService);
    (cacheMiddleware as jest.Mock).mockImplementation(() => (req: Request, res: Response, next: NextFunction) => next());
  });

  const testControllerMethod = async (
    methodName: keyof typeof locationController,
  ) => {
    const controllerMethod = locationController[methodName];
    if (Array.isArray(controllerMethod)) {
      for (const middleware of controllerMethod) {
        if (typeof middleware === 'function') {
          await middleware(mockRequest as Request, mockResponse as Response, mockNext);
        }
      }
    } else if (typeof controllerMethod === 'function') {
      await (controllerMethod as (req: Request, res: Response, next: NextFunction) => Promise<void>)(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
    } else {
      throw new Error(`Controller method ${methodName} not found or not a function`);
    }
    expect(sendResponse).toHaveBeenCalled();
  };

  it("should handle getAllLocations", async () => {
    const mockAPIResponse: APIResponse<string[]> = {
      success: true,
      code: 200,
      data: [],
    };
    mockLocationService.getAllLocations.mockResolvedValue(mockAPIResponse);
    await testControllerMethod("getAllLocations");
  });

  it("should handle getLocationById", async () => {
    const mockAPIResponse: APIResponse<Location> = {
      success: true,
      code: 200,
      data: {
        location_id: 1,
        province: "Test Province",
        city: "Test City",
        suburb: "Test Suburb",
        district: "Test",
        place_id: "4",
        latitude: "0", 
        longitude: "0", 
      },
    };
    mockLocationService.getLocationById.mockResolvedValue(mockAPIResponse);
    mockRequest.params = { id: "1" };
    await testControllerMethod("getLocationById");
  });

  it("should handle errors in getAllLocations", async () => {
    mockLocationService.getAllLocations.mockRejectedValue(new Error("Test error"));
    await testControllerMethod("getAllLocations");
  });

  it("should handle errors in getLocationById", async () => {
    mockLocationService.getLocationById.mockRejectedValue(new Error("Test error"));
    mockRequest.params = { id: "1" };
    await testControllerMethod("getLocationById");
  });
});
