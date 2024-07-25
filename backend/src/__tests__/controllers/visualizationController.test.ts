import { Request, Response } from "express";
import { VisualizationService } from "../../services/visualizationService";
import { sendResponse } from "../../utils/response";
import * as visualizationController from "../../controllers/visualizationController";

jest.mock("../../services/visualizationService");
jest.mock("../../utils/response");

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

    // Mock the VisualizationService constructor to return our mock instance
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
