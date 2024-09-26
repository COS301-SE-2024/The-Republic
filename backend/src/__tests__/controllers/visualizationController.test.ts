import { Request, Response } from "express";
import { VisualizationService } from "@/modules/visualizations/services/visualizationService";
import { sendResponse } from "@/utilities/response";
import * as visualizationController from "@/modules/visualizations/controllers/visualizationController";

jest.mock("@/modules/visualizations/services/visualizationService");
jest.mock("@/utilities/response");
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

describe("Visualization Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockVisualizationService: jest.Mocked<VisualizationService>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = { json: jest.fn() } as Partial<Response>;
    mockVisualizationService = {
      getVizData: jest.fn(),
    } as unknown as jest.Mocked<VisualizationService>;
    (
      VisualizationService as jest.MockedClass<typeof VisualizationService>
    ).mockImplementation(() => mockVisualizationService);

    jest
      .spyOn(VisualizationService.prototype, "getVizData")
      .mockImplementation(mockVisualizationService.getVizData);
  });

  it("should call sendResponse for getVizData", async () => {
    await visualizationController.getVizData(
      mockRequest as Request,
      mockResponse as Response,
    );
    expect(sendResponse).toHaveBeenCalled();
  });

  it("should handle errors in getVizData", async () => {
    const error = new Error("Test error");
    mockVisualizationService.getVizData.mockRejectedValue(error);

    await visualizationController.getVizData(
      mockRequest as Request,
      mockResponse as Response,
    );
    expect(sendResponse).toHaveBeenCalledWith(mockResponse, expect.any(Error));
  });
});
