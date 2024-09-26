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
exports.OrganizationService = void 0;
const organizationRepository_1 = require("../repositories/organizationRepository");
const response_1 = require("@/types/response");
const validators_1 = require("@/utilities/validators");
const supabaseClient_1 = __importDefault(require("@/modules/shared/services/supabaseClient"));
class OrganizationService {
    constructor() {
        this.organizationRepository = new organizationRepository_1.OrganizationRepository();
    }
    createOrganization(organization, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!organization.name || !organization.username || !organization.join_policy) {
                    throw (0, response_1.APIError)({
                        code: 400,
                        success: false,
                        error: "Name, username, and join policy are required fields.",
                    });
                }
                if (!(0, validators_1.validateOrganizationName)(organization.name)) {
                    throw (0, response_1.APIError)({
                        code: 400,
                        success: false,
                        error: "Invalid organization name format.",
                    });
                }
                if (!(0, validators_1.validateOrganizationUsername)(organization.username)) {
                    throw (0, response_1.APIError)({
                        code: 400,
                        success: false,
                        error: "Invalid organization username format.",
                    });
                }
                const isNameUnique = yield this.organizationRepository.isOrganizationNameUnique(organization.name);
                if (!isNameUnique) {
                    throw (0, response_1.APIError)({
                        code: 400,
                        success: false,
                        error: "Organization name is already taken.",
                    });
                }
                const isUsernameUnique = yield this.organizationRepository.isOrganizationUsernameUnique(organization.username);
                if (!isUsernameUnique) {
                    throw (0, response_1.APIError)({
                        code: 400,
                        success: false,
                        error: "Organization username is already taken.",
                    });
                }
                const createdOrganization = yield this.organizationRepository.createOrganization(organization);
                yield this.organizationRepository.addOrganizationMember({
                    organization_id: createdOrganization.id,
                    user_id: userId,
                    role: 'admin',
                    joined_at: new Date().toISOString()
                });
                return (0, response_1.APIData)({
                    code: 201,
                    success: true,
                    data: createdOrganization,
                });
            }
            catch (error) {
                console.error("Error in createOrganization service:", error);
                if (error instanceof response_1.APIError) {
                    throw error;
                }
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while creating the organization.",
                });
            }
        });
    }
    updateOrganization(id, updates, userId, profilePhoto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield this.organizationRepository.isUserAdmin(id, userId);
                if (!isAdmin) {
                    throw (0, response_1.APIError)({
                        code: 403,
                        success: false,
                        error: "You do not have permission to update this organization.",
                    });
                }
                const updatesToSend = updates;
                const updatedOrganization = yield this.organizationRepository.updateOrganization(id, updatesToSend, profilePhoto);
                const actionDetails = {
                    type: 'UPDATE_ORGANIZATION',
                    details: updatesToSend
                };
                yield this.organizationRepository.logActivity(id, userId, 'UPDATE_ORGANIZATION', actionDetails);
                return (0, response_1.APIData)({
                    code: 200,
                    success: true,
                    data: updatedOrganization,
                });
            }
            catch (error) {
                if (error instanceof response_1.APIError) {
                    throw error;
                }
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while updating the organization.",
                });
            }
        });
    }
    deleteOrganization(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield this.organizationRepository.isUserAdmin(id, userId);
                if (!isAdmin) {
                    throw (0, response_1.APIError)({
                        code: 403,
                        success: false,
                        error: "You do not have permission to delete this organization.",
                    });
                }
                yield this.organizationRepository.deleteOrganization(id);
                return (0, response_1.APIData)({
                    code: 204,
                    success: true,
                    data: null,
                });
            }
            catch (error) {
                if (error instanceof response_1.APIError) {
                    throw error;
                }
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while deleting the organization.",
                });
            }
        });
    }
    joinOrganization(organizationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isMember = yield this.organizationRepository.isMember(organizationId, userId);
                if (isMember) {
                    return (0, response_1.APIData)({
                        code: 400,
                        success: false,
                        error: "You are already a member of this organization.",
                    });
                }
                const joinPolicy = yield this.organizationRepository.getOrganizationJoinPolicy(organizationId);
                if (joinPolicy === 'open') {
                    const member = yield this.organizationRepository.addOrganizationMember({
                        organization_id: organizationId,
                        user_id: userId,
                        role: 'member',
                        joined_at: new Date().toISOString()
                    });
                    return (0, response_1.APIData)({
                        code: 201,
                        success: true,
                        data: member,
                    });
                }
                else {
                    const joinRequest = yield this.organizationRepository.createJoinRequest(organizationId, userId);
                    return (0, response_1.APIData)({
                        code: 201,
                        success: true,
                        data: joinRequest,
                    });
                }
            }
            catch (error) {
                console.error("Error in joinOrganization:", error);
                if (error instanceof Error) {
                    return (0, response_1.APIData)({
                        code: 500,
                        success: false,
                        error: error.message || "An unexpected error occurred while joining the organization.",
                    });
                }
                return (0, response_1.APIData)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while joining the organization.",
                });
            }
        });
    }
    leaveOrganization(organizationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield this.organizationRepository.isUserAdmin(organizationId, userId);
                if (isAdmin === null) {
                    return (0, response_1.APIData)({
                        code: 400,
                        success: false,
                        error: "You are not a member of this organization.",
                    });
                }
                const memberCount = yield this.organizationRepository.getOrganizationMemberCount(organizationId);
                const adminCount = yield this.organizationRepository.getOrganizationAdminCount(organizationId);
                if (memberCount === 1) {
                    return (0, response_1.APIData)({
                        code: 400,
                        success: false,
                        error: "You are the last member. Please delete the organization instead.",
                    });
                }
                if (isAdmin && adminCount === 1) {
                    return (0, response_1.APIData)({
                        code: 400,
                        success: false,
                        error: "You are the only admin. Please appoint another admin before leaving.",
                    });
                }
                yield this.organizationRepository.removeMember(organizationId, userId);
                return (0, response_1.APIData)({
                    code: 200,
                    success: true,
                    data: null,
                });
            }
            catch (error) {
                console.error("Error in leaveOrganization:", error);
                if (error instanceof response_1.APIError) {
                    throw (0, response_1.APIError)({
                        code: 500,
                        success: false,
                        error: "An unexpected error occurred.",
                    });
                }
                return (0, response_1.APIData)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while leaving the organization.",
                });
            }
        });
    }
    addAdmin(organizationId, adminId, newAdminId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield this.organizationRepository.isUserAdmin(organizationId, adminId);
                if (!isAdmin) {
                    throw (0, response_1.APIError)({
                        code: 403,
                        success: false,
                        error: "You do not have permission to add admins.",
                    });
                }
                yield this.organizationRepository.updateMemberRole(organizationId, newAdminId, 'admin');
                const actionDetails = {
                    type: 'ASSIGN_ADMIN',
                    details: { newAdminId }
                };
                yield this.organizationRepository.logActivity(organizationId, adminId, 'ASSIGN_ADMIN', actionDetails);
                return (0, response_1.APIData)({
                    code: 200,
                    success: true,
                    data: null,
                });
            }
            catch (error) {
                if (error instanceof response_1.APIError) {
                    throw error;
                }
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while adding an admin.",
                });
            }
        });
    }
    setJoinPolicy(organizationId, joinPolicy, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield this.organizationRepository.isUserAdmin(organizationId, userId);
                if (!isAdmin) {
                    throw (0, response_1.APIError)({
                        code: 403,
                        success: false,
                        error: "You do not have permission to change the join policy.",
                    });
                }
                if (joinPolicy !== 'open' && joinPolicy !== 'request') {
                    throw (0, response_1.APIError)({
                        code: 400,
                        success: false,
                        error: "Invalid join policy. Must be 'open' or 'request'.",
                    });
                }
                yield this.organizationRepository.updateOrganizationJoinPolicy(organizationId, joinPolicy);
                if (joinPolicy === 'open') {
                    const pendingRequests = yield this.organizationRepository.getJoinRequests(organizationId, { offset: 0, limit: 1000 }); // Adjust the limit as needed
                    for (const request of pendingRequests.data) {
                        yield this.organizationRepository.updateJoinRequestStatus(request.id, "accepted");
                        yield this.organizationRepository.addOrganizationMember({
                            organization_id: organizationId,
                            user_id: request.user_id,
                            role: 'member',
                            joined_at: new Date().toISOString()
                        });
                    }
                }
                return (0, response_1.APIData)({
                    code: 200,
                    success: true,
                    data: null,
                });
            }
            catch (error) {
                if (error instanceof response_1.APIError) {
                    throw error;
                }
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while setting the join policy.",
                });
            }
        });
    }
    getJoinRequests(organizationId, userId, params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield this.organizationRepository.isUserAdmin(organizationId, userId);
                if (!isAdmin) {
                    throw (0, response_1.APIError)({
                        code: 403,
                        success: false,
                        error: "You do not have permission to view join requests.",
                    });
                }
                const joinRequests = yield this.organizationRepository.getJoinRequests(organizationId, params);
                return (0, response_1.APIData)({
                    code: 200,
                    success: true,
                    data: joinRequests,
                });
            }
            catch (error) {
                if (error instanceof response_1.APIError) {
                    throw error;
                }
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while getting join requests.",
                });
            }
        });
    }
    handleJoinRequest(organizationId, requestId, accept, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield this.organizationRepository.isUserAdmin(organizationId, userId);
                if (isAdmin !== true) {
                    return (0, response_1.APIData)({
                        code: 403,
                        success: false,
                        error: "You do not have permission to handle join requests.",
                    });
                }
                const joinRequest = yield this.organizationRepository.getJoinRequestById(requestId);
                if (!joinRequest) {
                    return (0, response_1.APIData)({
                        code: 404,
                        success: false,
                        error: "Join request not found.",
                    });
                }
                if (joinRequest.organization_id !== organizationId) {
                    return (0, response_1.APIData)({
                        code: 400,
                        success: false,
                        error: "Join request does not belong to this organization.",
                    });
                }
                if (joinRequest.status !== 'pending') {
                    return (0, response_1.APIData)({
                        code: 400,
                        success: false,
                        error: "This join request has already been processed.",
                    });
                }
                if (accept) {
                    // Update the join request status
                    yield this.organizationRepository.updateJoinRequestStatus(requestId, "accepted");
                    // Add the user to the organization_members table
                    yield this.organizationRepository.addOrganizationMember({
                        organization_id: organizationId,
                        user_id: joinRequest.user_id,
                        role: 'member',
                        joined_at: new Date().toISOString()
                    });
                }
                else {
                    // If not accepting, just update the join request status to rejected
                    yield this.organizationRepository.updateJoinRequestStatus(requestId, "rejected");
                }
                return (0, response_1.APIData)({
                    code: 200,
                    success: true,
                    data: null,
                });
            }
            catch (error) {
                console.error("Error in handleJoinRequest:", error);
                if (error instanceof response_1.APIError) {
                    return (0, response_1.APIData)({
                        code: 500,
                        success: false,
                        error: "An unexpected error occurred while handling the join request.",
                    });
                }
                return (0, response_1.APIData)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while handling the join request.",
                });
            }
        });
    }
    getJoinRequestByUser(organizationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const joinRequest = yield this.organizationRepository.getJoinRequestByUser(organizationId, userId);
                return (0, response_1.APIData)({
                    code: 200,
                    success: true,
                    data: joinRequest,
                });
            }
            catch (error) {
                if (error instanceof response_1.APIError) {
                    throw error;
                }
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while fetching the join request.",
                });
            }
        });
    }
    removeMember(organizationId, memberUserId, adminUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield this.organizationRepository.isUserAdmin(organizationId, adminUserId);
                if (!isAdmin) {
                    throw (0, response_1.APIError)({
                        code: 403,
                        success: false,
                        error: "You do not have permission to remove members.",
                    });
                }
                if (memberUserId === adminUserId) {
                    throw (0, response_1.APIError)({
                        code: 400,
                        success: false,
                        error: "You cannot remove yourself from the organization.",
                    });
                }
                yield this.organizationRepository.removeMember(organizationId, memberUserId);
                return (0, response_1.APIData)({
                    code: 200,
                    success: true,
                    data: null,
                });
            }
            catch (error) {
                if (error instanceof response_1.APIError) {
                    throw error;
                }
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while removing the member.",
                });
            }
        });
    }
    getOrganizations(params_1) {
        return __awaiter(this, arguments, void 0, function* (params, orgType = null, locationId = null, userId) {
            try {
                const organizations = yield this.organizationRepository.getOrganizations(params, orgType, locationId, userId);
                return (0, response_1.APIData)({
                    code: 200,
                    success: true,
                    data: organizations,
                });
            }
            catch (error) {
                if (error instanceof response_1.APIError) {
                    throw error;
                }
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while fetching organizations.",
                });
            }
        });
    }
    getOrganizationById(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const organization = yield this.organizationRepository.getOrganizationById(id);
                const isAdmin = yield this.organizationRepository.isUserAdmin(id, userId);
                return (0, response_1.APIData)({
                    code: 200,
                    success: true,
                    data: Object.assign(Object.assign({}, organization), { isAdmin: isAdmin !== null && isAdmin !== void 0 ? isAdmin : false, averageSatisfactionRating: organization.averageSatisfactionRating }),
                });
            }
            catch (error) {
                if (error instanceof response_1.APIError) {
                    throw error;
                }
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while fetching the organization.",
                });
            }
        });
    }
    generateReport(organizationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield this.organizationRepository.isUserAdmin(organizationId, userId);
                if (!isAdmin) {
                    throw (0, response_1.APIError)({
                        code: 403,
                        success: false,
                        error: "You do not have permission to generate reports.",
                    });
                }
                // Placeholder for future implementation
                // Example: Fetch organization and member details, generate report
                // const organization = await this.organizationRepository.getOrganizationById(organizationId);
                // const members = await this.organizationRepository.getOrganizationMembers(organizationId);
                return (0, response_1.APIData)({
                    code: 200,
                    success: true,
                    data: null, // Replace with the actual report object in the future
                });
            }
            catch (error) {
                if (error instanceof response_1.APIError) {
                    throw error;
                }
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while generating the report.",
                });
            }
        });
    }
    deleteJoinRequest(requestId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.organizationRepository.deleteJoinRequest(requestId, userId);
                return (0, response_1.APIData)({
                    code: 200,
                    success: true,
                    data: null,
                });
            }
            catch (error) {
                if (error instanceof response_1.APIError) {
                    throw error;
                }
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while deleting the join request.",
                });
            }
        });
    }
    getJoinRequestsByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const joinRequests = yield this.organizationRepository.getJoinRequestsByUser(userId);
                return (0, response_1.APIData)({
                    code: 200,
                    success: true,
                    data: joinRequests,
                });
            }
            catch (error) {
                if (error instanceof response_1.APIError) {
                    throw error;
                }
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while fetching user's join requests.",
                });
            }
        });
    }
    searchOrganizations(searchTerm, orgType, locationId, params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.organizationRepository.searchOrganizations(searchTerm, orgType, locationId, params);
                return (0, response_1.APIData)({
                    code: 200,
                    success: true,
                    data: result,
                });
            }
            catch (error) {
                if (error instanceof response_1.APIError) {
                    throw error;
                }
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while searching organizations.",
                });
            }
        });
    }
    getOrganizationPosts(organizationId, userId, params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield this.organizationRepository.getOrganizationPosts(organizationId, userId, params);
                return (0, response_1.APIData)({
                    code: 200,
                    success: true,
                    data: posts,
                });
            }
            catch (error) {
                console.error('Service: Error in getOrganizationPosts', error);
                if (error instanceof response_1.APIError) {
                    throw error;
                }
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while fetching organization posts.",
                });
            }
        });
    }
    createOrganizationPost(post, userId, image) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let imageUrl = null;
                if (image) {
                    imageUrl = yield this.uploadImage(post.organization_id, image);
                }
                const newPost = yield this.organizationRepository.createOrganizationPost(Object.assign(Object.assign({}, post), { image_url: imageUrl, created_at: new Date().toISOString() }));
                const actionDetails = {
                    type: 'CREATE_POST',
                    details: { postId: newPost.post_id }
                };
                yield this.organizationRepository.logActivity(post.organization_id, userId, 'CREATE_POST', actionDetails);
                return (0, response_1.APIData)({
                    code: 201,
                    success: true,
                    data: newPost,
                });
            }
            catch (error) {
                if (error instanceof response_1.APIError) {
                    throw error;
                }
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while creating the organization post.",
                });
            }
        });
    }
    isMember(organizationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.organizationRepository.isMember(organizationId, userId);
        });
    }
    deleteOrganizationPost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield this.organizationRepository.getOrganizationPostById(postId);
                if (post.image_url) {
                    yield this.deleteImage(post.image_url);
                }
                yield this.organizationRepository.deleteOrganizationPost(postId);
                return (0, response_1.APIData)({
                    code: 204,
                    success: true,
                    data: null,
                });
            }
            catch (error) {
                if (error instanceof response_1.APIError) {
                    throw error;
                }
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while deleting the organization post.",
                });
            }
        });
    }
    getTopActiveMembers(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const members = yield this.organizationRepository.getTopActiveMembers(organizationId);
                return (0, response_1.APIData)({
                    code: 200,
                    success: true,
                    data: members,
                });
            }
            catch (error) {
                if (error instanceof response_1.APIError) {
                    throw error;
                }
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while fetching top active members.",
                });
            }
        });
    }
    uploadImage(organizationId, image) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileName = `${organizationId}_${Date.now()}-${image.originalname}`;
            const { error: uploadError } = yield supabaseClient_1.default.storage
                .from("organization_posts")
                .upload(fileName, image.buffer);
            if (uploadError) {
                console.error("Error uploading image:", uploadError);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An error occurred while uploading the image. Please try again.",
                });
            }
            const { data: urlData } = supabaseClient_1.default.storage
                .from("organization_posts")
                .getPublicUrl(fileName);
            return urlData.publicUrl;
        });
    }
    deleteImage(imageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const imageName = imageUrl.split("/").slice(-1)[0];
            const { error: deleteError } = yield supabaseClient_1.default.storage
                .from("organization_posts")
                .remove([imageName]);
            if (deleteError) {
                console.error("Failed to delete image from storage:", deleteError);
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An error occurred while deleting the image. Please try again.",
                });
            }
        });
    }
    getOrganizationMembers(organizationId, userId, params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const members = yield this.organizationRepository.getOrganizationMembers(organizationId, params);
                return (0, response_1.APIData)({
                    code: 200,
                    success: true,
                    data: members,
                });
            }
            catch (error) {
                if (error instanceof response_1.APIError) {
                    throw error;
                }
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while fetching organization members.",
                });
            }
        });
    }
    getOrganizationPost(organizationId, postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield this.organizationRepository.getOrganizationPost(organizationId, postId);
                // Fetch user's reaction
                const userReaction = yield this.organizationRepository.reactionRepository.getReactionByUserAndItem(postId, 'post', userId);
                // Add user's reaction to the post data
                post.reactions.userReaction = (userReaction === null || userReaction === void 0 ? void 0 : userReaction.emoji) || null;
                return (0, response_1.APIData)({
                    code: 200,
                    success: true,
                    data: post,
                });
            }
            catch (error) {
                if (error instanceof response_1.APIError) {
                    throw error;
                }
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while fetching the organization post.",
                });
            }
        });
    }
    checkUserMembership(organizationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isMember = yield this.organizationRepository.isMember(organizationId, userId);
                return (0, response_1.APIData)({
                    code: 200,
                    success: true,
                    data: { isMember },
                });
            }
            catch (error) {
                if (error instanceof response_1.APIError) {
                    throw error;
                }
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while checking user membership.",
                });
            }
        });
    }
    getActivityLogs(organizationId, userId, params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield this.organizationRepository.isUserAdmin(organizationId, userId);
                if (!isAdmin) {
                    throw (0, response_1.APIError)({
                        code: 403,
                        success: false,
                        error: "You do not have permission to view activity logs.",
                    });
                }
                const logs = yield this.organizationRepository.getActivityLogs(organizationId, params);
                return (0, response_1.APIData)({
                    code: 200,
                    success: true,
                    data: logs,
                });
            }
            catch (error) {
                if (error instanceof response_1.APIError) {
                    throw error;
                }
                throw (0, response_1.APIError)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while fetching activity logs.",
                });
            }
        });
    }
}
exports.OrganizationService = OrganizationService;
