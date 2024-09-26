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
exports.OrganizationRepository = void 0;
const supabaseClient_1 = __importDefault(require("@/modules/shared/services/supabaseClient"));
const response_1 = require("@/types/response");
const reactionRepository_1 = __importDefault(require("@/modules/reactions/repositories/reactionRepository"));
const resolutionResponseRepository_1 = require("@/modules/resolutions/repositories/resolutionResponseRepository");
class OrganizationRepository {
    constructor() {
        this.reactionRepository = new reactionRepository_1.default();
        this.resolutionResponseRepository = new resolutionResponseRepository_1.ResolutionResponseRepository();
    }
    createOrganization(organization) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from("organizations")
                .insert({
                name: organization.name,
                username: organization.username,
                bio: organization.bio,
                website_url: organization.website_url,
                join_policy: organization.join_policy,
                created_at: new Date().toISOString(),
                verified_status: false,
                points: 0,
                org_type: organization.org_type
            })
                .select()
                .single();
            if (error) {
                console.error("Error creating organization:", error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An error occurred while creating the organization.",
                });
            }
            return data;
        });
    }
    updateOrganization(id, updates, profilePhoto) {
        return __awaiter(this, void 0, void 0, function* () {
            const safeUpdates = Object.assign({}, updates);
            delete safeUpdates.id;
            delete safeUpdates.created_at;
            delete safeUpdates.verified_status;
            delete safeUpdates.points;
            delete safeUpdates.user_id;
            // Handle profile photo upload
            if (profilePhoto) {
                const fileName = `${id}_${Date.now()}-${profilePhoto.originalname}`;
                const { error: uploadError } = yield supabaseClient_1.default.storage
                    .from("organizations")
                    .upload(fileName, profilePhoto.buffer);
                if (uploadError) {
                    console.error("Error uploading profile photo:", uploadError);
                    throw (0, response_1.APIError)({
                        code: 500,
                        success: false,
                        error: "An error occurred while uploading the profile photo.",
                    });
                }
                const { data: urlData } = supabaseClient_1.default.storage
                    .from("organizations")
                    .getPublicUrl(fileName);
                safeUpdates.profile_photo = urlData.publicUrl;
            }
            // Handle location parsing and updating
            if (typeof safeUpdates.location === 'string') {
                safeUpdates.location = JSON.parse(safeUpdates.location);
            }
            if (safeUpdates.location) {
                const { data: locationData, error: locationError } = yield supabaseClient_1.default
                    .from("location")
                    .select("location_id")
                    .eq("province", safeUpdates.location.province)
                    .eq("city", safeUpdates.location.city)
                    .eq("suburb", safeUpdates.location.suburb)
                    .single();
                if (locationError && locationError.code !== 'PGRST116') {
                    console.error("Error checking location:", locationError);
                    throw (0, response_1.APIError)({
                        code: 500,
                        success: false,
                        error: "An error occurred while checking location.",
                    });
                }
                if (locationData) {
                    // Update existing location
                    const { error: updateError } = yield supabaseClient_1.default
                        .from("location")
                        .update({
                        latitude: safeUpdates.location.latitude,
                        longitude: safeUpdates.location.longitude,
                        place_id: safeUpdates.location.place_id || ""
                    })
                        .eq("location_id", locationData.location_id);
                    if (updateError) {
                        console.error("Error updating location:", updateError);
                        throw (0, response_1.APIError)({
                            code: 500,
                            success: false,
                            error: "An error occurred while updating location.",
                        });
                    }
                    safeUpdates.location_id = locationData.location_id;
                }
                else {
                    const { data: newLocation, error: insertError } = yield supabaseClient_1.default
                        .from("location")
                        .insert({
                        province: safeUpdates.location.province,
                        city: safeUpdates.location.city,
                        suburb: safeUpdates.location.suburb,
                        latitude: safeUpdates.location.latitude,
                        longitude: safeUpdates.location.longitude,
                        district: "",
                        place_id: safeUpdates.location.place_id || ""
                    })
                        .select()
                        .single();
                    if (insertError) {
                        console.error("Error inserting new location:", insertError);
                        throw (0, response_1.APIError)({
                            code: 500,
                            success: false,
                            error: "An error occurred while creating new location.",
                        });
                    }
                    safeUpdates.location_id = newLocation.location_id;
                }
            }
            delete safeUpdates.location; // Remove location as it's now handled by location_id
            const { data, error } = yield supabaseClient_1.default
                .from("organizations")
                .update(safeUpdates)
                .eq('id', id)
                .select(`
            *,
            location:location_id (
                suburb,
                city,
                province
            )
        `)
                .single();
            if (error) {
                console.error("Error updating organization:", error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An error occurred while updating the organization.",
                });
            }
            return data;
        });
    }
    deleteOrganization(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error } = yield supabaseClient_1.default
                .from("organizations")
                .delete()
                .eq('id', id);
            if (error) {
                console.error("Error deleting organization:", error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An error occurred while deleting the organization.",
                });
            }
        });
    }
    isUserAdmin(organizationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from("organization_members")
                .select('role')
                .eq('organization_id', organizationId)
                .eq('user_id', userId)
                .single();
            if (error) {
                if (error.code === 'PGRST116') {
                    return null;
                }
                console.error("Error checking user role:", error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An error occurred while checking user role.",
                });
            }
            return (data === null || data === void 0 ? void 0 : data.role) === 'admin';
        });
    }
    addOrganizationMember(member) {
        return __awaiter(this, void 0, void 0, function* () {
            const { count, error: countError } = yield supabaseClient_1.default
                .from("organization_members")
                .select("*", { count: "exact", head: true })
                .eq("user_id", member.user_id);
            if (countError) {
                console.error("Error checking user's organization count:", countError);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An error occurred while checking user's organization count.",
                });
            }
            if (count && count >= 5) {
                throw (0, response_1.APIError)({
                    code: 400,
                    success: false,
                    error: "You have reached the maximum number of organizations you can join (5).",
                });
            }
            const { data, error } = yield supabaseClient_1.default
                .from("organization_members")
                .insert(member)
                .select()
                .single();
            if (error) {
                console.error("Error adding organization member:", error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An error occurred while adding the organization member.",
                });
            }
            return data;
        });
    }
    getOrganizationJoinPolicy(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from("organizations")
                .select('join_policy')
                .eq('id', organizationId)
                .single();
            if (error) {
                console.error("Error getting organization join policy:", error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An error occurred while getting the organization join policy.",
                });
            }
            return data.join_policy;
        });
    }
    updateOrganizationJoinPolicy(organizationId, joinPolicy) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error } = yield supabaseClient_1.default
                .from("organizations")
                .update({ join_policy: joinPolicy })
                .eq('id', organizationId);
            if (error) {
                console.error("Error updating organization join policy:", error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An error occurred while updating the organization join policy.",
                });
            }
        });
    }
    removeMember(organizationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error } = yield supabaseClient_1.default
                .from("organization_members")
                .delete()
                .eq('organization_id', organizationId)
                .eq('user_id', userId);
            if (error) {
                console.error("Error removing member:", error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An error occurred while removing the member.",
                });
            }
        });
    }
    getOrganizationById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from("organizations")
                .select(`
        *,
        total_members:organization_members(count),
        location:location_id (
          suburb,
          city,
          province,
          latitude,
          longitude
        )
      `)
                .eq('id', id)
                .single();
            if (error) {
                console.error("Error getting organization:", error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An error occurred while getting the organization.",
                });
            }
            const organization = Object.assign(Object.assign({}, data), { totalMembers: data.total_members[0].count });
            delete organization.total_members;
            // Fetch average satisfaction rating
            const averageRating = yield this.getAverageSatisfactionRating(id);
            organization.averageSatisfactionRating = averageRating;
            return organization;
        });
    }
    getAverageSatisfactionRating(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: resolutions, error: resolutionsError } = yield supabaseClient_1.default
                .from('resolution')
                .select('resolution_id')
                .eq('organization_id', organizationId);
            if (resolutionsError) {
                console.error("Error fetching resolutions:", resolutionsError);
                return null;
            }
            if (resolutions.length === 0) {
                return null;
            }
            const resolutionIds = resolutions.map(r => r.resolution_id);
            let totalRating = 0;
            let totalResponses = 0;
            for (const resolutionId of resolutionIds) {
                const rating = yield this.resolutionResponseRepository.getAverageSatisfactionRating(resolutionId);
                if (rating !== null) {
                    totalRating += rating;
                    totalResponses++;
                }
            }
            return totalResponses > 0 ? totalRating / totalResponses : null;
        });
    }
    getOrganizationMembers(organizationId, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error, count } = yield supabaseClient_1.default
                .from('organization_members')
                .select('*, user:user_id(*)', { count: 'exact' })
                .eq('organization_id', organizationId)
                .order('joined_at', { ascending: false })
                .range(params.offset, params.offset + params.limit - 1);
            if (error) {
                console.error("Error fetching organization members:", error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An error occurred while fetching organization members.",
                });
            }
            const members = (data === null || data === void 0 ? void 0 : data.map(member => ({
                id: member.id,
                organization_id: member.organization_id,
                user_id: member.user_id,
                role: member.role,
                joined_at: member.joined_at,
                user: {
                    user_id: member.user.user_id,
                    email_address: member.user.email_address,
                    username: member.user.username,
                    fullname: member.user.fullname,
                    image_url: member.user.image_url,
                    bio: member.user.bio,
                    user_score: member.user.user_score,
                    isAdmin: member.role === 'admin'
                }
            }))) || [];
            return { data: members, total: count || 0 };
        });
    }
    isMember(organizationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from("organization_members")
                .select('id')
                .eq('organization_id', organizationId)
                .eq('user_id', userId)
                .single();
            if (error && error.code !== 'PGRST116') {
                console.error("Error checking membership:", error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An error occurred while checking membership.",
                });
            }
            return !!data;
        });
    }
    createJoinRequest(organizationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { count, error: countError } = yield supabaseClient_1.default
                .from("join_requests")
                .select("*", { count: "exact", head: true })
                .eq("user_id", userId)
                .eq("status", "pending");
            if (countError) {
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An error occurred while checking existing join requests.",
                });
            }
            if (count && count >= 5) {
                throw (0, response_1.APIError)({
                    code: 400,
                    success: false,
                    error: "You have reached the maximum number of pending join requests.",
                });
            }
            const { data, error } = yield supabaseClient_1.default
                .from("join_requests")
                .insert({
                organization_id: organizationId,
                user_id: userId,
                status: "pending",
                created_at: new Date().toISOString(),
            })
                .select()
                .single();
            if (error) {
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An error occurred while creating the join request.",
                });
            }
            return data;
        });
    }
    getJoinRequests(organizationId, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error, count } = yield supabaseClient_1.default
                .from("join_requests")
                .select(`
        *,
        user:user_id (
          user_id,
          email_address,
          username,
          fullname,
          image_url,
          bio,
          user_score
        )
      `, { count: "exact" })
                .eq("organization_id", organizationId)
                .eq("status", "pending")
                .range(params.offset, params.offset + params.limit - 1);
            if (error) {
                console.error("Error fetching join requests:", error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An error occurred while fetching join requests.",
                });
            }
            return {
                data: data,
                total: count || 0
            };
        });
    }
    getJoinRequestById(requestId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from("join_requests")
                .select('*')
                .eq('id', requestId)
                .single();
            if (error) {
                console.error("Error getting join request:", error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An error occurred while getting the join request.",
                });
            }
            return data;
        });
    }
    updateJoinRequestStatus(requestId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from("join_requests")
                .update({ status, updated_at: new Date().toISOString() })
                .eq("id", requestId)
                .select()
                .single();
            if (error) {
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An error occurred while updating the join request status.",
                });
            }
            return data;
        });
    }
    deleteJoinRequest(requestId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error } = yield supabaseClient_1.default
                .from("join_requests")
                .delete()
                .eq("id", requestId)
                .eq("user_id", userId);
            if (error) {
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An error occurred while deleting the join request.",
                });
            }
        });
    }
    getJoinRequestByUser(organizationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from("join_requests")
                .select('*')
                .eq('organization_id', organizationId)
                .eq('user_id', userId)
                .eq('status', 'pending')
                .single();
            if (error) {
                if (error.code === 'PGRST116') {
                    // No results found
                    return null;
                }
                console.error("Error getting join request:", error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An error occurred while getting the join request.",
                });
            }
            return data;
        });
    }
    getOrganizations(params_1) {
        return __awaiter(this, arguments, void 0, function* (params, orgType = null, locationId = null, userId) {
            let query = supabaseClient_1.default
                .from("organizations")
                .select(`
        *,
        total_members:organization_members(count),
        location:location_id (
          suburb,
          city,
          province
        ),
        is_member:organization_members!inner(user_id)
      `, { count: "exact" });
            if (orgType) {
                query = query.eq('org_type', orgType);
            }
            if (locationId) {
                query = query.eq('location_id', locationId);
            }
            const { data, error, count } = yield query
                .range(params.offset, params.offset + params.limit - 1);
            if (error) {
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An error occurred while fetching organizations.",
                });
            }
            const organizations = data === null || data === void 0 ? void 0 : data.map(org => (Object.assign(Object.assign({}, org), { totalMembers: org.total_members[0].count, isMember: org.is_member.some((member) => member.user_id === userId) })));
            return { data: organizations, total: count || 0 };
        });
    }
    isOrganizationNameUnique(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from("organizations")
                .select("id")
                .eq("name", name)
                .single();
            if (error && error.code !== "PGRST116") {
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An error occurred while checking organization name uniqueness.",
                });
            }
            return !data;
        });
    }
    isOrganizationUsernameUnique(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from("organizations")
                .select("id")
                .eq("username", username)
                .single();
            if (error && error.code !== "PGRST116") {
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An error occurred while checking organization username uniqueness.",
                });
            }
            return !data;
        });
    }
    getJoinRequestsByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from("join_requests")
                .select('*')
                .eq('user_id', userId);
            if (error) {
                console.error("Error getting user's join requests:", error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An error occurred while getting user's join requests.",
                });
            }
            return data;
        });
    }
    updateMemberRole(organizationId, userId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error } = yield supabaseClient_1.default
                .from("organization_members")
                .update({ role })
                .eq('organization_id', organizationId)
                .eq('user_id', userId);
            if (error) {
                console.error("Error updating member role:", error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An error occurred while updating member role.",
                });
            }
        });
    }
    getOrganizationMemberCount(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { count, error } = yield supabaseClient_1.default
                .from("organization_members")
                .select('*', { count: 'exact', head: true })
                .eq('organization_id', organizationId);
            if (error) {
                console.error("Error getting organization member count:", error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An error occurred while getting organization member count.",
                });
            }
            return count || 0;
        });
    }
    getOrganizationAdminCount(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { count, error } = yield supabaseClient_1.default
                .from("organization_members")
                .select('*', { count: 'exact', head: true })
                .eq('organization_id', organizationId)
                .eq('role', 'admin');
            if (error) {
                console.error("Error getting organization admin count:", error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An error occurred while getting organization admin count.",
                });
            }
            return count || 0;
        });
    }
    searchOrganizations(searchTerm, orgType, locationId, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = supabaseClient_1.default
                .from("organizations")
                .select(`
        *,
        total_members:organization_members(count),
        location:location_id (
          suburb,
          city,
          province
        )
      `, { count: "exact" })
                .or(`name.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%,bio.ilike.%${searchTerm}%`);
            if (orgType) {
                query = query.eq('org_type', orgType);
            }
            if (locationId) {
                query = query.eq('location_id', locationId);
            }
            const { data, error, count } = yield query
                .range(params.offset, params.offset + params.limit - 1);
            if (error) {
                console.error("Error searching organizations:", error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An error occurred while searching organizations.",
                });
            }
            const organizations = data === null || data === void 0 ? void 0 : data.map(org => (Object.assign(Object.assign({}, org), { totalMembers: org.total_members[0].count })));
            return { data: organizations, total: count || 0 };
        });
    }
    getOrganizationPosts(organizationId, userId, params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data, error, count } = yield supabaseClient_1.default
                    .from('organization_posts')
                    .select('*, author:author_id(*)', { count: 'exact' })
                    .eq('organization_id', organizationId)
                    .order('created_at', { ascending: false })
                    .range(params.offset, params.offset + params.limit - 1);
                if (error) {
                    console.error("Repository: Error fetching organization posts:", error);
                    throw (0, response_1.APIError)({
                        code: 500,
                        success: false,
                        error: "An error occurred while fetching organization posts.",
                    });
                }
                const postsWithReactions = yield Promise.all(data.map((post) => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b, _c, _d;
                    try {
                        const reactions = yield this.reactionRepository.getReactionCountsByItemId(post.post_id, 'post');
                        const userReaction = userId ? yield this.reactionRepository.getReactionByUserAndItem(post.post_id, 'post', userId) : null;
                        return Object.assign(Object.assign({}, post), { reactions: {
                                counts: {
                                    "😠": ((_a = reactions.find((r) => r.emoji === "😠")) === null || _a === void 0 ? void 0 : _a.count) || 0,
                                    "😃": ((_b = reactions.find((r) => r.emoji === "😃")) === null || _b === void 0 ? void 0 : _b.count) || 0,
                                    "😢": ((_c = reactions.find((r) => r.emoji === "😢")) === null || _c === void 0 ? void 0 : _c.count) || 0,
                                    "😟": ((_d = reactions.find((r) => r.emoji === "😟")) === null || _d === void 0 ? void 0 : _d.count) || 0,
                                },
                                userReaction: (userReaction === null || userReaction === void 0 ? void 0 : userReaction.emoji) || null,
                            } });
                    }
                    catch (error) {
                        console.error('Repository: Error processing post reactions', { postId: post.post_id, error });
                        return post; // Return the post without reactions if there's an error
                    }
                })));
                return { data: postsWithReactions, total: count || 0 };
            }
            catch (error) {
                console.error('Repository: Unexpected error in getOrganizationPosts', error);
                throw error;
            }
        });
    }
    createOrganizationPost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from('organization_posts')
                .insert(post)
                .select(`
        *,
        author:author_id(*)
      `)
                .single();
            if (error) {
                console.error("Error creating organization post:", error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An error occurred while creating the organization post.",
                });
            }
            const reactions = {
                counts: {
                    "😠": 0,
                    "😃": 0,
                    "😢": 0,
                    "😟": 0,
                },
                userReaction: null,
            };
            return Object.assign(Object.assign({}, data), { reactions });
        });
    }
    getOrganizationPostById(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from('organization_posts')
                .select('*, author:author_id(*)')
                .eq('post_id', postId)
                .single();
            if (error) {
                console.error("Error fetching organization post:", error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An error occurred while fetching the organization post.",
                });
            }
            return data;
        });
    }
    deleteOrganizationPost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error } = yield supabaseClient_1.default
                .from('organization_posts')
                .delete()
                .eq('post_id', postId);
            if (error) {
                console.error("Error deleting organization post:", error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An error occurred while deleting the organization post.",
                });
            }
        });
    }
    getTopActiveMembers(organizationId_1) {
        return __awaiter(this, arguments, void 0, function* (organizationId, limit = 5) {
            const { data, error } = yield supabaseClient_1.default
                .from('organization_members')
                .select('*, user:user_id(*)')
                .eq('organization_id', organizationId)
                .order('joined_at', { ascending: false })
                .limit(limit);
            if (error) {
                console.error("Error fetching top active members:", error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An error occurred while fetching top active members.",
                });
            }
            return data;
        });
    }
    getOrganizationPost(organizationId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const { data, error } = yield supabaseClient_1.default
                .from('organization_posts')
                .select('*, author:author_id(*)')
                .eq('organization_id', organizationId)
                .eq('post_id', postId)
                .single();
            if (error) {
                console.error("Error fetching organization post:", error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An error occurred while fetching the organization post.",
                });
            }
            // Fetch reactions for the post
            const reactions = yield this.reactionRepository.getReactionCountsByItemId(postId, 'post');
            // Transform reactions into the expected format
            const reactionCounts = {
                "😠": ((_a = reactions.find((r) => r.emoji === "😠")) === null || _a === void 0 ? void 0 : _a.count) || 0,
                "😃": ((_b = reactions.find((r) => r.emoji === "😃")) === null || _b === void 0 ? void 0 : _b.count) || 0,
                "😢": ((_c = reactions.find((r) => r.emoji === "😢")) === null || _c === void 0 ? void 0 : _c.count) || 0,
                "😟": ((_d = reactions.find((r) => r.emoji === "😟")) === null || _d === void 0 ? void 0 : _d.count) || 0,
            };
            return Object.assign(Object.assign({}, data), { reactions: {
                    counts: reactionCounts,
                    userReaction: null, // We'll set this to null for now, as we don't have the user ID here
                } });
        });
    }
    logActivity(organizationId, adminId, actionType, actionDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error } = yield supabaseClient_1.default
                .from('organization_activity_logs')
                .insert({
                organization_id: organizationId,
                admin_id: adminId,
                action_type: actionType,
                action_details: actionDetails
            });
            if (error) {
                console.error("Error logging activity:", error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An error occurred while logging the activity.",
                });
            }
        });
    }
    getActivityLogs(organizationId, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error, count } = yield supabaseClient_1.default
                .from('organization_activity_logs')
                .select(`
        *,
        admin:admin_id(
          user_id,
          username,
          fullname,
          image_url
        )
      `, { count: 'exact' })
                .eq('organization_id', organizationId)
                .order('created_at', { ascending: false })
                .range(params.offset, params.offset + params.limit - 1);
            if (error) {
                console.error("Error fetching activity logs:", error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An error occurred while fetching activity logs.",
                });
            }
            return { data: data, total: count || 0 };
        });
    }
}
exports.OrganizationRepository = OrganizationRepository;
