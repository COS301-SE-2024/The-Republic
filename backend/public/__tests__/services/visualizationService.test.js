"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const visualizationService_1 = require("@/modules/visualizations/services/visualizationService");
const visualizationRepository_1 = require("@/modules/visualizations/repositories/visualizationRepository");
const response_1 = require("@/types/response");
jest.mock("@/modules/visualizations/repositories/visualizationRepository");
describe("VisualizationService", () => {
    let visualizationService;
    let visualizationRepository;
    beforeEach(() => {
        jest.clearAllMocks();
        visualizationRepository =
            new visualizationRepository_1.VisualizationRepository();
        visualizationService = new visualizationService_1.VisualizationService();
        visualizationService["visualizationRepository"] = visualizationRepository;
    });
    describe("getVizData", () => {
        it("should return visualization data successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockVizData = [
                { $count: 1, "Chart 1": 3 },
                { $count: 2, "Chart 2": 3 },
            ];
            visualizationRepository.getVizData.mockResolvedValue(mockVizData[0]);
            const response = yield visualizationService.getVizData();
            expect(response).toEqual((0, response_1.APIData)({
                code: 200,
                success: true,
                data: mockVizData[0],
            }));
            expect(visualizationRepository.getVizData).toHaveBeenCalledTimes(1);
        }));
        it("should handle an error when fetching visualization data", () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error("Failed to fetch data");
            visualizationRepository.getVizData.mockRejectedValue(error);
            try {
                yield visualizationService.getVizData();
            }
            catch (e) {
                expect(e).toBe(error);
            }
            expect(visualizationRepository.getVizData).toHaveBeenCalledTimes(1);
        }));
    });
});
