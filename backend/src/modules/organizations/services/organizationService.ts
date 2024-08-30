import { OrganizationRepository } from "../repositories/organizationRepository";
import { Organization, OrganizationMember, JoinRequest } from "@/modules/shared/models/organization";
import { APIResponse, APIData, APIError } from "@/types/response";
import { validateOrganizationName, validateOrganizationUsername } from "@/utilities/validators";
import { PaginationParams } from "@/types/pagination";
import { MulterFile } from "@/types/users";

export class OrganizationService {
  private organizationRepository: OrganizationRepository;

  constructor() {
    this.organizationRepository = new OrganizationRepository();
  }

  async createOrganization(organization: Partial<Organization>, userId: string): Promise<APIResponse<Organization>> {
    try {
      if (!organization.name || !organization.username || !organization.join_policy) {
        throw APIError({
          code: 400,
          success: false,
          error: "Name, username, and join policy are required fields.",
        });
      }
  
      if (!validateOrganizationName(organization.name)) {
        throw APIError({
          code: 400,
          success: false,
          error: "Invalid organization name format.",
        });
      }
  
      if (!validateOrganizationUsername(organization.username)) {
        throw APIError({
          code: 400,
          success: false,
          error: "Invalid organization username format.",
        });
      }
  
      const isNameUnique = await this.organizationRepository.isOrganizationNameUnique(organization.name);
      if (!isNameUnique) {
        throw APIError({
          code: 400,
          success: false,
          error: "Organization name is already taken.",
        });
      }
  
      const isUsernameUnique = await this.organizationRepository.isOrganizationUsernameUnique(organization.username);
      if (!isUsernameUnique) {
        throw APIError({
          code: 400,
          success: false,
          error: "Organization username is already taken.",
        });
      }
  
      const createdOrganization = await this.organizationRepository.createOrganization(organization);
  
      await this.organizationRepository.addOrganizationMember({
        organization_id: createdOrganization.id,
        user_id: userId,
        role: 'admin',
        joined_at: new Date().toISOString()
      });
  
      return APIData({
        code: 201,
        success: true,
        data: createdOrganization,
      });
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while creating the organization.",
      });
    }
  }

  async updateOrganization(id: string, updates: Partial<Organization>, userId: string, profilePhoto?: MulterFile): Promise<APIResponse<Organization>> {
    try {
      const isAdmin = await this.organizationRepository.isUserAdmin(id, userId);
      if (!isAdmin) {
        throw APIError({
          code: 403,
          success: false,
          error: "You do not have permission to update this organization.",
        });
      }

      const updatedOrganization = await this.organizationRepository.updateOrganization(id, updates, profilePhoto);
      return APIData({
        code: 200,
        success: true,
        data: updatedOrganization,
      });
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while updating the organization.",
      });
    }
  }

  async deleteOrganization(id: string, userId: string): Promise<APIResponse<null>> {
    try {
      const isAdmin = await this.organizationRepository.isUserAdmin(id, userId);
      if (!isAdmin) {
        throw APIError({
          code: 403,
          success: false,
          error: "You do not have permission to delete this organization.",
        });
      }

      await this.organizationRepository.deleteOrganization(id);
      return APIData({
        code: 204,
        success: true,
        data: null,
      });
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while deleting the organization.",
      });
    }
  }

  async joinOrganization(organizationId: string, userId: string): Promise<APIResponse<JoinRequest | OrganizationMember>> {
    try {
  
      const isMember = await this.organizationRepository.isMember(organizationId, userId);
  
      if (isMember) {
        return APIData({
          code: 400,
          success: false,
          error: "You are already a member of this organization.",
        });
      }
  
      const joinPolicy = await this.organizationRepository.getOrganizationJoinPolicy(organizationId);
  
      if (joinPolicy === 'open') {
        const member = await this.organizationRepository.addOrganizationMember({
          organization_id: organizationId,
          user_id: userId,
          role: 'member',
          joined_at: new Date().toISOString()
        });
        return APIData({
          code: 201,
          success: true,
          data: member,
        });
      } else {
        const joinRequest = await this.organizationRepository.createJoinRequest(organizationId, userId);
        return APIData({
          code: 201,
          success: true,
          data: joinRequest,
        });
      }
    } catch (error) {
      console.error("Error in joinOrganization:", error);
      if (error instanceof Error) {
        return APIData({
          code: 500,
          success: false,
          error: error.message || "An unexpected error occurred while joining the organization.",
        });
      }
      return APIData({
        code: 500,
        success: false,
        error: "An unexpected error occurred while joining the organization.",
      });
    }
  }

  async getUserOrganizations(userId: string): Promise<APIResponse<Organization[]>> {
  try {
    const organizations = await this.organizationRepository.getUserOrganizations(userId);
    
    if (organizations.length === 0) {
      return APIData({
        code: 200,
        success: true,
        data: [],
        error: "User is not a member of any organizations."
      });
    }

    return APIData({
      code: 200,
      success: true,
      data: organizations,
    });
  } catch (error) {
    console.error("Error in getUserOrganizations:", error);
    if (error instanceof APIError) {
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while fetching user organizations.",
      });
    }
    return APIData({
      code: 500,
      success: false,
      error: "An unexpected error occurred while fetching user organizations.",
    });
  }
}

  async leaveOrganization(organizationId: string, userId: string): Promise<APIResponse<null>> {
    try {
      const isAdmin = await this.organizationRepository.isUserAdmin(organizationId, userId);
      
      if (isAdmin === null) {
        return APIData({
          code: 400,
          success: false,
          error: "You are not a member of this organization.",
        });
      }
  
      const memberCount = await this.organizationRepository.getOrganizationMemberCount(organizationId);
      const adminCount = await this.organizationRepository.getOrganizationAdminCount(organizationId);
  
      if (memberCount === 1) {
        return APIData({
          code: 400,
          success: false,
          error: "You are the last member. Please delete the organization instead.",
        });
      }
  
      if (isAdmin && adminCount === 1) {
        return APIData({
          code: 400,
          success: false,
          error: "You are the only admin. Please appoint another admin before leaving.",
        });
      }
  
      await this.organizationRepository.removeMember(organizationId, userId);
      return APIData({
        code: 200,
        success: true,
        data: null,
      });
    } catch (error) {
      console.error("Error in leaveOrganization:", error);
      if (error instanceof APIError) {
        throw APIError({
          code: 500,
          success: false,
          error: "An unexpected error occurred.",
        });
      }
      return APIData({
        code: 500,
        success: false,
        error: "An unexpected error occurred while leaving the organization.",
      });
    }
  }

  async addAdmin(organizationId: string, adminId: string, newAdminId: string): Promise<APIResponse<null>> {
    try {
      const isAdmin = await this.organizationRepository.isUserAdmin(organizationId, adminId);
      if (!isAdmin) {
        throw APIError({
          code: 403,
          success: false,
          error: "You do not have permission to add admins.",
        });
      }

      await this.organizationRepository.updateMemberRole(organizationId, newAdminId, 'admin');
      return APIData({
        code: 200,
        success: true,
        data: null,
      });
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while adding an admin.",
      });
    }
  }

  async setJoinPolicy(organizationId: string, joinPolicy: string, userId: string): Promise<APIResponse<null>> {
    try {
      const isAdmin = await this.organizationRepository.isUserAdmin(organizationId, userId);
      if (!isAdmin) {
        throw APIError({
          code: 403,
          success: false,
          error: "You do not have permission to change the join policy.",
        });
      }

      if (joinPolicy !== 'open' && joinPolicy !== 'request') {
        throw APIError({
          code: 400,
          success: false,
          error: "Invalid join policy. Must be 'open' or 'request'.",
        });
      }

      await this.organizationRepository.updateOrganizationJoinPolicy(organizationId, joinPolicy);
      return APIData({
        code: 200,
        success: true,
        data: null,
      });
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while setting the join policy.",
      });
    }
  }

  async getJoinRequests(organizationId: string, userId: string, params: PaginationParams): Promise<APIResponse<{ data: JoinRequest[], total: number }>> {
    try {
      const isAdmin = await this.organizationRepository.isUserAdmin(organizationId, userId);
      if (!isAdmin) {
        throw APIError({
          code: 403,
          success: false,
          error: "You do not have permission to view join requests.",
        });
      }
  
      const joinRequests = await this.organizationRepository.getJoinRequests(organizationId, params);
      return APIData({
        code: 200,
        success: true,
        data: joinRequests,
      });
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while getting join requests.",
      });
    }
  }

  async handleJoinRequest(organizationId: string, requestId: number, accept: boolean, userId: string): Promise<APIResponse<null>> {
    try {
      const isAdmin = await this.organizationRepository.isUserAdmin(organizationId, userId);
      if (isAdmin !== true) {
        return APIData({
          code: 403,
          success: false,
          error: "You do not have permission to handle join requests.",
        });
      }
  
      const joinRequest = await this.organizationRepository.getJoinRequestById(requestId);
      if (!joinRequest) {
        return APIData({
          code: 404,
          success: false,
          error: "Join request not found.",
        });
      }
  
      if (joinRequest.organization_id !== organizationId) {
        return APIData({
          code: 400,
          success: false,
          error: "Join request does not belong to this organization.",
        });
      }
  
      if (joinRequest.status !== 'pending') {
        return APIData({
          code: 400,
          success: false,
          error: "This join request has already been processed.",
        });
      }
  
      if (accept) {
        // Update the join request status
        await this.organizationRepository.updateJoinRequestStatus(requestId, "accepted");
        
        // Add the user to the organization_members table
        await this.organizationRepository.addOrganizationMember({
          organization_id: organizationId,
          user_id: joinRequest.user_id,
          role: 'member',
          joined_at: new Date().toISOString()
        });
      } else {
        // If not accepting, just update the join request status to rejected
        await this.organizationRepository.updateJoinRequestStatus(requestId, "rejected");
      }
  
      return APIData({
        code: 200,
        success: true,
        data: null,
      });
    } catch (error) {
      console.error("Error in handleJoinRequest:", error);
      if (error instanceof APIError) {
        return APIData({
          code: 500,
          success: false,
          error: "An unexpected error occurred while handling the join request.",
        });
      }
      return APIData({
        code: 500,
        success: false,
        error: "An unexpected error occurred while handling the join request.",
      });
    }
  }

  async removeMember(organizationId: string, memberUserId: string, adminUserId: string): Promise<APIResponse<null>> {
    try {
      const isAdmin = await this.organizationRepository.isUserAdmin(organizationId, adminUserId);
      if (!isAdmin) {
        throw APIError({
          code: 403,
          success: false,
          error: "You do not have permission to remove members.",
        });
      }

      if (memberUserId === adminUserId) {
        throw APIError({
          code: 400,
          success: false,
          error: "You cannot remove yourself from the organization.",
        });
      }

      await this.organizationRepository.removeMember(organizationId, memberUserId);
      return APIData({
        code: 200,
        success: true,
        data: null,
      });
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while removing the member.",
      });
    }
  }

  async getOrganizations(params: PaginationParams): Promise<APIResponse<{ data: Organization[], total: number }>> {
    try {
      const organizations = await this.organizationRepository.getOrganizations(params);
      return APIData({
        code: 200,
        success: true,
        data: organizations,
      });
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while fetching organizations.",
      });
    }
  }

  async getOrganizationById(id: string): Promise<APIResponse<Organization>> {
    try {
      const organization = await this.organizationRepository.getOrganizationById(id);
      return APIData({
        code: 200,
        success: true,
        data: organization,
      });
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while fetching the organization.",
      });
    }
  }

  async generateReport(organizationId: string, userId: string): Promise<APIResponse<null>> {
    try {
      const isAdmin: boolean = await this.organizationRepository.isUserAdmin(organizationId, userId) as boolean;
      if (!isAdmin) {
        throw APIError({
          code: 403,
          success: false,
          error: "You do not have permission to generate reports.",
        });
      }
  
      // Placeholder for future implementation
      // Example: Fetch organization and member details, generate report
      // const organization = await this.organizationRepository.getOrganizationById(organizationId);
      // const members = await this.organizationRepository.getOrganizationMembers(organizationId);
  
      return APIData({
        code: 200,
        success: true,
        data: null, // Replace with the actual report object in the future
      });
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while generating the report.",
      });
    }
  }
  

  async deleteJoinRequest(requestId: number, userId: string): Promise<APIResponse<null>> {
    try {
      await this.organizationRepository.deleteJoinRequest(requestId, userId);
      return APIData({
        code: 200,
        success: true,
        data: null,
      });
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while deleting the join request.",
      });
    }
  }

  async getJoinRequestsByUser(userId: string): Promise<APIResponse<JoinRequest[]>> {
    try {
      const joinRequests = await this.organizationRepository.getJoinRequestsByUser(userId);
      return APIData({
        code: 200,
        success: true,
        data: joinRequests,
      });
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while fetching user's join requests.",
      });
    }
  }

  async searchOrganizations(searchTerm: string, params: PaginationParams): Promise<APIResponse<{ data: Organization[], total: number }>> {
    try {
      const result = await this.organizationRepository.searchOrganizations(searchTerm, params);
      return APIData({
        code: 200,
        success: true,
        data: result,
      });
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while searching organizations.",
      });
    }
  }
}