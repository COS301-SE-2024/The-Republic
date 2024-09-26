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
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const subscriptionsRoutes_1 = __importDefault(require("@/modules/subscriptions/routes/subscriptionsRoutes"));
const subscriptionsController = __importStar(require("@/modules/subscriptions/controllers/subscriptionsController"));
const middleware_1 = require("@/middleware/middleware");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/subscriptions", subscriptionsRoutes_1.default);
jest.mock("@/middleware/middleware");
jest.mock("@/modules/subscriptions/controllers/subscriptionsController");
describe("Subscription Routes", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe("POST /subscriptions/issue", () => {
        it("should call issueSubscriptions controller", () => __awaiter(void 0, void 0, void 0, function* () {
            middleware_1.verifyAndGetUser.mockImplementation((req, res, next) => next());
            subscriptionsController.issueSubscriptions.mockImplementation((req, res) => res.status(200).json({ message: "Issue subscription successful" }));
            const response = yield (0, supertest_1.default)(app).post("/subscriptions/issue").send();
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Issue subscription successful");
            expect(subscriptionsController.issueSubscriptions).toHaveBeenCalled();
        }));
    });
    describe("POST /subscriptions/category", () => {
        it("should call categorySubscriptions controller", () => __awaiter(void 0, void 0, void 0, function* () {
            middleware_1.verifyAndGetUser.mockImplementation((req, res, next) => next());
            subscriptionsController.categorySubscriptions.mockImplementation((req, res) => res.status(200).json({ message: "Category subscription successful" }));
            const response = yield (0, supertest_1.default)(app).post("/subscriptions/category").send();
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Category subscription successful");
            expect(subscriptionsController.categorySubscriptions).toHaveBeenCalled();
        }));
    });
    describe("POST /subscriptions/location", () => {
        it("should call locationSubscriptions controller", () => __awaiter(void 0, void 0, void 0, function* () {
            middleware_1.verifyAndGetUser.mockImplementation((req, res, next) => next());
            subscriptionsController.locationSubscriptions.mockImplementation((req, res) => res.status(200).json({ message: "Location subscription successful" }));
            const response = yield (0, supertest_1.default)(app).post("/subscriptions/location").send();
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Location subscription successful");
            expect(subscriptionsController.locationSubscriptions).toHaveBeenCalled();
        }));
    });
    describe("POST /subscriptions/subscriptions", () => {
        it("should call getSubscriptions controller", () => __awaiter(void 0, void 0, void 0, function* () {
            middleware_1.verifyAndGetUser.mockImplementation((req, res, next) => next());
            subscriptionsController.getSubscriptions.mockImplementation((req, res) => res.status(200).json({ message: "Get subscriptions successful" }));
            const response = yield (0, supertest_1.default)(app).post("/subscriptions/subscriptions").send();
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Get subscriptions successful");
            expect(subscriptionsController.getSubscriptions).toHaveBeenCalled();
        }));
    });
});
