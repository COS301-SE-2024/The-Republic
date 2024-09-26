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
Object.defineProperty(exports, "__esModule", { value: true });
const commentService_1 = require("@/modules/comments/services/commentService");
const commentRepository_1 = require("@/modules/comments/repositories/commentRepository");
const response_1 = require("@/types/response");
jest.mock("@/modules/comments/repositories/commentRepository");
jest.mock("@/modules/points/services/pointsService");
describe("CommentService", () => {
    let commentService;
    let commentRepository;
    let mockPointsService;
    beforeEach(() => {
        commentRepository = new commentRepository_1.CommentRepository();
        mockPointsService = {
            awardPoints: jest.fn().mockResolvedValue(100),
        };
        commentService = new commentService_1.CommentService();
        commentService.setCommentRepository(commentRepository);
        commentService.setPointsService(mockPointsService);
    });
    describe("getNumComments", () => {
        it("should return the number of comments for an issue", () => __awaiter(void 0, void 0, void 0, function* () {
            const params = {
                issue_id: 1,
            };
            commentRepository.getNumComments.mockResolvedValue(10);
            const response = yield commentService.getNumComments(params);
            expect(response.data).toBe(10);
            expect(commentRepository.getNumComments).toHaveBeenCalledWith(1, undefined);
            expect(commentRepository.getNumComments).toHaveBeenCalledTimes(1);
        }));
        it("should throw an error when issue_id is missing", () => __awaiter(void 0, void 0, void 0, function* () {
            const params = {};
            yield expect(commentService.getNumComments(params)).rejects.toEqual((0, response_1.APIError)({
                code: 400,
                success: false,
                error: "Missing required fields for getting number of comments",
            }));
            expect(commentRepository.getNumComments).not.toHaveBeenCalled();
        }));
    });
    describe("getComments", () => {
        it("should return comments for an issue", () => __awaiter(void 0, void 0, void 0, function* () {
            const params = {
                issue_id: 1,
                from: 0,
                amount: 10,
            };
            const mockComments = [
                {
                    comment_id: 1,
                    issue_id: 1,
                    user_id: "1",
                    parent_id: null,
                    content: "Comment 1",
                    is_anonymous: false,
                    created_at: "2022-01-01",
                    user: {
                        user_id: "1",
                        email_address: "test@example.com",
                        username: "testuser",
                        fullname: "Test User",
                        image_url: "https://example.com/image.png",
                        is_owner: false,
                        total_issues: 10,
                        resolved_issues: 5,
                        user_score: 0,
                        location_id: null,
                        location: null,
                    },
                    is_owner: false,
                },
            ];
            commentRepository.getComments.mockResolvedValue(mockComments);
            const response = yield commentService.getComments(params);
            expect(response.data).toEqual(mockComments);
            expect(commentRepository.getComments).toHaveBeenCalledWith(params);
            expect(commentRepository.getComments).toHaveBeenCalledTimes(1);
        }));
        it("should throw an error when required fields are missing", () => __awaiter(void 0, void 0, void 0, function* () {
            const params = {
                issue_id: 1,
            };
            yield expect(commentService.getComments(params)).rejects.toEqual((0, response_1.APIError)({
                code: 400,
                success: false,
                error: "Missing required fields for getting comments",
            }));
            expect(commentRepository.getComments).not.toHaveBeenCalled();
        }));
    });
    describe("addComment", () => {
        it("should add a new comment", () => __awaiter(void 0, void 0, void 0, function* () {
            const newComment = {
                issue_id: 1,
                user_id: "1",
                content: "New Comment",
                is_anonymous: false,
            };
            const addedComment = {
                comment_id: 1,
                issue_id: 1,
                user_id: "1",
                parent_id: null,
                content: "New Comment",
                is_anonymous: false,
                created_at: "2022-01-01",
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
                is_owner: true,
            };
            commentRepository.addComment.mockResolvedValue(addedComment);
            const response = yield commentService.addComment(newComment);
            expect(mockPointsService.awardPoints).toHaveBeenCalledWith("1", 10, "Left a comment on an open issue");
            expect(response.data).toEqual(addedComment);
            expect(commentRepository.addComment).toHaveBeenCalledWith(newComment);
            expect(commentRepository.addComment).toHaveBeenCalledTimes(1);
        }));
        it("should throw an error when user_id is missing", () => __awaiter(void 0, void 0, void 0, function* () {
            const newComment = {
                issue_id: 1,
                content: "New Comment",
                is_anonymous: false,
            };
            yield expect(commentService.addComment(newComment)).rejects.toEqual((0, response_1.APIError)({
                code: 401,
                success: false,
                error: "You need to be signed in to create a comment",
            }));
            expect(commentRepository.addComment).not.toHaveBeenCalled();
        }));
        it("should throw an error when required fields are missing", () => __awaiter(void 0, void 0, void 0, function* () {
            const newComment = {
                user_id: "1",
            };
            yield expect(commentService.addComment(newComment)).rejects.toEqual((0, response_1.APIError)({
                code: 400,
                success: false,
                error: "Missing required fields for creating a comment",
            }));
            expect(commentRepository.addComment).not.toHaveBeenCalled();
        }));
    });
    describe("deleteComment", () => {
        it("should delete a comment", () => __awaiter(void 0, void 0, void 0, function* () {
            const deleteParams = {
                comment_id: 1,
                user_id: "1",
            };
            commentRepository.deleteComment.mockResolvedValue();
            yield commentService.deleteComment(deleteParams);
            expect(commentRepository.deleteComment).toHaveBeenCalledWith(1, "1");
            expect(commentRepository.deleteComment).toHaveBeenCalledTimes(1);
        }));
        it("should throw an error when user_id is missing", () => __awaiter(void 0, void 0, void 0, function* () {
            const deleteParams = {
                comment_id: 1,
            };
            yield expect(commentService.deleteComment(deleteParams)).rejects.toEqual((0, response_1.APIError)({
                code: 401,
                success: false,
                error: "You need to be signed in to delete a comment",
            }));
            expect(commentRepository.deleteComment).not.toHaveBeenCalled();
        }));
        it("should throw an error when comment_id is missing", () => __awaiter(void 0, void 0, void 0, function* () {
            const deleteParams = {
                user_id: "1",
            };
            yield expect(commentService.deleteComment(deleteParams)).rejects.toEqual((0, response_1.APIError)({
                code: 400,
                success: false,
                error: "Missing required fields for deleting a comment",
            }));
            expect(commentRepository.deleteComment).not.toHaveBeenCalled();
        }));
    });
});
