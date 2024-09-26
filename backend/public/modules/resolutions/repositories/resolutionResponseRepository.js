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
exports.ResolutionResponseRepository = void 0;
const supabaseClient_1 = __importDefault(require("@/modules/shared/services/supabaseClient"));
const response_1 = require("@/types/response");
class ResolutionResponseRepository {
    createResponse(resolutionId, userId, response, satisfactionRating) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error } = yield supabaseClient_1.default
                .from('resolution_responses')
                .insert({
                resolution_id: resolutionId,
                user_id: userId,
                response,
                satisfaction_rating: response === 'accepted' ? satisfactionRating : null
            });
            if (error) {
                console.error(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while creating a resolution response.",
                });
            }
        });
    }
    getAcceptedUsers(resolutionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from('resolution_responses')
                .select('user_id, satisfaction_rating')
                .eq('resolution_id', resolutionId)
                .eq('response', 'accepted');
            if (error) {
                console.error(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while fetching accepted users.",
                });
            }
            return data.map(row => ({ userId: row.user_id, satisfactionRating: row.satisfaction_rating }));
        });
    }
    getAverageSatisfactionRating(resolutionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from('resolution_responses')
                .select('satisfaction_rating')
                .eq('resolution_id', resolutionId)
                .eq('response', 'accepted')
                .not('satisfaction_rating', 'is', null);
            if (error) {
                console.error(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while fetching satisfaction ratings.",
                });
            }
            if (data.length === 0) {
                return null;
            }
            const sum = data.reduce((acc, curr) => acc + curr.satisfaction_rating, 0);
            return sum / data.length;
        });
    }
}
exports.ResolutionResponseRepository = ResolutionResponseRepository;
