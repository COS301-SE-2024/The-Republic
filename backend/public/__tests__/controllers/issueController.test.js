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
const issueController = __importStar(require("@/modules/issues/controllers/issueController"));
const issueService_1 = __importDefault(require("@/modules/issues/services/issueService"));
const response_1 = require("@/utilities/response");
const cacheMiddleware_1 = require("@/middleware/cacheMiddleware");
jest.mock("@/modules/issues/services/issueService");
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
describe("Issue Controller", () => {
    let mockRequest;
    let mockResponse;
    let mockNext;
    let mockIssueService;
    beforeEach(() => {
        mockRequest = { body: {}, query: {} };
        mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        mockNext = jest.fn();
        mockIssueService = {
            getIssues: jest.fn(),
            getIssueById: jest.fn(),
            createIssue: jest.fn(),
            updateIssue: jest.fn(),
            deleteIssue: jest.fn(),
            resolveIssue: jest.fn(),
            getUserIssues: jest.fn(),
            getUserResolvedIssues: jest.fn(),
        };
        issueService_1.default.mockImplementation(() => mockIssueService);
        cacheMiddleware_1.cacheMiddleware.mockImplementation(() => (req, res, next) => next());
    });
    const testControllerMethod = (methodName) => __awaiter(void 0, void 0, void 0, function* () {
        const controllerMethod = issueController[methodName];
        if (Array.isArray(controllerMethod)) {
            // If it's an array of middleware, call the last function (actual controller)
            const lastMiddleware = controllerMethod[controllerMethod.length - 1];
            if (typeof lastMiddleware === 'function') {
                yield lastMiddleware(mockRequest, mockResponse, mockNext);
            }
        }
        else if (typeof controllerMethod === 'function') {
            yield controllerMethod(mockRequest, mockResponse);
        }
        expect(response_1.sendResponse).toHaveBeenCalled();
    });
    it("should handle getIssues", () => testControllerMethod("getIssues"));
    it("should handle getIssueById", () => testControllerMethod("getIssueById"));
    it("should handle updateIssue", () => testControllerMethod("updateIssue"));
    it("should handle deleteIssue", () => testControllerMethod("deleteIssue"));
    it("should handle resolveIssue", () => testControllerMethod("resolveIssue"));
    it("should handle getUserIssues", () => testControllerMethod("getUserIssues"));
    it("should handle getUserResolvedIssues", () => testControllerMethod("getUserResolvedIssues"));
    it("should handle createIssue", () => __awaiter(void 0, void 0, void 0, function* () {
        mockRequest.file = {};
        yield testControllerMethod("createIssue");
    }));
    it("should handle errors", () => __awaiter(void 0, void 0, void 0, function* () {
        mockIssueService.getIssues.mockRejectedValue(new Error("Test error"));
        yield testControllerMethod("getIssues");
        expect(response_1.sendResponse).toHaveBeenCalled();
    }));
});
