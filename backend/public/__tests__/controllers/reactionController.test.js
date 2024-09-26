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
const reactionController_1 = __importDefault(require("@/modules/reactions/controllers/reactionController"));
const reactionService_1 = __importDefault(require("@/modules/reactions/services/reactionService"));
const response_1 = require("@/utilities/response");
jest.mock("@/modules/reactions/services/reactionService");
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
describe("Reaction Controller", () => {
    let mockRequest;
    let mockResponse;
    let mockReactionService;
    beforeEach(() => {
        mockRequest = { body: {} };
        mockResponse = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        mockReactionService = new reactionService_1.default();
        reactionService_1.default.mockImplementation(() => mockReactionService);
    });
    it("should handle addOrRemoveReaction", () => __awaiter(void 0, void 0, void 0, function* () {
        yield reactionController_1.default.addOrRemoveReaction(mockRequest, mockResponse);
        expect(response_1.sendResponse).toHaveBeenCalled();
    }));
    it("should handle errors in addOrRemoveReaction", () => __awaiter(void 0, void 0, void 0, function* () {
        mockReactionService.addOrRemoveReaction.mockRejectedValue(new Error("Test error"));
        yield reactionController_1.default.addOrRemoveReaction(mockRequest, mockResponse);
        expect(response_1.sendResponse).toHaveBeenCalled();
    }));
});
