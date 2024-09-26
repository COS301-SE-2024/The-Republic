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
const supabaseClient_1 = __importDefault(require("../../shared/services/supabaseClient"));
const response_1 = require("../../../types/response");
class UserRepository {
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from("user")
                .select("*")
                .eq("user_id", userId)
                .maybeSingle();
            if (error) {
                console.error("Supabase error:", error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred. Please try again later.",
                });
            }
            if (!data) {
                console.error("User not found in database - userId:", userId);
                return null;
                throw (0, response_1.APIError)({
                    code: 404,
                    success: false,
                    error: "User does not exist",
                });
            }
            const [{ count: totalIssues }, { count: resolvedIssues }] = yield Promise.all([
                supabaseClient_1.default
                    .from("issue")
                    .select("*", { count: "exact" })
                    .eq("user_id", userId),
                supabaseClient_1.default
                    .from("issue")
                    .select("*", { count: "exact" })
                    .eq("user_id", userId)
                    .not("resolved_at", "is", null),
            ]);
            return Object.assign(Object.assign({}, data), { total_issues: totalIssues, resolved_issues: resolvedIssues });
        });
    }
    updateUserProfile(userId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from("user")
                .update(updateData)
                .eq("user_id", userId)
                .select()
                .maybeSingle();
            if (error) {
                console.error("Supabase error:", error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred. Please try again later.",
                });
            }
            if (!data) {
                console.error("User not found in database after update - userId:", userId);
                throw (0, response_1.APIError)({
                    code: 404,
                    success: false,
                    error: "User does not exist",
                });
            }
            return data;
        });
    }
    updateUserLocation(userId, locationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from("user")
                .update({ location_id: locationId })
                .eq("user_id", userId)
                .single();
            if (error) {
                console.error("Supabase error:", error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while updating user location.",
                });
            }
            return data;
        });
    }
    getUserWithLocation(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from("user")
                .select(`
        *,
        location:location_id (
          location_id,
          province,
          city,
          suburb,
          district
        )
      `)
                .eq("user_id", userId)
                .single();
            if (error) {
                console.error("Supabase error:", error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while fetching user data.",
                });
            }
            return data;
        });
    }
    updateUsername(userId, newUsername) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from("user")
                .update({ username: newUsername })
                .eq("user_id", userId)
                .select()
                .single();
            if (error) {
                console.error("Supabase error:", error);
                if (error.message.includes("duplicate key value violates unique constraint")) {
                    throw (0, response_1.APIError)({
                        code: 409,
                        success: false,
                        error: "Username already taken.",
                    });
                }
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while updating username.",
                });
            }
            return data;
        });
    }
    isUsernameTaken(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from("user")
                .select("username")
                .eq("username", username)
                .maybeSingle();
            if (error) {
                console.error("Supabase error:", error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while checking username availability.",
                });
            }
            return !!data;
        });
    }
}
exports.default = UserRepository;
