import { VisualizationService } from "../../services/visualizationService";
import { VisualizationRepository } from "../../db/visualizationRepository";
import { APIData } from "../../types/response";
import { VizData } from "../../types/visualization";
jest.mock("../../db/visualizationRepository");

describe("VisualizationService", () => {
  let visualizationService: VisualizationService;
  let visualizationRepository: jest.Mocked<VisualizationRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    visualizationRepository =
      new VisualizationRepository() as jest.Mocked<VisualizationRepository>;
    visualizationService = new VisualizationService();
    visualizationService["visualizationRepository"] = visualizationRepository;
  });

  describe("getVizData", () => {
    it("should return visualization data successfully", async () => {
      const mockVizData: VizData[] = [
        { $count: 1, "Chart 1": 3 },
        { $count: 2, "Chart 2": 3 },
      ];
      visualizationRepository.getVizData.mockResolvedValue(mockVizData[0]);

      const response = await visualizationService.getVizData();

      expect(response).toEqual(
        APIData({
          code: 200,
          success: true,
          data: mockVizData[0],
        }),
      );
      expect(visualizationRepository.getVizData).toHaveBeenCalledTimes(1);
    });

    it("should handle an error when fetching visualization data", async () => {
      const error = new Error("Failed to fetch data");
      visualizationRepository.getVizData.mockRejectedValue(error);

      try {
        await visualizationService.getVizData();
      } catch (e) {
        expect(e).toBe(error);
      }

      expect(visualizationRepository.getVizData).toHaveBeenCalledTimes(1);
    });
  });
});
