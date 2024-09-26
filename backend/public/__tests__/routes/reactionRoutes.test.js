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
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const reactionRoutes_1 = __importDefault(require("@/modules/reactions/routes/reactionRoutes"));
const reactionController_1 = __importDefault(require("@/modules/reactions/controllers/reactionController"));
const middleware_1 = require("@/middleware/middleware");
jest.mock("@/middleware/middleware");
jest.mock("@/modules/reactions/controllers/reactionController");
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
app.use("/reactions", reactionRoutes_1.default);
describe("Reaction Routes", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe("POST /reactions/", () => {
        it("should call addOrRemoveReaction controller", () => __awaiter(void 0, void 0, void 0, function* () {
            middleware_1.verifyAndGetUser.mockImplementation((req, res, next) => next());
            reactionController_1.default.addOrRemoveReaction.mockImplementation((req, res) => res.status(200).json({}));
            const response = yield (0, supertest_1.default)(app).post("/reactions/").send();
            expect(response.status).toBe(200);
            expect(reactionController_1.default.addOrRemoveReaction).toHaveBeenCalled();
        }));
    });
});
