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
const supabaseClient_1 = __importDefault(require("@/modules/shared/services/supabaseClient"));
const response_1 = require("@/types/response");
class ReactionRepository {
    addReaction(reaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const reactionData = reaction;
            reactionData.created_at = new Date().toISOString();
            const { data, error } = yield supabaseClient_1.default
                .from("reaction")
                .insert(reactionData)
                .select()
                .single();
            if (error) {
                console.error(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred. Please try again later.",
                });
            }
            return data;
        });
    }
    deleteReaction(itemId, itemType, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from("reaction")
                .delete()
                .eq(itemType === 'issue' ? "issue_id" : "post_id", itemId)
                .eq("user_id", userId)
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
                    error: "Reaction does not exist",
                });
            }
            return data;
        });
    }
    getReactionByUserAndItem(itemId, itemType, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from("reaction")
                .select("*")
                .eq(itemType === 'issue' ? "issue_id" : "post_id", itemId)
                .eq("user_id", userId)
                .maybeSingle();
            if (error) {
                console.error(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred. Please try again later.",
                });
            }
            return data;
        });
    }
    getReactionCountsByItemId(itemId, itemType) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from("reaction")
                .select("emoji")
                .eq(itemType === 'issue' ? "issue_id" : "post_id", itemId);
            if (error) {
                console.error(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred. Please try again later.",
                });
            }
            // Aggregate the counts manually
            const reactionCounts = {};
            data.forEach((reaction) => {
                if (!reactionCounts[reaction.emoji]) {
                    reactionCounts[reaction.emoji] = 0;
                }
                reactionCounts[reaction.emoji]++;
            });
            // Convert the aggregated counts into an array
            return Object.keys(reactionCounts).map((emoji) => ({
                emoji,
                count: reactionCounts[emoji],
            }));
        });
    }
}
exports.default = ReactionRepository;
