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
const locationController = __importStar(require("@/modules/locations/controllers/locationController"));
const locationService_1 = require("@/modules/locations/services/locationService");
const response_1 = require("@/utilities/response");
const cacheMiddleware_1 = require("@/middleware/cacheMiddleware");
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
    let mockRequest;
    let mockResponse;
    let mockNext;
    let mockLocationService;
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
        };
        locationService_1.LocationService.mockImplementation(() => mockLocationService);
        cacheMiddleware_1.cacheMiddleware.mockImplementation(() => (req, res, next) => next());
    });
    const testControllerMethod = (methodName) => __awaiter(void 0, void 0, void 0, function* () {
        const controllerMethod = locationController[methodName];
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
    it("should handle getAllLocations", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockAPIResponse = {
            success: true,
            code: 200,
            data: [],
        };
        mockLocationService.getAllLocations.mockResolvedValue(mockAPIResponse);
        yield testControllerMethod("getAllLocations");
    }));
    it("should handle getLocationById", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockAPIResponse = {
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
        yield testControllerMethod("getLocationById");
    }));
    it("should handle errors in getAllLocations", () => __awaiter(void 0, void 0, void 0, function* () {
        mockLocationService.getAllLocations.mockRejectedValue(new Error("Test error"));
        yield testControllerMethod("getAllLocations");
    }));
    it("should handle errors in getLocationById", () => __awaiter(void 0, void 0, void 0, function* () {
        mockLocationService.getLocationById.mockRejectedValue(new Error("Test error"));
        mockRequest.params = { id: "1" };
        yield testControllerMethod("getLocationById");
    }));
});
