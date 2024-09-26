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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const subscriptionsService_1 = __importDefault(require("@/modules/subscriptions/services/subscriptionsService"));
const subscriptionsRepository_1 = __importDefault(require("@/modules/subscriptions/repositories/subscriptionsRepository"));
const response_1 = require("@/types/response");
jest.mock("@/modules/subscriptions/repositories/subscriptionsRepository");
const mockSubscriptionsRepository = subscriptionsRepository_1.default;
describe("SubscriptionsService", () => {
    let subscriptionsService;
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, "error").mockImplementation(() => { });
        subscriptionsService = new subscriptionsService_1.default();
        subscriptionsService.setSubscriptionsRepository(new mockSubscriptionsRepository());
    });
    afterEach(() => {
        console.error.mockRestore();
    });
    describe("issueSubscriptions", () => {
        it("should return a successful response", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockResponse = "Subscription successfully created!";
            mockSubscriptionsRepository.prototype.issueSubscriptions.mockResolvedValue(mockResponse);
            const result = yield subscriptionsService.issueSubscriptions({});
            expect(mockSubscriptionsRepository.prototype.issueSubscriptions).toHaveBeenCalledWith({});
            expect(result).toEqual({ code: 200, success: true, data: mockResponse });
        }));
        it("should throw an APIError on failure", () => __awaiter(void 0, void 0, void 0, function* () {
            mockSubscriptionsRepository.prototype.issueSubscriptions.mockRejectedValue(new Error("Issue subscription failed"));
            yield expect(subscriptionsService.issueSubscriptions({})).rejects.toEqual((0, response_1.APIError)({ code: 404, success: false, error: "Issue: Something Went wrong" }));
        }));
    });
    describe("categorySubscriptions", () => {
        it("should return a successful response", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockResponse = "Subscription successfully created!";
            mockSubscriptionsRepository.prototype.categorySubscriptions.mockResolvedValue(mockResponse);
            const result = yield subscriptionsService.categorySubscriptions({});
            expect(mockSubscriptionsRepository.prototype.categorySubscriptions).toHaveBeenCalledWith({});
            expect(result).toEqual({ code: 200, success: true, data: mockResponse });
        }));
        it("should throw an APIError on failure", () => __awaiter(void 0, void 0, void 0, function* () {
            mockSubscriptionsRepository.prototype.categorySubscriptions.mockRejectedValue(new Error("Category subscription failed"));
            yield expect(subscriptionsService.categorySubscriptions({})).rejects.toEqual((0, response_1.APIError)({ code: 404, success: false, error: "Category: Something Went wrong" }));
        }));
    });
    describe("locationSubscriptions", () => {
        it("should return a successful response", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockResponse = "Subscription successfully created!";
            mockSubscriptionsRepository.prototype.locationSubscriptions.mockResolvedValue(mockResponse);
            const result = yield subscriptionsService.locationSubscriptions({});
            expect(mockSubscriptionsRepository.prototype.locationSubscriptions).toHaveBeenCalledWith({});
            expect(result).toEqual({ code: 200, success: true, data: mockResponse });
        }));
        it("should throw an APIError on failure", () => __awaiter(void 0, void 0, void 0, function* () {
            mockSubscriptionsRepository.prototype.locationSubscriptions.mockRejectedValue(new Error("Location subscription failed"));
            yield expect(subscriptionsService.locationSubscriptions({})).rejects.toEqual((0, response_1.APIError)({ code: 404, success: false, error: "Location: Something Went wrong" }));
        }));
    });
    describe("getSubscriptions", () => {
        it("should return a successful response", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockResponse = {
                issues: [],
                categories: [],
                locations: [],
            };
            mockSubscriptionsRepository.prototype.getSubscriptions.mockResolvedValue(mockResponse);
            const result = yield subscriptionsService.getSubscriptions({});
            expect(mockSubscriptionsRepository.prototype.getSubscriptions).toHaveBeenCalledWith({});
            expect(result).toEqual({ code: 200, success: true, data: mockResponse });
        }));
        it("should throw an APIError on failure", () => __awaiter(void 0, void 0, void 0, function* () {
            mockSubscriptionsRepository.prototype.getSubscriptions.mockRejectedValue(new Error("Get subscriptions failed"));
            yield expect(subscriptionsService.getSubscriptions({})).rejects.toEqual((0, response_1.APIError)({ code: 404, success: false, error: "Notifications: Something Went wrong" }));
        }));
    });
});
