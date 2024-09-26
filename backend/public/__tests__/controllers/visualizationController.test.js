"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const response_1 = require("@/utilities/response");
const visualizationController = __importStar(require("@/modules/visualizations/controllers/visualizationController"));
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
    let mockRequest;
    let mockResponse;
    let mockVisualizationService;
    beforeEach(() => {
        mockRequest = {};
        mockResponse = { json: jest.fn() };
        mockVisualizationService = {
            getVizData: jest.fn(),
        };
        visualizationService_1.VisualizationService.mockImplementation(() => mockVisualizationService);
        jest
            .spyOn(visualizationService_1.VisualizationService.prototype, "getVizData")
            .mockImplementation(mockVisualizationService.getVizData);
    });
    it("should call sendResponse for getVizData", () => __awaiter(void 0, void 0, void 0, function* () {
        yield visualizationController.getVizData(mockRequest, mockResponse);
        expect(response_1.sendResponse).toHaveBeenCalled();
    }));
    it("should handle errors in getVizData", () => __awaiter(void 0, void 0, void 0, function* () {
        const error = new Error("Test error");
        mockVisualizationService.getVizData.mockRejectedValue(error);
        yield visualizationController.getVizData(mockRequest, mockResponse);
        expect(response_1.sendResponse).toHaveBeenCalledWith(mockResponse, expect.any(Error));
    }));
});
