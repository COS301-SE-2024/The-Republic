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
exports.CommentService = void 0;
const commentRepository_1 = require("@/modules/comments/repositories/commentRepository");
const response_1 = require("@/types/response");
const pointsService_1 = require("@/modules/points/services/pointsService");
class CommentService {
    constructor() {
        this.commentRepository = new commentRepository_1.CommentRepository();
        this.pointsService = new pointsService_1.PointsService();
    }
    setCommentRepository(commentRepository) {
        this.commentRepository = commentRepository;
    }
    setPointsService(pointsService) {
        this.pointsService = pointsService;
    }
    getNumComments(_a) {
        return __awaiter(this, arguments, void 0, function* ({ issue_id, parent_id }) {
            if (!issue_id) {
                throw (0, response_1.APIError)({
                    code: 400,
                    success: false,
                    error: "Missing required fields for getting number of comments",
                });
            }
            const count = yield this.commentRepository.getNumComments(issue_id, parent_id);
            return (0, response_1.APIData)({
                code: 200,
                success: true,
                data: count,
            });
        });
    }
    getComments(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!params.issue_id || !params.amount || params.from === undefined) {
                throw (0, response_1.APIError)({
                    code: 400,
                    success: false,
                    error: "Missing required fields for getting comments",
                });
            }
            const comments = yield this.commentRepository.getComments(params);
            const commentsWithUserInfo = comments.map((comment) => {
                const isOwner = comment.user_id === params.user_id;
                if (comment.is_anonymous) {
                    comment.user = {
                        user_id: null,
                        email_address: null,
                        username: "Anonymous",
                        fullname: "Anonymous",
                        image_url: null,
                        is_owner: isOwner,
                        total_issues: null,
                        resolved_issues: null,
                        user_score: 0,
                        location_id: null,
                        location: null
                    };
                }
                else {
                    comment.user.is_owner = isOwner;
                }
                return Object.assign(Object.assign({}, comment), { is_owner: isOwner });
            });
            return (0, response_1.APIData)({
                code: 200,
                success: true,
                data: commentsWithUserInfo,
            });
        });
    }
    addComment(comment) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!comment.user_id) {
                throw (0, response_1.APIError)({
                    code: 401,
                    success: false,
                    error: "You need to be signed in to create a comment",
                });
            }
            if (!comment.issue_id ||
                !comment.content ||
                comment.is_anonymous === undefined) {
                throw (0, response_1.APIError)({
                    code: 400,
                    success: false,
                    error: "Missing required fields for creating a comment",
                });
            }
            (_a = comment.parent_id) !== null && _a !== void 0 ? _a : (comment.parent_id = null);
            delete comment.comment_id;
            const addedComment = yield this.commentRepository.addComment(comment);
            // Award points for adding a comment, but only if it's a top-level comment
            if (!comment.parent_id) {
                yield this.pointsService.awardPoints(comment.user_id, 10, "Left a comment on an open issue");
            }
            return (0, response_1.APIData)({
                code: 201,
                success: true,
                data: addedComment,
            });
        });
    }
    deleteComment(_a) {
        return __awaiter(this, arguments, void 0, function* ({ comment_id, user_id }) {
            if (!user_id) {
                throw (0, response_1.APIError)({
                    code: 401,
                    success: false,
                    error: "You need to be signed in to delete a comment",
                });
            }
            if (!comment_id) {
                throw (0, response_1.APIError)({
                    code: 400,
                    success: false,
                    error: "Missing required fields for deleting a comment",
                });
            }
            yield this.commentRepository.deleteComment(comment_id, user_id);
            return (0, response_1.APIData)({
                code: 204,
                success: true,
            });
        });
    }
}
exports.CommentService = CommentService;
