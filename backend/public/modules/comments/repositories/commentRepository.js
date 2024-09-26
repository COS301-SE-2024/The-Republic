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
exports.CommentRepository = void 0;
const supabaseClient_1 = __importDefault(require("@/modules/shared/services/supabaseClient"));
const response_1 = require("@/types/response");
class CommentRepository {
    getNumComments(issue_id, parent_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = supabaseClient_1.default
                .from("comment")
                .select("*", {
                count: "exact",
                head: true,
            })
                .eq("issue_id", issue_id);
            query = !parent_id
                ? query.is("parent_id", null)
                : query.eq("parent_id", parent_id);
            const { count, error } = yield query;
            if (error) {
                console.error(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred. Please try again later.",
                });
            }
            return count;
        });
    }
    getComments(_a) {
        return __awaiter(this, arguments, void 0, function* ({ issue_id, user_id, from, amount, parent_id }) {
            let query = supabaseClient_1.default
                .from("comment")
                .select(`
        *,
        user: user_id (
          user_id,
          email_address,
          username,
          fullname,
          image_url,
          user_score
        )
      `)
                .eq("issue_id", issue_id)
                .order("created_at", { ascending: false })
                .range(from, from + amount - 1);
            query = !parent_id
                ? query.is("parent_id", null)
                : query.eq("parent_id", parent_id);
            const { data, error } = yield query;
            if (error) {
                console.error(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred. Please try again later.",
                });
            }
            const comments = data.map((comment) => {
                const isOwner = comment.is_anonymous
                    ? comment.user_id === user_id
                    : comment.user_id === user_id;
                return Object.assign(Object.assign({}, comment), { is_owner: isOwner, user: comment.is_anonymous
                        ? {
                            user_id: null,
                            email_address: null,
                            username: "Anonymous",
                            fullname: "Anonymous",
                            image_url: null,
                        }
                        : comment.user });
            });
            return comments;
        });
    }
    addComment(comment) {
        return __awaiter(this, void 0, void 0, function* () {
            comment.created_at = new Date().toISOString();
            const { data, error } = yield supabaseClient_1.default
                .from("comment")
                .insert(comment)
                .select(`
        *,
        user: user_id (
          user_id,
          email_address,
          username,
          fullname,
          image_url
        )
      `)
                .single();
            if (error) {
                console.error(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred. Please try again later.",
                });
            }
            return Object.assign(Object.assign({}, data), { is_owner: true, user: data.is_anonymous
                    ? {
                        user_id: null,
                        email_address: null,
                        username: "Anonymous",
                        fullname: "Anonymous",
                        image_url: null,
                    }
                    : data.user });
        });
    }
    deleteComment(comment_id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from("comment")
                .delete()
                .eq("comment_id", comment_id)
                .eq("user_id", user_id)
                .select()
                .maybeSingle();
            if (error) {
                console.error(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred. Please try again later.",
                });
            }
            if (!data) {
                throw (0, response_1.APIError)({
                    code: 404,
                    success: false,
                    error: "Comment does not exist",
                });
            }
        });
    }
}
exports.CommentRepository = CommentRepository;
