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
exports.ResolutionRepository = void 0;
const supabaseClient_1 = __importDefault(require("@/modules/shared/services/supabaseClient"));
const response_1 = require("@/types/response");
class ResolutionRepository {
    createResolution(resolution) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from('resolution')
                .insert(resolution)
                .select()
                .single();
            if (error) {
                console.error(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while creating a resolution.",
                });
            }
            return data;
        });
    }
    getResolutionById(resolutionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from('resolution')
                .select('*')
                .eq('resolution_id', resolutionId)
                .single();
            if (error) {
                console.error(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while fetching the resolution.",
                });
            }
            return data;
        });
    }
    updateResolution(resolutionId, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from('resolution')
                .update(Object.assign(Object.assign({}, updates), { updated_at: new Date().toISOString() }))
                .eq('resolution_id', resolutionId)
                .select()
                .single();
            if (error) {
                console.error(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while updating the resolution.",
                });
            }
            return data;
        });
    }
    getResolutionsByIssueId(issueId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from('resolution')
                .select('*')
                .eq('issue_id', issueId);
            if (error) {
                console.error(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while fetching resolutions for the issue.",
                });
            }
            return data;
        });
    }
    getUserResolutions(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from('resolution')
                .select('*')
                .eq('resolver_id', userId)
                .order('created_at', { ascending: false });
            if (error) {
                console.error(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while fetching user resolutions.",
                });
            }
            return data;
        });
    }
    deleteResolution(resolutionId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: resolution, error: fetchError } = yield supabaseClient_1.default
                .from('resolution')
                .select('*')
                .eq('resolution_id', resolutionId)
                .eq('resolver_id', userId)
                .single();
            if (fetchError) {
                console.error(fetchError);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while fetching the resolution.",
                });
            }
            if (!resolution) {
                throw (0, response_1.APIError)({
                    code: 404,
                    success: false,
                    error: "Resolution not found or you don't have permission to delete it.",
                });
            }
            if (resolution.status !== 'pending') {
                throw (0, response_1.APIError)({
                    code: 400,
                    success: false,
                    error: "Only pending resolutions can be deleted.",
                });
            }
            const { error: deleteError } = yield supabaseClient_1.default
                .from('resolution')
                .delete()
                .eq('resolution_id', resolutionId)
                .eq('resolver_id', userId);
            if (deleteError) {
                console.error(deleteError);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while deleting the resolution.",
                });
            }
        });
    }
}
exports.ResolutionRepository = ResolutionRepository;
