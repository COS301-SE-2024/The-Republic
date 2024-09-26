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
class OrganizationRepository {
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
                points: 0
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
            const { data, error } = yield supabaseClient_1.default
                .from("organizations")
                .update(safeUpdates)
                .eq('id', id)
                .select()
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
                .select('*')
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
            return data;
        });
    }
    getOrganizationMembers(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from("organization_members")
                .select('*')
                .eq('organization_id', organizationId);
            if (error) {
                console.error("Error getting organization members:", error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An error occurred while getting organization members.",
                });
            }
            return data;
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
                .select("*", { count: "exact" })
                .eq("organization_id", organizationId)
                .eq("status", "pending")
                .range(params.offset, params.offset + params.limit - 1);
            if (error) {
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An error occurred while fetching join requests.",
                });
            }
            return { data: data, total: count || 0 };
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
    getUserOrganizations(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabaseClient_1.default
                .from("organization_members")
                .select(`
        organizations (
          id,
          created_at,
          name,
          username,
          bio,
          website_url,
          verified_status,
          join_policy,
          points,
          profile_photo
        )
      `)
                .eq("user_id", userId);
            if (error) {
                console.error("Error fetching user organizations:", error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An error occurred while fetching user organizations.",
                });
            }
            const organizations = data.flatMap(item => item.organizations);
            return organizations;
        });
    }
    getOrganizations(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error, count } = yield supabaseClient_1.default
                .from("organizations")
                .select("*", { count: "exact" })
                .range(params.offset, params.offset + params.limit - 1);
            if (error) {
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An error occurred while fetching organizations.",
                });
            }
            return { data: data, total: count || 0 };
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
    searchOrganizations(searchTerm, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error, count } = yield supabaseClient_1.default
                .from("organizations")
                .select("*", { count: "exact" })
                .or(`name.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%,bio.ilike.%${searchTerm}%`)
                .range(params.offset, params.offset + params.limit - 1);
            if (error) {
                console.error("Error searching organizations:", error);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An error occurred while searching organizations.",
                });
            }
            return { data: data, total: count || 0 };
        });
    }
}
exports.OrganizationRepository = OrganizationRepository;
