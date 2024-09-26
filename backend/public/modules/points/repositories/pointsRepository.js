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
exports.PointsRepository = void 0;
const supabaseClient_1 = __importDefault(require("@/modules/shared/services/supabaseClient"));
const response_1 = require("@/types/response");
class PointsRepository {
    updateUserScore(userId, points) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .rpc('increment_score', { input_user_id: userId, score_increment: points });
            if (error) {
                console.error(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while updating user score.",
                });
            }
            return data;
        });
    }
    logPointsTransaction(userId, points, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error } = yield supabaseClient_1.default.from("points_history").insert({
                user_id: userId,
                points: points,
                action: reason,
                created_at: new Date().toISOString(),
            });
            if (error) {
                console.error(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while logging points transaction.",
                });
            }
        });
    }
    getUserScore(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from("user")
                .select("user_score")
                .eq("user_id", userId)
                .single();
            if (error) {
                console.error(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while fetching user score.",
                });
            }
            return data.user_score;
        });
    }
    suspendUserFromResolving(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const suspensionEnd = new Date();
            suspensionEnd.setHours(suspensionEnd.getHours() + 24);
            const { error } = yield supabaseClient_1.default
                .from("user")
                .update({ resolve_suspension_end: suspensionEnd.toISOString() })
                .eq("user_id", userId);
            if (error) {
                console.error(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while suspending user from resolving.",
                });
            }
        });
    }
    blockUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error } = yield supabaseClient_1.default
                .from("user")
                .update({ is_blocked: true })
                .eq("user_id", userId);
            if (error) {
                console.error(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while blocking user.",
                });
            }
        });
    }
    getLeaderboard(locationFilter) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = supabaseClient_1.default
                .from('user')
                .select(`
        user_id,
        username,
        fullname,
        image_url,
        user_score,
        location:location_id (
          location_id,
          province,
          city,
          suburb,
          district
        )
      `)
                .order('user_score', { ascending: false })
                .limit(10);
            if (locationFilter.province || locationFilter.city || locationFilter.suburb) {
                query = query.not('location_id', 'is', null);
                if (locationFilter.province)
                    query = query.eq('location.province', locationFilter.province);
                if (locationFilter.city)
                    query = query.eq('location.city', locationFilter.city);
                if (locationFilter.suburb)
                    query = query.eq('location.suburb', locationFilter.suburb);
            }
            const { data, error } = yield query;
            if (error) {
                console.error("Error fetching leaderboard:", error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while fetching the leaderboard.",
                });
            }
            const filteredData = locationFilter.province || locationFilter.city || locationFilter.suburb
                ? data.filter(user => user.location !== null)
                : data;
            return filteredData;
        });
    }
    getUserPosition(userId, locationFilter) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: userData, error: userError } = yield supabaseClient_1.default
                .from('user')
                .select(`
        user_id,
        username,
        fullname,
        email_address,
        image_url,
        user_score,
        location_id,
        location:location_id (
          location_id,
          province,
          city,
          suburb,
          district
        )
      `)
                .eq('user_id', userId)
                .single();
            if (userError || !userData) {
                console.error("Error fetching user:", userError);
                throw (0, response_1.APIError)({
                    code: 404,
                    success: false,
                    error: "User not found.",
                });
            }
            const databaseUser = Object.assign(Object.assign({}, userData), { location: userData.location ? userData.location[0] : null });
            const user = Object.assign(Object.assign({}, databaseUser), { is_owner: true, total_issues: 0, resolved_issues: 0, location_id: userData.location_id || null, location: databaseUser.location || null });
            let query = supabaseClient_1.default
                .from('user')
                .select('user_id', { count: 'exact' })
                .gt('user_score', user.user_score);
            let locationMessage = "";
            if (locationFilter.province || locationFilter.city || locationFilter.suburb) {
                query = query.not('location_id', 'is', null);
                const locationParts = [];
                if (locationFilter.suburb)
                    locationParts.push(locationFilter.suburb);
                if (locationFilter.city)
                    locationParts.push(locationFilter.city);
                if (locationFilter.province)
                    locationParts.push(locationFilter.province);
                locationMessage = `in ${locationParts.join(", ")}`;
                if (!this.userMatchesLocationFilter(user, locationFilter)) {
                    return Object.assign(Object.assign({}, user), { position: null, message: `User not found ${locationMessage}.` });
                }
            }
            else {
                locationMessage = "nationwide";
            }
            const { count, error: countError } = yield query;
            if (countError) {
                console.error("Error fetching user count:", countError);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while calculating user position.",
                });
            }
            const position = (count !== null) ? count + 1 : null;
            return Object.assign(Object.assign({}, user), { position: position !== null ? position.toString() : null, message: `User ranked ${position} ${locationMessage}.` });
        });
    }
    userMatchesLocationFilter(user, locationFilter) {
        if (!user.location)
            return false;
        if (locationFilter.province && user.location.province !== locationFilter.province)
            return false;
        if (locationFilter.city && user.location.city !== locationFilter.city)
            return false;
        if (locationFilter.suburb && user.location.suburb !== locationFilter.suburb)
            return false;
        return true;
    }
}
exports.PointsRepository = PointsRepository;
