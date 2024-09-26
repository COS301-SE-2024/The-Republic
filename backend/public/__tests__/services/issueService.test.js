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
const issueService_1 = __importDefault(require("@/modules/issues/services/issueService"));
const issueRepository_1 = __importDefault(require("@/modules/issues/repositories/issueRepository"));
const locationRepository_1 = require("@/modules/locations/repositories/locationRepository");
const response_1 = require("@/types/response");
const openAIService_1 = require("@/modules/shared/services/openAIService");
jest.mock("@/modules/issues/repositories/issueRepository");
jest.mock("@/modules/locations/repositories/locationRepository");
jest.mock("@/modules/points/services/pointsService");
describe("IssueService", () => {
    let issueService;
    let issueRepository;
    let locationRepository;
    let mockPointsService;
    let mockClusterService;
    let mockOpenAIService;
    beforeEach(() => {
        issueRepository = new issueRepository_1.default();
        locationRepository =
            new locationRepository_1.LocationRepository();
        issueService = new issueService_1.default();
        issueService.setIssueRepository(issueRepository);
        issueService.setLocationRepository(locationRepository);
        mockPointsService = {
            awardPoints: jest.fn().mockResolvedValue(100),
            getFirstTimeAction: jest.fn().mockResolvedValue(true),
        };
        issueService.setPointsService(mockPointsService);
        issueService.processIssueAsync = jest.fn().mockResolvedValue(undefined);
        issueService.setClusterService(mockClusterService);
        mockOpenAIService = new openAIService_1.OpenAIService();
        issueService.setOpenAIService(mockOpenAIService);
        mockOpenAIService.getEmbedding = jest.fn().mockResolvedValue([0.1, 0.2, 0.3]);
    });
    it("should get all issues", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockIssues = [
            {
                issue_id: 1,
                user_id: "1",
                location_id: null,
                location_data: null,
                category_id: 1,
                content: "Test Issue",
                resolved_at: null,
                is_anonymous: false,
                created_at: "2024-06-01",
                updated_at: "2024-06-01",
                sentiment: "angry",
                image_url: "https://example.com/image.png",
                user: {
                    user_id: "1",
                    email_address: "test@example.com",
                    username: "testuser",
                    fullname: "Test User",
                    image_url: "https://example.com/image.png",
                    is_owner: true,
                    total_issues: 10,
                    resolved_issues: 5,
                    user_score: 0,
                    location_id: null,
                    location: null
                },
                category: {
                    name: "Category 1",
                },
                reactions: [],
                user_reaction: null,
                comment_count: 0,
                is_owner: false,
                profile_user_id: "0",
            },
        ];
        issueRepository.getIssues.mockResolvedValue(mockIssues);
        const response = yield issueService.getIssues({ from: 0, amount: 999 });
        expect(response.data).toEqual(mockIssues);
        expect(issueRepository.getIssues).toHaveBeenCalledTimes(1);
    }));
    it("should get an issue by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockIssue = {
            issue_id: 1,
            user_id: "1",
            location_id: null,
            location_data: null,
            category_id: 1,
            content: "Test Issue",
            resolved_at: null,
            is_anonymous: false,
            created_at: "2022-01-01",
            updated_at: "2022-01-01",
            sentiment: "neutral",
            image_url: "https://example.com/image.png",
            user: {
                user_id: "1",
                email_address: "test@example.com",
                username: "testuser",
                fullname: "Test User",
                image_url: "https://example.com/image.png",
                is_owner: true,
                total_issues: 10,
                resolved_issues: 5,
                user_score: 0,
                location_id: null,
                location: null
            },
            category: {
                name: "Category 1",
            },
            reactions: [],
            user_reaction: null,
            comment_count: 0,
            is_owner: false,
            profile_user_id: "0",
        };
        issueRepository.getIssueById.mockResolvedValue(mockIssue);
        const response = yield issueService.getIssueById({ issue_id: 1 });
        expect(response.data).toEqual(mockIssue);
        expect(issueRepository.getIssueById).toHaveBeenCalledWith(1, undefined);
        expect(issueRepository.getIssueById).toHaveBeenCalledTimes(1);
    }));
    describe("createIssue", () => {
        it("should create a new issue when all required fields are provided", () => __awaiter(void 0, void 0, void 0, function* () {
            const newIssue = {
                user_id: "1",
                location_id: null,
                location_data: {
                    province: "Province",
                    city: "City",
                    suburb: "Suburb",
                    district: "District",
                    place_id: "place_id",
                },
                category_id: 1,
                content: "New Issue",
                resolved_at: null,
                is_anonymous: false,
                sentiment: "neutral",
                image_url: null,
            };
            const createdIssue = {
                issue_id: 1,
                user_id: "1",
                location_id: null,
                location_data: {
                    province: "Province",
                    city: "City",
                    suburb: "Suburb",
                    district: "District",
                    place_id: "place_id",
                },
                category_id: 1,
                content: "New Issue",
                resolved_at: null,
                is_anonymous: false,
                created_at: "2022-01-01",
                updated_at: "2022-01-01",
                sentiment: "neutral",
                image_url: "https://example.com/image.png",
                user: {
                    user_id: "1",
                    email_address: "test@example.com",
                    username: "testuser",
                    fullname: "Test User",
                    image_url: "https://example.com/image.png",
                    is_owner: true,
                    total_issues: 10,
                    resolved_issues: 5,
                    user_score: 0,
                    location_id: null,
                    location: null
                },
                category: {
                    name: "Category 1",
                },
                reactions: [],
                user_reaction: null,
                comment_count: 0,
                is_owner: true,
                profile_user_id: "0",
            };
            issueRepository.createIssue.mockResolvedValue(createdIssue);
            jest.spyOn(issueService, "getIssueById").mockResolvedValue((0, response_1.APIData)({
                success: true,
                code: 200,
                data: createdIssue
            }));
            const response = yield issueService.createIssue(newIssue);
            expect(response.data).toEqual(createdIssue);
            expect(issueRepository.createIssue).toHaveBeenCalledWith(expect.objectContaining(newIssue));
            expect(issueRepository.createIssue).toHaveBeenCalledTimes(1);
            // Check that processIssueAsync was called
            expect(issueService.processIssueAsync).toHaveBeenCalledWith(createdIssue);
            // Wait for any pending promises to resolve
            yield new Promise(process.nextTick);
            expect(mockPointsService.getFirstTimeAction).toHaveBeenCalledWith("1", "created first issue");
            expect(mockPointsService.awardPoints).toHaveBeenCalledWith("1", 50, "created first issue");
            expect(response.data).toEqual(createdIssue);
            expect(issueRepository.createIssue).toHaveBeenCalledWith(newIssue);
            expect(issueRepository.createIssue).toHaveBeenCalledTimes(1);
        }));
        it("should throw an error when required fields are missing", () => __awaiter(void 0, void 0, void 0, function* () {
            const newIssue = { user_id: "1", content: "New Issue" };
            yield expect((() => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    yield issueService.createIssue(newIssue);
                }
                catch (error) {
                    throw new Error(error.error);
                }
            }))()).rejects.toThrow("Missing required fields for creating an issue");
            expect(issueRepository.createIssue).not.toHaveBeenCalled();
        }));
        it("should throw an error when content exceeds the maximum length", () => __awaiter(void 0, void 0, void 0, function* () {
            const newIssue = {
                user_id: "1",
                location_id: null,
                location_data: {
                    province: "Province",
                    city: "City",
                    suburb: "Suburb",
                    district: "District",
                    place_id: "place_id",
                },
                category_id: 1,
                content: "A".repeat(501),
                resolved_at: null,
                is_anonymous: false,
                sentiment: "neutral",
            };
            yield expect((() => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    yield issueService.createIssue(newIssue);
                }
                catch (error) {
                    throw new Error(error.error);
                }
            }))()).rejects.toThrow("Issue content exceeds the maximum length of 500 characters");
            expect(issueRepository.createIssue).not.toHaveBeenCalled();
        }));
    });
    it("should update an existing issue", () => __awaiter(void 0, void 0, void 0, function* () {
        const updateData = { content: "Updated Issue" };
        const updatedIssue = {
            issue_id: 1,
            user_id: "1",
            location_id: null,
            location_data: null,
            category_id: 1,
            content: "Updated Issue",
            resolved_at: null,
            is_anonymous: false,
            created_at: "2022-01-01",
            updated_at: "2022-01-01",
            sentiment: "neutral",
            image_url: null,
            user: {
                user_id: "1",
                email_address: "test@example.com",
                username: "testuser",
                fullname: "Test User",
                image_url: "https://example.com/image.png",
                is_owner: true,
                total_issues: 10,
                resolved_issues: 5,
                user_score: 0,
                location_id: null,
                location: null
            },
            category: {
                name: "Category 1",
            },
            reactions: [],
            user_reaction: null,
            comment_count: 0,
            is_owner: true,
            profile_user_id: "0",
        };
        issueRepository.updateIssue.mockResolvedValue(updatedIssue);
        const response = yield issueService.updateIssue(Object.assign({ issue_id: 1, user_id: "1" }, updateData));
        expect(response.data).toEqual(updatedIssue);
        expect(issueRepository.updateIssue).toHaveBeenCalledWith(1, updateData, "1");
        expect(issueRepository.updateIssue).toHaveBeenCalledTimes(1);
    }));
    it("should delete an issue", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockIssue = {
            issue_id: 1,
            user_id: "1",
            location_id: null,
            location_data: null,
            category_id: 1,
            content: "Test Issue",
            resolved_at: null,
            is_anonymous: false,
            created_at: "2022-01-01",
            updated_at: "2022-01-01",
            sentiment: "neutral",
            image_url: "https://example.com/image.png",
            user: {
                user_id: "1",
                email_address: "test@example.com",
                username: "testuser",
                fullname: "Test User",
                image_url: "https://example.com/image.png",
                is_owner: true,
                total_issues: 10,
                resolved_issues: 5,
                user_score: 0,
                location_id: null,
                location: null
            },
            category: {
                name: "Category 1",
            },
            reactions: [],
            user_reaction: null,
            comment_count: 0,
            is_owner: true,
            profile_user_id: "0",
        };
        issueRepository.getIssueById.mockResolvedValue(mockIssue);
        issueRepository.deleteIssue.mockResolvedValue();
        yield issueService.deleteIssue({ issue_id: 1, user_id: "1" });
        expect(issueRepository.getIssueById).toHaveBeenCalledWith(1, "1");
        expect(issueRepository.deleteIssue).toHaveBeenCalledWith(1, "1");
        expect(issueRepository.deleteIssue).toHaveBeenCalledTimes(1);
    }));
    it("should use existing location if it already exists", () => __awaiter(void 0, void 0, void 0, function* () {
        const newIssue = {
            user_id: "1",
            location_id: 1,
            location_data: {
                province: "Province",
                city: "City",
                suburb: "Suburb",
                district: "District",
                place_id: "place_id",
            },
            category_id: 1,
            content: "New Issue",
            is_anonymous: false,
            sentiment: "neutral",
        };
        const createdIssue = {
            issue_id: 1,
            user_id: "1",
            location_id: 1,
            location_data: {
                province: "Province",
                city: "City",
                suburb: "Suburb",
                district: "District",
                place_id: "place_id",
            },
            category_id: 1,
            content: "New Issue",
            is_anonymous: false,
            sentiment: "neutral",
            created_at: "2022-01-01",
            updated_at: "2022-01-01",
            user: {
                user_id: "1",
                email_address: "test@example.com",
                username: "testuser",
                fullname: "Test User",
                image_url: "https://example.com/image.png",
                is_owner: true,
                total_issues: 10,
                resolved_issues: 5,
                user_score: 0,
                location_id: null,
                location: null
            },
            category: {
                name: "Category 1",
            },
            reactions: [],
            user_reaction: null,
            comment_count: 0,
            is_owner: true,
            resolved_at: null,
            image_url: "https://example.com/image.png",
            profile_user_id: "0",
        };
        issueRepository.createIssue.mockResolvedValue(createdIssue);
        jest.spyOn(issueService, "getIssueById").mockResolvedValue((0, response_1.APIData)({
            success: true,
            code: 200,
            data: createdIssue
        }));
        const response = yield issueService.createIssue(newIssue);
        expect(response.data).toEqual(createdIssue);
        expect(locationRepository.createLocation).not.toHaveBeenCalled();
        expect(issueRepository.createIssue).toHaveBeenCalledTimes(1);
    }));
});
