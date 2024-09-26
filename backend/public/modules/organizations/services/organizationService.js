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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationService = void 0;
const organizationRepository_1 = require("../repositories/organizationRepository");
const response_1 = require("@/types/response");
const validators_1 = require("@/utilities/validators");
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
                const updatedOrganization = yield this.organizationRepository.updateOrganization(id, updates, profilePhoto);
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
    getUserOrganizations(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const organizations = yield this.organizationRepository.getUserOrganizations(userId);
                if (organizations.length === 0) {
                    return (0, response_1.APIData)({
                        code: 200,
                        success: true,
                        data: [],
                        error: "User is not a member of any organizations."
                    });
                }
                return (0, response_1.APIData)({
                    code: 200,
                    success: true,
                    data: organizations,
                });
            }
            catch (error) {
                console.error("Error in getUserOrganizations:", error);
                if (error instanceof response_1.APIError) {
                    throw (0, response_1.APIError)({
                        code: 500,
                        success: false,
                        error: "An unexpected error occurred while fetching user organizations.",
                    });
                }
                return (0, response_1.APIData)({
                    code: 500,
                    success: false,
                    error: "An unexpected error occurred while fetching user organizations.",
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
    getOrganizations(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const organizations = yield this.organizationRepository.getOrganizations(params);
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
    getOrganizationById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const organization = yield this.organizationRepository.getOrganizationById(id);
                return (0, response_1.APIData)({
                    code: 200,
                    success: true,
                    data: organization,
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
    searchOrganizations(searchTerm, params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.organizationRepository.searchOrganizations(searchTerm, params);
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
}
exports.OrganizationService = OrganizationService;