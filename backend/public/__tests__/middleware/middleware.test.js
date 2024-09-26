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
const supabaseClient_1 = __importDefault(require("@/modules/shared/services/supabaseClient"));
const middleware_1 = require("@/middleware/middleware");
const response_1 = require("@/utilities/response");
jest.mock("@/modules/shared/services/supabaseClient");
jest.mock("@/utilities/response");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(middleware_1.serverMiddleare);
app.get("/test", middleware_1.verifyAndGetUser, (req, res) => {
    res.status(200).json({ message: "success", user_id: req.body.user_id });
});
describe("Middleware", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, "error").mockImplementation(() => { });
        process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";
    });
    afterEach(() => {
        console.error.mockRestore();
        delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    });
    it("should call next() if no authorization header", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/test");
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("success");
        expect(response.body.user_id).toBeUndefined();
        expect(supabaseClient_1.default.auth.getUser).not.toHaveBeenCalled();
    }));
    it("should call next() if service role key is provided", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/test")
            .set("x-service-role-key", "test-service-role-key");
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("success");
        expect(supabaseClient_1.default.auth.getUser).not.toHaveBeenCalled();
    }));
    it("should call next() if token is valid", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockUser = { id: "123" };
        supabaseClient_1.default.auth.getUser.mockResolvedValue({
            data: { user: mockUser },
            error: null,
        });
        const response = yield (0, supertest_1.default)(app)
            .get("/test")
            .set("Authorization", "Bearer validtoken");
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("success");
        expect(response.body.user_id).toBe("123");
        expect(supabaseClient_1.default.auth.getUser).toHaveBeenCalledWith("validtoken");
    }));
    it("should send 403 error response if token is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        supabaseClient_1.default.auth.getUser.mockResolvedValue({
            data: { user: null },
            error: new Error("Invalid token"),
        });
        response_1.sendResponse.mockImplementation((res, data) => {
            res.status(data.code).json(data);
        });
        const response = yield (0, supertest_1.default)(app)
            .get("/test")
            .set("Authorization", "Bearer invalidtoken");
        expect(response.status).toBe(403);
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe("Invalid token");
        expect(supabaseClient_1.default.auth.getUser).toHaveBeenCalledWith("invalidtoken");
    }));
    it("should send 500 error response if an unexpected error occurs", () => __awaiter(void 0, void 0, void 0, function* () {
        supabaseClient_1.default.auth.getUser.mockRejectedValue(new Error("Unexpected error"));
        response_1.sendResponse.mockImplementation((res, data) => {
            res.status(data.code).json(data);
        });
        const response = yield (0, supertest_1.default)(app)
            .get("/test")
            .set("Authorization", "Bearer validtoken");
        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe("An unexpected error occurred. Please try again later.");
        expect(supabaseClient_1.default.auth.getUser).toHaveBeenCalledWith("validtoken");
    }));
});
