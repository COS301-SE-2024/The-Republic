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
const reportsService_1 = __importDefault(require("@/modules/reports/services/reportsService"));
const reportsRepository_1 = __importDefault(require("@/modules/reports/repositories/reportsRepository"));
jest.mock("@/modules/reports/repositories/reportsRepository");
describe("ReportsService", () => {
    let reportsService;
    let reportsRepository;
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, "error").mockImplementation(() => { });
        reportsRepository =
            new reportsRepository_1.default();
        reportsService = new reportsService_1.default();
        reportsService.setReportsRepository(reportsRepository);
    });
    afterEach(() => {
        console.error.mockRestore();
    });
    describe("getAllIssuesGroupedByResolutionStatus", () => {
        it("should return all issues grouped by resolution status", () => __awaiter(void 0, void 0, void 0, function* () {
            const params = {};
            const mockData = {
                resolved: [
                    {
                        id: 1,
                        category: {
                            name: "Category for 2024-06-20",
                        },
                        location: {
                            suburb: "Suburb for 2024-06-20",
                            city: "City for 2024-06-20",
                            province: "Province for 2024-06-20",
                        },
                    },
                ],
                unresolved: [
                    {
                        id: 2,
                        category: {
                            name: "Category for 2024-06-19",
                        },
                        location: {
                            suburb: "Suburb for 2024-06-19",
                            city: "City for 2024-06-19",
                            province: "Province for 2024-06-19",
                        },
                    },
                ],
            };
            reportsRepository.getAllIssuesGroupedByResolutionStatus.mockResolvedValue(mockData);
            const response = yield reportsService.getAllIssuesGroupedByResolutionStatus(params);
            expect(response.data).toEqual(mockData);
            expect(reportsRepository.getAllIssuesGroupedByResolutionStatus).toHaveBeenCalledWith(params);
            expect(reportsRepository.getAllIssuesGroupedByResolutionStatus).toHaveBeenCalledTimes(1);
        }));
        it("should throw an error when something goes wrong", () => __awaiter(void 0, void 0, void 0, function* () {
            const params = {};
            reportsRepository.getAllIssuesGroupedByResolutionStatus.mockRejectedValue(new Error("Something went wrong"));
            yield expect(reportsService.getAllIssuesGroupedByResolutionStatus(params)).rejects.toEqual(expect.objectContaining({
                code: 404,
                success: false,
                error: "GroupedByResolutionStatus: Something Went wrong",
            }));
            expect(reportsRepository.getAllIssuesGroupedByResolutionStatus).toHaveBeenCalledWith(params);
            expect(reportsRepository.getAllIssuesGroupedByResolutionStatus).toHaveBeenCalledTimes(1);
        }));
    });
    describe("getIssueCountsGroupedByResolutionStatus", () => {
        it("should return issue counts grouped by resolution status", () => __awaiter(void 0, void 0, void 0, function* () {
            const params = {};
            const mockData = { resolved: 5, unresolved: 10 };
            reportsRepository.getIssueCountsGroupedByResolutionStatus.mockResolvedValue(mockData);
            const response = yield reportsService.getIssueCountsGroupedByResolutionStatus(params);
            expect(response.data).toEqual(mockData);
            expect(reportsRepository.getIssueCountsGroupedByResolutionStatus).toHaveBeenCalledWith(params);
            expect(reportsRepository.getIssueCountsGroupedByResolutionStatus).toHaveBeenCalledTimes(1);
        }));
        it("should throw an error when something goes wrong", () => __awaiter(void 0, void 0, void 0, function* () {
            const params = {};
            reportsRepository.getIssueCountsGroupedByResolutionStatus.mockRejectedValue(new Error("Something went wrong"));
            yield expect(reportsService.getIssueCountsGroupedByResolutionStatus(params)).rejects.toEqual(expect.objectContaining({
                code: 404,
                success: false,
                error: "CountsGroupedByResolutionStatus: Something Went wrong",
            }));
            expect(reportsRepository.getIssueCountsGroupedByResolutionStatus).toHaveBeenCalledWith(params);
            expect(reportsRepository.getIssueCountsGroupedByResolutionStatus).toHaveBeenCalledTimes(1);
        }));
    });
    describe("getIssueCountsGroupedByResolutionAndCategory", () => {
        it("should return issue counts grouped by resolution and category", () => __awaiter(void 0, void 0, void 0, function* () {
            const params = {};
            const mockData = {
                resolved: { "Public Safety": 2, "Healthcare Services": 1 },
                unresolved: { Water: 5, Electricity: 1 },
            };
            reportsRepository.getIssueCountsGroupedByResolutionAndCategory.mockResolvedValue(mockData);
            const response = yield reportsService.getIssueCountsGroupedByResolutionAndCategory(params);
            expect(response.data).toEqual(mockData);
            expect(reportsRepository.getIssueCountsGroupedByResolutionAndCategory).toHaveBeenCalledWith(params);
            expect(reportsRepository.getIssueCountsGroupedByResolutionAndCategory).toHaveBeenCalledTimes(1);
        }));
        it("should throw an error when something goes wrong", () => __awaiter(void 0, void 0, void 0, function* () {
            const params = {};
            reportsRepository.getIssueCountsGroupedByResolutionAndCategory.mockRejectedValue(new Error("Something went wrong"));
            yield expect(reportsService.getIssueCountsGroupedByResolutionAndCategory(params)).rejects.toEqual(expect.objectContaining({
                code: 404,
                success: false,
                error: "CountsGroupedByResolutionAndCategory: Something Went wrong",
            }));
            expect(reportsRepository.getIssueCountsGroupedByResolutionAndCategory).toHaveBeenCalledWith(params);
            expect(reportsRepository.getIssueCountsGroupedByResolutionAndCategory).toHaveBeenCalledTimes(1);
        }));
    });
    describe("getIssuesGroupedByCreatedAt", () => {
        it("should return issues grouped by creation date", () => __awaiter(void 0, void 0, void 0, function* () {
            const params = {};
            const mockData = {
                "2024-06-20": [
                    {
                        id: 1,
                        category: {
                            name: "Category for 2024-06-20",
                        },
                        location: {
                            suburb: "Suburb for 2024-06-20",
                            city: "City for 2024-06-20",
                            province: "Province for 2024-06-20",
                        },
                    },
                ],
                "2024-06-19": [
                    {
                        id: 2,
                        category: {
                            name: "Category for 2024-06-19",
                        },
                        location: {
                            suburb: "Suburb for 2024-06-19",
                            city: "City for 2024-06-19",
                            province: "Province for 2024-06-19",
                        },
                    },
                ],
            };
            reportsRepository.getIssuesGroupedByCreatedAt.mockResolvedValue(mockData);
            const response = yield reportsService.getIssuesGroupedByCreatedAt(params);
            expect(response.data).toEqual(mockData);
            expect(reportsRepository.getIssuesGroupedByCreatedAt).toHaveBeenCalledWith(params);
            expect(reportsRepository.getIssuesGroupedByCreatedAt).toHaveBeenCalledTimes(1);
        }));
        it("should throw an error when something goes wrong", () => __awaiter(void 0, void 0, void 0, function* () {
            const params = {};
            reportsRepository.getIssuesGroupedByCreatedAt.mockRejectedValue(new Error("Something went wrong"));
            yield expect(reportsService.getIssuesGroupedByCreatedAt(params)).rejects.toEqual(expect.objectContaining({
                code: 404,
                success: false,
                error: "GroupedByCreatedAt: Something Went wrong",
            }));
            expect(reportsRepository.getIssuesGroupedByCreatedAt).toHaveBeenCalledWith(params);
            expect(reportsRepository.getIssuesGroupedByCreatedAt).toHaveBeenCalledTimes(1);
        }));
    });
    describe("getIssuesGroupedByCategory", () => {
        it("should return issues grouped by category", () => __awaiter(void 0, void 0, void 0, function* () {
            const params = {};
            const mockData = {
                "Public Safety": [
                    {
                        id: 1,
                        category: {
                            name: "Public Safety",
                        },
                        location: {
                            suburb: "Suburb for 2024-06-20",
                            city: "City for 2024-06-20",
                            province: "Province for 2024-06-20",
                        },
                    },
                ],
                Water: [
                    {
                        id: 1,
                        category: {
                            name: "Water",
                        },
                        location: {
                            suburb: "Suburb for 2024-06-20",
                            city: "City for 2024-06-20",
                            province: "Province for 2024-06-20",
                        },
                    },
                ],
            };
            reportsRepository.getIssuesGroupedByCategory.mockResolvedValue(mockData);
            const response = yield reportsService.getIssuesGroupedByCategory(params);
            expect(response.data).toEqual(mockData);
            expect(reportsRepository.getIssuesGroupedByCategory).toHaveBeenCalledWith(params);
            expect(reportsRepository.getIssuesGroupedByCategory).toHaveBeenCalledTimes(1);
        }));
        it("should throw an error when something goes wrong", () => __awaiter(void 0, void 0, void 0, function* () {
            const params = {};
            reportsRepository.getIssuesGroupedByCategory.mockRejectedValue(new Error("Something went wrong"));
            yield expect(reportsService.getIssuesGroupedByCategory(params)).rejects.toEqual(expect.objectContaining({
                code: 404,
                success: false,
                error: "GroupedByCategory: Something Went wrong",
            }));
            expect(reportsRepository.getIssuesGroupedByCategory).toHaveBeenCalledWith(params);
            expect(reportsRepository.getIssuesGroupedByCategory).toHaveBeenCalledTimes(1);
        }));
    });
    describe("getIssuesCountGroupedByCategoryAndCreatedAt", () => {
        it("should return issue counts grouped by category and creation date", () => __awaiter(void 0, void 0, void 0, function* () {
            const params = {};
            const mockData = {
                "Public Safety": { "2024-06-20": 2, "2024-06-19": 1 },
                Water: { "2024-06-20": 0, "2024-06-19": 2 },
            };
            reportsRepository.getIssuesCountGroupedByCategoryAndCreatedAt.mockResolvedValue(mockData);
            const response = yield reportsService.getIssuesCountGroupedByCategoryAndCreatedAt(params);
            expect(response.data).toEqual(mockData);
            expect(reportsRepository.getIssuesCountGroupedByCategoryAndCreatedAt).toHaveBeenCalledWith(params);
            expect(reportsRepository.getIssuesCountGroupedByCategoryAndCreatedAt).toHaveBeenCalledTimes(1);
        }));
        it("should throw an error when something goes wrong", () => __awaiter(void 0, void 0, void 0, function* () {
            const params = {};
            reportsRepository.getIssuesCountGroupedByCategoryAndCreatedAt.mockRejectedValue(new Error("Something went wrong"));
            yield expect(reportsService.getIssuesCountGroupedByCategoryAndCreatedAt(params)).rejects.toEqual(expect.objectContaining({
                code: 404,
                success: false,
                error: "CountGroupedByCategoryAndCreatedAt: Something Went wrong",
            }));
            expect(reportsRepository.getIssuesCountGroupedByCategoryAndCreatedAt).toHaveBeenCalledWith(params);
            expect(reportsRepository.getIssuesCountGroupedByCategoryAndCreatedAt).toHaveBeenCalledTimes(1);
        }));
    });
});
