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
const issueRoutes_1 = __importDefault(require("@/modules/issues/routes/issueRoutes"));
const issueController = __importStar(require("@/modules/issues/controllers/issueController"));
const middleware_1 = require("@/middleware/middleware");
jest.mock("@/middleware/middleware");
jest.mock("@/modules/issues/controllers/issueController", () => ({
    getIssues: [jest.fn()],
    getIssueById: [jest.fn()],
    createIssue: [jest.fn()],
    updateIssue: [jest.fn()],
    deleteIssue: [jest.fn()],
    getUserIssues: [jest.fn()],
    getUserResolvedIssues: [jest.fn()],
    createSelfResolution: [jest.fn()],
    createExternalResolution: [jest.fn()],
    respondToResolution: [jest.fn()],
    getUserResolutions: [jest.fn()],
    deleteResolution: [jest.fn()],
    getOrganizationResolutions: [jest.fn()],
}));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/issues", issueRoutes_1.default);
describe("Issue Routes", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        middleware_1.verifyAndGetUser.mockImplementation((req, res, next) => next());
    });
    it("should call getIssues controller", () => __awaiter(void 0, void 0, void 0, function* () {
        issueController.getIssues[0].mockImplementation((req, res) => res.status(200).json({}));
        const response = yield (0, supertest_1.default)(app).post("/issues");
        expect(response.status).toBe(200);
        expect(issueController.getIssues[0]).toHaveBeenCalled();
    }));
});