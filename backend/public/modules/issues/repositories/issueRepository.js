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
const luxon_1 = require("luxon");
const response_1 = require("@/types/response");
const reactionRepository_1 = __importDefault(require("@/modules/reactions/repositories/reactionRepository"));
const categoryRepository_1 = require("@/modules/issues/repositories/categoryRepository");
const commentRepository_1 = require("@/modules/comments/repositories/commentRepository");
const locationRepository_1 = require("@/modules/locations/repositories/locationRepository");
const reactionRepository = new reactionRepository_1.default();
const categoryRepository = new categoryRepository_1.CategoryRepository();
const commentRepository = new commentRepository_1.CommentRepository();
class IssueRepository {
    getIssues(_a) {
        return __awaiter(this, arguments, void 0, function* ({ from, amount, category, mood, user_id, order_by = "created_at", ascending = false, location, }) {
            let locationIds = [];
            if (location) {
                let locationQuery = supabaseClient_1.default.from("location").select("location_id");
                if (location.province) {
                    locationQuery = locationQuery.ilike("province", `%${location.province}%`);
                }
                if (location.city) {
                    locationQuery = locationQuery.ilike("city", `%${location.city}%`);
                }
                if (location.suburb) {
                    locationQuery = locationQuery.ilike("suburb", `%${location.suburb}%`);
                }
                if (location.district) {
                    locationQuery = locationQuery.ilike("district", `%${location.district}%`);
                }
                const { data: locationData, error: locationError } = yield locationQuery;
                if (locationError) {
                    console.error("Error fetching locations:", locationError);
                    throw (0, response_1.APIError)({
                        code: 500,
                        success: false,
                        error: "An error occurred while fetching locations.",
                    });
                }
                locationIds = locationData.map((loc) => loc.location_id);
            }
            let query = supabaseClient_1.default
                .from("issue")
                .select(`
        *,
        user: user_id (
          user_id,
          email_address,
          username,
          fullname,
          image_url,
          user_score
        ),
        category: category_id (
          name
        ),
        location: location_id (
          province,
          city,
          suburb,
          district,
          latitude,
          longitude
        ),
        comment_count
      `)
                .order(order_by, { ascending })
                .order("created_at", { ascending })
                .range(from, from + amount - 1);
            if (locationIds.length > 0) {
                query = query.in("location_id", locationIds);
            }
            if (category) {
                const categoryId = yield categoryRepository.getCategoryId(category);
                query = query.eq("category_id", categoryId);
            }
            if (mood) {
                query = query.eq("sentiment", mood);
            }
            const { data, error } = yield query;
            if (error) {
                console.error(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred. Please try again later.",
                });
            }
            const issues = yield Promise.all(data.map((issue) => __awaiter(this, void 0, void 0, function* () {
                var _b, _c;
                const reactions = yield reactionRepository.getReactionCountsByItemId(issue.issue_id.toString(), "issue");
                const userReaction = user_id
                    ? yield reactionRepository.getReactionByUserAndItem(issue.issue_id.toString(), "issue", user_id)
                    : null;
                const pendingResolution = yield this.getPendingResolutionForIssue(issue.issue_id);
                const resolutions = yield this.getResolutionsForIssue(issue.issue_id);
                const userHasIssueInCluster = user_id ? yield this.userHasIssueInCluster(user_id, (_b = issue.cluster_id) !== null && _b !== void 0 ? _b : null) : false;
                const { issues: relatedIssues, totalCount: relatedIssuesCount } = yield this.getRelatedIssues((_c = issue.cluster_id) !== null && _c !== void 0 ? _c : null, issue.issue_id);
                return Object.assign(Object.assign({}, issue), { reactions, user_reaction: (userReaction === null || userReaction === void 0 ? void 0 : userReaction.emoji) || null, is_owner: issue.user_id === user_id, user: issue.is_anonymous
                        ? {
                            user_id: null,
                            email_address: null,
                            username: "Anonymous",
                            fullname: "Anonymous",
                            image_url: null,
                        }
                        : issue.user, hasPendingResolution: !!pendingResolution, pendingResolutionId: (pendingResolution === null || pendingResolution === void 0 ? void 0 : pendingResolution.resolution_id) || null, resolutions,
                    relatedIssuesCount,
                    userHasIssueInCluster,
                    relatedIssues });
            })));
            return issues;
        });
    }
    getIssueById(issueId, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from("issue")
                .select(`
        *,
        user: user_id (
          user_id,
          email_address,
          username,
          fullname,
          image_url,
          user_score
        ),
        category: category_id (
          name
        ),
        location: location_id (
          suburb,
          city,
          province,
          latitude,
          longitude
        ),
        cluster_id
      `)
                .eq("issue_id", issueId)
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
                    error: "Issue does not exist",
                });
            }
            const reactions = yield reactionRepository.getReactionCountsByItemId(data.issue_id.toString(), "issue");
            const userReaction = user_id
                ? yield reactionRepository.getReactionByUserAndItem(data.issue_id.toString(), "issue", user_id)
                : null;
            const commentCount = yield commentRepository.getNumComments(data.issue_id, "issue");
            const pendingResolution = yield this.getPendingResolutionForIssue(data.issue_id);
            const resolutions = yield this.getResolutionsForIssue(data.issue_id);
            const { issues: relatedIssues, totalCount: relatedIssuesCount } = yield this.getRelatedIssues(data.cluster_id, data.issue_id);
            const userHasIssueInCluster = user_id ? yield this.userHasIssueInCluster(user_id, data.cluster_id) : false;
            return Object.assign(Object.assign({}, data), { reactions, user_reaction: (userReaction === null || userReaction === void 0 ? void 0 : userReaction.emoji) || null, comment_count: commentCount, is_owner: data.user_id === user_id, user: data.is_anonymous
                    ? {
                        user_id: null,
                        email_address: null,
                        username: "Anonymous",
                        fullname: "Anonymous",
                        image_url: null,
                    }
                    : data.user, hasPendingResolution: !!pendingResolution, pendingResolutionId: (pendingResolution === null || pendingResolution === void 0 ? void 0 : pendingResolution.resolution_id) || null, resolutions,
                relatedIssuesCount,
                userHasIssueInCluster,
                relatedIssues });
        });
    }
    getRelatedIssues(clusterId, currentIssueId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!clusterId)
                return { issues: [], totalCount: 0 };
            const { data, error, count } = yield supabaseClient_1.default
                .from('issue')
                .select(`
        *,
        user: user_id (
          user_id,
          email_address,
          username,
          fullname,
          image_url,
          user_score
        ),
        category: category_id (
          name
        ),
        location: location_id (
          suburb,
          city,
          province,
          latitude,
          longitude
        )
      `, { count: 'exact' })
                .eq('cluster_id', clusterId)
                .neq('issue_id', currentIssueId)
                .limit(3);
            if (error) {
                console.error(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while fetching related issues.",
                });
            }
            return { issues: data, totalCount: (count || 0) - 1 };
        });
    }
    createIssue(issue) {
        return __awaiter(this, void 0, void 0, function* () {
            issue.created_at = new Date().toISOString();
            let locationId = null;
            if (issue.location_data) {
                let locationDataObj;
                try {
                    locationDataObj =
                        typeof issue.location_data === "string"
                            ? JSON.parse(issue.location_data)
                            : issue.location_data;
                    const locationRepository = new locationRepository_1.LocationRepository();
                    const existingLocations = yield locationRepository.getLocationByPlacesId(locationDataObj.place_id);
                    if (existingLocations.length > 0) {
                        // If locations exist, use the first one
                        locationId = existingLocations[0].location_id;
                    }
                    else {
                        // If no location exists, create a new one
                        const newLocation = yield locationRepository.createLocation({
                            place_id: locationDataObj.place_id,
                            province: locationDataObj.province,
                            city: locationDataObj.city,
                            suburb: locationDataObj.suburb,
                            district: locationDataObj.district,
                            latitude: locationDataObj.lat,
                            longitude: locationDataObj.lng
                        });
                        locationId = newLocation.location_id;
                    }
                }
                catch (error) {
                    console.error("Error processing location data:", error);
                    throw (0, response_1.APIError)({
                        code: 500,
                        success: false,
                        error: `An error occurred while processing location data: ${error instanceof Error ? error.message : JSON.stringify(error)}`,
                    });
                }
            }
            try {
                const { data, error } = yield supabaseClient_1.default
                    .from("issue")
                    .insert({
                    user_id: issue.user_id,
                    category_id: issue.category_id,
                    content: issue.content,
                    sentiment: issue.sentiment,
                    is_anonymous: issue.is_anonymous,
                    location_id: locationId,
                    created_at: issue.created_at,
                    image_url: issue.image_url || null,
                    updated_at: new Date().toISOString()
                })
                    .select(`
          *,
          user: user_id (
            user_id,
            email_address,
            username,
            fullname,
            image_url,
            user_score
          ),
          category: category_id (
            name
          ),
          location: location_id (
            suburb,
            city,
            province,
            latitude,
            longitude
          ),
          cluster_id
        `)
                    .single();
                if (error) {
                    console.error("Error inserting issue:", error);
                    throw (0, response_1.APIError)({
                        code: 500,
                        success: false,
                        error: `An error occurred while inserting the issue: ${error.message}`,
                    });
                }
                return Object.assign(Object.assign({}, data), { reactions: [], user_reaction: null, comment_count: 0, is_owner: true, user: data.is_anonymous
                        ? {
                            user_id: null,
                            email_address: null,
                            username: "Anonymous",
                            fullname: "Anonymous",
                            image_url: null,
                            total_issues: null,
                            resolved_issues: null,
                            user_score: 0,
                            location_id: null,
                            location: null
                        }
                        : data.user, hasPendingResolution: false, pendingResolutionId: null, resolutions: [], relatedIssuesCount: 0, userHasIssueInCluster: false });
            }
            catch (error) {
                console.error("Unexpected error in createIssue:", error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: `An unexpected error occurred: ${error}`,
                });
            }
        });
    }
    updateIssueCluster(issueId, clusterId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error } = yield supabaseClient_1.default
                .from('issue')
                .update({
                cluster_id: clusterId,
                updated_at: new Date().toISOString()
            })
                .eq('issue_id', issueId);
            if (error) {
                console.error(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while updating issue cluster.",
                });
            }
        });
    }
    setIssueEmbedding(issueId, embedding) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error } = yield supabaseClient_1.default
                .from('issue_embeddings')
                .insert({
                issue_id: issueId,
                content_embedding: embedding,
            });
            if (error) {
                console.error(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while updating issue embedding.",
                });
            }
        });
    }
    updateIssue(issueId, issue, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from("issue")
                .update(issue)
                .eq("issue_id", issueId)
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
                    error: "Issue does not exist",
                });
            }
            const reactions = yield reactionRepository.getReactionCountsByItemId(data.issue_id.toString(), "issue");
            return Object.assign(Object.assign({}, data), { reactions, is_owner: true, user: data.is_anonymous
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
    deleteIssue(issueId, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from("issue")
                .delete()
                .eq("issue_id", issueId)
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
                    error: "Issue does not exist",
                });
            }
        });
    }
    resolveIssue(issueId, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const resolvedAt = luxon_1.DateTime.now().setZone("UTC+2").toISO();
            const { data, error } = yield supabaseClient_1.default
                .from("issue")
                .update({ resolved_at: resolvedAt })
                .eq("issue_id", issueId)
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
                    error: "Issue does not exist",
                });
            }
            return data;
        });
    }
    getUserIssues(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from("issue")
                .select(`
        *,
        user: user_id (
          user_id,
          email_address,
          username,
          fullname,
          image_url,
          user_score
        ),
        category: category_id (
          name
        ),
        location: location_id (
          suburb,
          city,
          province
        )
      `)
                .eq("user_id", userId)
                .order("created_at", { ascending: false });
            if (error) {
                console.error(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred. Please try again later.",
                });
            }
            const issues = yield Promise.all(data.map((issue) => __awaiter(this, void 0, void 0, function* () {
                const reactions = yield reactionRepository.getReactionCountsByItemId(issue.issue_id.toString(), "issue");
                const userReaction = yield reactionRepository.getReactionByUserAndItem(issue.issue_id.toString(), "issue", userId);
                const commentCount = yield commentRepository.getNumComments(issue.issue_id.toString(), "issue");
                return Object.assign(Object.assign({}, issue), { reactions, user_reaction: (userReaction === null || userReaction === void 0 ? void 0 : userReaction.emoji) || null, comment_count: commentCount, is_owner: issue.user_id === userId, user: issue.is_anonymous
                        ? {
                            user_id: null,
                            email_address: null,
                            username: "Anonymous",
                            fullname: "Anonymous",
                            image_url: null,
                        }
                        : issue.user });
            })));
            return issues;
        });
    }
    getUserResolvedIssues(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from("issue")
                .select(`
        *,
        user: user_id (
          user_id,
          email_address,
          username,
          fullname,
          image_url,
          user_score
        ),
        category: category_id (
          name
        ),
        location: location_id (
          suburb,
          city,
          province,
          latitude,
          longitude
        )
      `)
                .eq("user_id", userId)
                .not("resolved_at", "is", null)
                .order("created_at", { ascending: false });
            if (error) {
                console.error(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred. Please try again later.",
                });
            }
            const issues = yield Promise.all(data.map((issue) => __awaiter(this, void 0, void 0, function* () {
                const reactions = yield reactionRepository.getReactionCountsByItemId(issue.issue_id.toString(), "issue");
                const userReaction = yield reactionRepository.getReactionByUserAndItem(issue.issue_id.toString(), "issue", userId);
                const commentCount = yield commentRepository.getNumComments(issue.issue_id.toString(), "issue");
                return Object.assign(Object.assign({}, issue), { reactions, user_reaction: (userReaction === null || userReaction === void 0 ? void 0 : userReaction.emoji) || null, comment_count: commentCount, is_owner: issue.user_id === userId, user: issue.is_anonymous
                        ? {
                            user_id: null,
                            email_address: null,
                            username: "Anonymous",
                            fullname: "Anonymous",
                            image_url: null,
                        }
                        : issue.user });
            })));
            return issues;
        });
    }
    updateIssueResolutionStatus(issueId, resolved) {
        return __awaiter(this, void 0, void 0, function* () {
            const resolvedAt = luxon_1.DateTime.now().setZone("UTC+2").toISO();
            const { error } = yield supabaseClient_1.default
                .from('issue')
                .update({
                resolved_at: resolved ? resolvedAt : null,
                updated_at: new Date().toISOString()
            })
                .eq('issue_id', issueId);
            if (error) {
                console.error(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while updating the issue resolution status.",
                });
            }
        });
    }
    isIssueResolved(issueId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from('issue')
                .select('resolved_at')
                .eq('issue_id', issueId)
                .single();
            if (error) {
                console.error(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while checking the issue resolution status.",
                });
            }
            return data.resolved_at !== null;
        });
    }
    getPendingResolutionForIssue(issueId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from('resolution')
                .select('*')
                .eq('issue_id', issueId)
                .eq('status', 'pending')
                .single();
            if (error && error.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
                console.error(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while checking for pending resolutions.",
                });
            }
            return data || null;
        });
    }
    getResolutionsForIssue(issueId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from('resolution')
                .select('*')
                .eq('issue_id', issueId)
                .order('created_at', { ascending: false });
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
    userHasIssueInCluster(userId, clusterId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!clusterId)
                return false;
            const { count } = yield supabaseClient_1.default
                .from('issue')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId)
                .eq('cluster_id', clusterId);
            return (count || 0) > 0;
        });
    }
    hasUserIssuesInCluster(userId, clusterId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { count, error } = yield supabaseClient_1.default
                .from('issue')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId)
                .eq('cluster_id', clusterId);
            if (error) {
                console.error(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while checking user issues in the cluster.",
                });
            }
            return count !== null && count > 0;
        });
    }
    getUserIssueInCluster(userId, clusterId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from("issue")
                .select("*")
                .eq("user_id", userId)
                .eq("cluster_id", clusterId)
                .single();
            if (error) {
                console.error("Error fetching user's issue in cluster:", error);
                throw error;
            }
            return data;
        });
    }
    getIssuesInCluster(clusterId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from('issue')
                .select('*')
                .eq('cluster_id', clusterId);
            if (error) {
                console.error(error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while fetching issues in the cluster.",
                });
            }
            return data;
        });
    }
    getIssueEmbedding(issueId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from('issue_embeddings')
                .select('*')
                .eq('issue_id', issueId)
                .single();
            if (error) {
                console.error('Error fetching issue embedding:', error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while fetching the issue embedding.",
                });
            }
            if (!data) {
                throw (0, response_1.APIError)({
                    code: 404,
                    success: false,
                    error: "Issue embedding not found",
                });
            }
            return data;
        });
    }
}
exports.default = IssueRepository;
