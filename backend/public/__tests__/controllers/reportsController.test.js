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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const reportsController = __importStar(require("@/modules/reports/controllers/reportsController"));
const reportsService_1 = __importDefault(require("@/modules/reports/services/reportsService"));
const response_1 = require("@/utilities/response");
const cacheMiddleware_1 = require("@/middleware/cacheMiddleware");
jest.mock("@/modules/reports/services/reportsService");
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
describe("Reports Controller", () => {
    let mockRequest;
    let mockResponse;
    let mockNext;
    let mockReportsService;
    beforeEach(() => {
        mockRequest = { body: {}, query: {} };
        mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        mockNext = jest.fn();
        mockReportsService = {
            getAllIssuesGroupedByResolutionStatus: jest.fn(),
            getIssueCountsGroupedByResolutionStatus: jest.fn(),
            getIssueCountsGroupedByResolutionAndCategory: jest.fn(),
            getIssuesGroupedByCreatedAt: jest.fn(),
            getIssuesGroupedByCategory: jest.fn(),
            getIssuesCountGroupedByCategoryAndCreatedAt: jest.fn(),
            groupedByPoliticalAssociation: jest.fn(),
        };
        reportsService_1.default.mockImplementation(() => mockReportsService);
        cacheMiddleware_1.cacheMiddleware.mockImplementation(() => (req, res, next) => next());
    });
    const testControllerMethod = (methodName) => __awaiter(void 0, void 0, void 0, function* () {
        const controllerMethod = reportsController[methodName];
        if (Array.isArray(controllerMethod)) {
            for (const middleware of controllerMethod) {
                if (typeof middleware === 'function') {
                    yield middleware(mockRequest, mockResponse, mockNext);
                }
            }
        }
        else if (typeof controllerMethod === 'function') {
            yield controllerMethod(mockRequest, mockResponse, mockNext);
        }
        else {
            throw new Error(`Controller method ${methodName} not found or not a function`);
        }
        expect(response_1.sendResponse).toHaveBeenCalled();
    });
    it("should handle getAllIssuesGroupedByResolutionStatus", () => testControllerMethod("getAllIssuesGroupedByResolutionStatus"));
    it("should handle getIssueCountsGroupedByResolutionStatus", () => testControllerMethod("getIssueCountsGroupedByResolutionStatus"));
    it("should handle getIssueCountsGroupedByResolutionAndCategory", () => testControllerMethod("getIssueCountsGroupedByResolutionAndCategory"));
    it("should handle getIssuesGroupedByCreatedAt", () => testControllerMethod("getIssuesGroupedByCreatedAt"));
    it("should handle getIssuesGroupedByCategory", () => testControllerMethod("getIssuesGroupedByCategory"));
    it("should handle getIssuesCountGroupedByCategoryAndCreatedAt", () => testControllerMethod("getIssuesCountGroupedByCategoryAndCreatedAt"));
    it("should handle groupedByPoliticalAssociation", () => testControllerMethod("groupedByPoliticalAssociation"));
    it("should handle errors", () => __awaiter(void 0, void 0, void 0, function* () {
        mockReportsService.getAllIssuesGroupedByResolutionStatus.mockRejectedValue(new Error("Test error"));
        yield testControllerMethod("getAllIssuesGroupedByResolutionStatus");
        expect(response_1.sendResponse).toHaveBeenCalled();
    }));
});
