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
const response_1 = require("@/utilities/response");
const subscriptionsService_1 = __importDefault(require("@/modules/subscriptions/services/subscriptionsService"));
const subscriptionsController = __importStar(require("@/modules/subscriptions/controllers/subscriptionsController"));
jest.mock("@/utilities/response");
jest.mock("@/modules/subscriptions/services/subscriptionsService");
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
const mockSubscriptionsService = subscriptionsService_1.default;
describe("Subscriptions Controller", () => {
    let req;
    let res;
    beforeEach(() => {
        req = {
            body: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        jest.clearAllMocks();
    });
    describe("issueSubscriptions", () => {
        it("should send a successful response", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockResponse = { success: true, code: 200, data: "Issue subscription successful" };
            mockSubscriptionsService.prototype.issueSubscriptions.mockResolvedValue(mockResponse);
            yield subscriptionsController.issueSubscriptions(req, res);
            expect(mockSubscriptionsService.prototype.issueSubscriptions).toHaveBeenCalledWith(req.body);
            expect(response_1.sendResponse).toHaveBeenCalledWith(res, mockResponse);
        }));
        it("should send an error response", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockError = { success: false, error: "Issue subscription failed" };
            mockSubscriptionsService.prototype.issueSubscriptions.mockRejectedValue(mockError);
            yield subscriptionsController.issueSubscriptions(req, res);
            expect(mockSubscriptionsService.prototype.issueSubscriptions).toHaveBeenCalledWith(req.body);
            expect(response_1.sendResponse).toHaveBeenCalledWith(res, mockError);
        }));
    });
    describe("categorySubscriptions", () => {
        it("should send a successful response", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockResponse = { success: true, code: 200, data: "Category subscription successful" };
            mockSubscriptionsService.prototype.categorySubscriptions.mockResolvedValue(mockResponse);
            yield subscriptionsController.categorySubscriptions(req, res);
            expect(mockSubscriptionsService.prototype.categorySubscriptions).toHaveBeenCalledWith(req.body);
            expect(response_1.sendResponse).toHaveBeenCalledWith(res, mockResponse);
        }));
        it("should send an error response", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockError = { success: false, error: "Category subscription failed" };
            mockSubscriptionsService.prototype.categorySubscriptions.mockRejectedValue(mockError);
            yield subscriptionsController.categorySubscriptions(req, res);
            expect(mockSubscriptionsService.prototype.categorySubscriptions).toHaveBeenCalledWith(req.body);
            expect(response_1.sendResponse).toHaveBeenCalledWith(res, mockError);
        }));
    });
    describe("locationSubscriptions", () => {
        it("should send a successful response", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockResponse = { success: true, code: 200, data: "Location subscription successful" };
            mockSubscriptionsService.prototype.locationSubscriptions.mockResolvedValue(mockResponse);
            yield subscriptionsController.locationSubscriptions(req, res);
            expect(mockSubscriptionsService.prototype.locationSubscriptions).toHaveBeenCalledWith(req.body);
            expect(response_1.sendResponse).toHaveBeenCalledWith(res, mockResponse);
        }));
        it("should send an error response", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockError = { success: false, error: "Location subscription failed" };
            mockSubscriptionsService.prototype.locationSubscriptions.mockRejectedValue(mockError);
            yield subscriptionsController.locationSubscriptions(req, res);
            expect(mockSubscriptionsService.prototype.locationSubscriptions).toHaveBeenCalledWith(req.body);
            expect(response_1.sendResponse).toHaveBeenCalledWith(res, mockError);
        }));
    });
    describe("getSubscriptions", () => {
        it("should send a successful response", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockResponse = {
                success: true,
                code: 200,
                data: {
                    issues: [],
                    categories: [],
                    locations: [],
                }
            };
            mockSubscriptionsService.prototype.getSubscriptions.mockResolvedValue(mockResponse);
            yield subscriptionsController.getSubscriptions(req, res);
            expect(mockSubscriptionsService.prototype.getSubscriptions).toHaveBeenCalledWith(req.body);
            expect(response_1.sendResponse).toHaveBeenCalledWith(res, mockResponse);
        }));
        it("should send an error response", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockError = { success: false, error: "Get subscriptions failed" };
            mockSubscriptionsService.prototype.getSubscriptions.mockRejectedValue(mockError);
            yield subscriptionsController.getSubscriptions(req, res);
            expect(mockSubscriptionsService.prototype.getSubscriptions).toHaveBeenCalledWith(req.body);
            expect(response_1.sendResponse).toHaveBeenCalledWith(res, mockError);
        }));
    });
});
