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
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const commentRoutes_1 = __importDefault(require("@/modules/comments/routes/commentRoutes"));
const commentController = __importStar(require("@/modules/comments/controllers/commentController"));
const middleware_1 = require("@/middleware/middleware");
jest.mock("@/middleware/middleware");
jest.mock("@/modules/comments/controllers/commentController");
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
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/comments", commentRoutes_1.default);
describe("Comments Routes", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe("POST /comments/", () => {
        it("should call getComments controller", () => __awaiter(void 0, void 0, void 0, function* () {
            middleware_1.verifyAndGetUser.mockImplementation((req, res, next) => next());
            commentController.getComments.mockImplementation((req, res) => res.status(200).json({}));
            const response = yield (0, supertest_1.default)(app).post("/comments/").send();
            expect(response.status).toBe(200);
            expect(commentController.getComments).toHaveBeenCalled();
        }));
    });
    describe("POST /comments/count", () => {
        it("should call getNumComments controller", () => __awaiter(void 0, void 0, void 0, function* () {
            middleware_1.verifyAndGetUser.mockImplementation((req, res, next) => next());
            commentController.getNumComments.mockImplementation((req, res) => res.status(200).json({}));
            const response = yield (0, supertest_1.default)(app).post("/comments/count").send();
            expect(response.status).toBe(200);
            expect(commentController.getNumComments).toHaveBeenCalled();
        }));
    });
    describe("POST /comments/add", () => {
        it("should call addComment controller", () => __awaiter(void 0, void 0, void 0, function* () {
            middleware_1.verifyAndGetUser.mockImplementation((req, res, next) => next());
            commentController.addComment.mockImplementation((req, res) => res.status(200).json({}));
            const response = yield (0, supertest_1.default)(app).post("/comments/add").send();
            expect(response.status).toBe(200);
            expect(commentController.addComment).toHaveBeenCalled();
        }));
    });
    describe("DELETE /comments/delete", () => {
        it("should call deleteComment controller", () => __awaiter(void 0, void 0, void 0, function* () {
            middleware_1.verifyAndGetUser.mockImplementation((req, res, next) => next());
            commentController.deleteComment.mockImplementation((req, res) => res.status(200).json({}));
            const response = yield (0, supertest_1.default)(app).delete("/comments/delete").send();
            expect(response.status).toBe(200);
            expect(commentController.deleteComment).toHaveBeenCalled();
        }));
    });
});