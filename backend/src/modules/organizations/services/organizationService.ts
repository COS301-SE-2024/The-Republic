import { OrganizationRepository } from "@/modules/organizations/repositories/organizationRepository";
import {
  Organization,
  OrganizationMember,
  JoinRequest,
  OrganizationPost,
  ActivityLog,
  ActionDetails,
  UpdateOrganizationDetails,
} from "@/modules/shared/models/organization";
import { APIResponse, APIData, APIError } from "@/types/response";
import {
  validateOrganizationName,
  validateOrganizationUsername,
} from "@/utilities/validators";
import { PaginationParams } from "@/types/pagination";
import { MulterFile } from "@/types/users";
import supabase from "@/modules/shared/services/supabaseClient";

export class OrganizationService {
  private organizationRepository: OrganizationRepository;

  constructor() {
    this.organizationRepository = new OrganizationRepository();
  }

  async createOrganization(
    organization: Partial<Organization> & { profilePhoto?: Express.Multer.File },
    userId: string,
  ): Promise<APIResponse<Organization>> {
    try {
      if (
        !organization.name ||
        !organization.username ||
        !organization.join_policy
      ) {
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

      const isNameUnique =
        await this.organizationRepository.isOrganizationNameUnique(
          organization.name,
        );
      if (!isNameUnique) {
        throw APIError({
          code: 400,
          success: false,
          error: "Organization name is already taken.",
        });
      }

      const isUsernameUnique =
        await this.organizationRepository.isOrganizationUsernameUnique(
          organization.username,
        );
      if (!isUsernameUnique) {
        throw APIError({
          code: 400,
          success: false,
          error: "Organization username is already taken.",
        });
      }

      let profilePhotoUrl: string | null = null;
      if (organization.profilePhoto) {
        profilePhotoUrl = await this.uploadProfilePhoto(organization.profilePhoto);
      }

      const organizationData = {
        name: organization.name,
        username: organization.username,
        bio: organization.bio,
        website_url: organization.website_url,
        join_policy: organization.join_policy,
        org_type: organization.org_type,
        profile_photo: profilePhotoUrl ?? undefined,
        created_at: new Date().toISOString(),
        verified_status: false,
        points: 0,
      };

      console.log(organizationData);

      const createdOrganization = await this.organizationRepository.createOrganization(organizationData);

      await this.organizationRepository.addOrganizationMember({
        organization_id: createdOrganization.id,
        user_id: userId,
        role: "admin",
        joined_at: new Date().toISOString(),
      });

      return APIData({
        code: 201,
        success: true,
        data: createdOrganization,
      });
    } catch (error) {
      console.error("Error in createOrganization service:", error);
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

  private async uploadProfilePhoto(file: Express.Multer.File): Promise<string> {
    const fileName = `org_${Date.now()}_${file.originalname}`;
    const { error: uploadError } = await supabase.storage
      .from("organizations")
      .upload(fileName, file.buffer);

    if (uploadError) {
      console.error("Error uploading profile photo:", uploadError);
      throw APIError({
        code: 500,
        success: false,
        error: "An error occurred while uploading the profile photo.",
      });
    }

    const { data: urlData } = supabase.storage
      .from("organizations")
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  }

  async updateOrganization(
    id: string,
    updates: Partial<Organization>,
    userId: string,
    profilePhoto?: MulterFile,
  ): Promise<APIResponse<Organization>> {
    try {
      const isAdmin = await this.organizationRepository.isUserAdmin(id, userId);
      if (!isAdmin) {
        throw APIError({
          code: 403,
          success: false,
          error: "You do not have permission to update this organization.",
        });
      }

      const updatesToSend = updates;

      const updatedOrganization =
        await this.organizationRepository.updateOrganization(
          id,
          updatesToSend,
          profilePhoto,
        );

      const actionDetails: ActionDetails = {
        type: "UPDATE_ORGANIZATION",
        details: updatesToSend as UpdateOrganizationDetails,
      };
      await this.organizationRepository.logActivity(
        id,
        userId,
        "UPDATE_ORGANIZATION",
        actionDetails,
      );

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

  async deleteOrganization(
    id: string,
    userId: string,
  ): Promise<APIResponse<null>> {
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

  async joinOrganization(
    organizationId: string,
    userId: string,
  ): Promise<APIResponse<JoinRequest | OrganizationMember>> {
    try {
      const isMember = await this.organizationRepository.isMember(
        organizationId,
        userId,
      );

      if (isMember) {
        return APIData({
          code: 400,
          success: false,
          error: "You are already a member of this organization.",
        });
      }

      const joinPolicy =
        await this.organizationRepository.getOrganizationJoinPolicy(
          organizationId,
        );

      if (joinPolicy === "open") {
        const member = await this.organizationRepository.addOrganizationMember({
          organization_id: organizationId,
          user_id: userId,
          role: "member",
          joined_at: new Date().toISOString(),
        });
        return APIData({
          code: 201,
          success: true,
          data: member,
        });
      } else {
        const joinRequest = await this.organizationRepository.createJoinRequest(
          organizationId,
          userId,
        );
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
          error:
            error.message ||
            "An unexpected error occurred while joining the organization.",
        });
      }
      return APIData({
        code: 500,
        success: false,
        error: "An unexpected error occurred while joining the organization.",
      });
    }
  }

  async leaveOrganization(
    organizationId: string,
    userId: string,
  ): Promise<APIResponse<null>> {
    try {
      const isAdmin = await this.organizationRepository.isUserAdmin(
        organizationId,
        userId,
      );

      if (isAdmin === null) {
        return APIData({
          code: 400,
          success: false,
          error: "You are not a member of this organization.",
        });
      }

      const memberCount =
        await this.organizationRepository.getOrganizationMemberCount(
          organizationId,
        );
      const adminCount =
        await this.organizationRepository.getOrganizationAdminCount(
          organizationId,
        );

      if (memberCount === 1) {
        return APIData({
          code: 400,
          success: false,
          error:
            "You are the last member. Please delete the organization instead.",
        });
      }

      if (isAdmin && adminCount === 1) {
        return APIData({
          code: 400,
          success: false,
          error:
            "You are the only admin. Please appoint another admin before leaving.",
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

  async addAdmin(
    organizationId: string,
    adminId: string,
    newAdminId: string,
  ): Promise<APIResponse<null>> {
    try {
      const isAdmin = await this.organizationRepository.isUserAdmin(
        organizationId,
        adminId,
      );
      if (!isAdmin) {
        throw APIError({
          code: 403,
          success: false,
          error: "You do not have permission to add admins.",
        });
      }

      await this.organizationRepository.updateMemberRole(
        organizationId,
        newAdminId,
        "admin",
      );

      const actionDetails: ActionDetails = {
        type: "ASSIGN_ADMIN",
        details: { newAdminId },
      };
      await this.organizationRepository.logActivity(
        organizationId,
        adminId,
        "ASSIGN_ADMIN",
        actionDetails,
      );

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

  async setJoinPolicy(
    organizationId: string,
    joinPolicy: string,
    userId: string,
  ): Promise<APIResponse<null>> {
    try {
      const isAdmin = await this.organizationRepository.isUserAdmin(
        organizationId,
        userId,
      );
      if (!isAdmin) {
        throw APIError({
          code: 403,
          success: false,
          error: "You do not have permission to change the join policy.",
        });
      }

      if (joinPolicy !== "open" && joinPolicy !== "request") {
        throw APIError({
          code: 400,
          success: false,
          error: "Invalid join policy. Must be 'open' or 'request'.",
        });
      }

      await this.organizationRepository.updateOrganizationJoinPolicy(
        organizationId,
        joinPolicy,
      );

      if (joinPolicy === "open") {
        const pendingRequests =
          await this.organizationRepository.getJoinRequests(organizationId, {
            offset: 0,
            limit: 1000,
          }); // Adjust the limit as needed

        for (const request of pendingRequests.data) {
          await this.organizationRepository.updateJoinRequestStatus(
            request.id,
            "accepted",
          );

          await this.organizationRepository.addOrganizationMember({
            organization_id: organizationId,
            user_id: request.user_id,
            role: "member",
            joined_at: new Date().toISOString(),
          });
        }
      }

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

  async getJoinRequests(
    organizationId: string,
    userId: string,
    params: PaginationParams,
  ): Promise<APIResponse<{ data: JoinRequest[]; total: number }>> {
    try {
      const isAdmin = await this.organizationRepository.isUserAdmin(
        organizationId,
        userId,
      );
      if (!isAdmin) {
        throw APIError({
          code: 403,
          success: false,
          error: "You do not have permission to view join requests.",
        });
      }

      const joinRequests = await this.organizationRepository.getJoinRequests(
        organizationId,
        params,
      );
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

  async handleJoinRequest(
    organizationId: string,
    requestId: number,
    accept: boolean,
    userId: string,
  ): Promise<APIResponse<null>> {
    try {
      const isAdmin = await this.organizationRepository.isUserAdmin(
        organizationId,
        userId,
      );
      if (isAdmin !== true) {
        return APIData({
          code: 403,
          success: false,
          error: "You do not have permission to handle join requests.",
        });
      }

      const joinRequest =
        await this.organizationRepository.getJoinRequestById(requestId);
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

      if (joinRequest.status !== "pending") {
        return APIData({
          code: 400,
          success: false,
          error: "This join request has already been processed.",
        });
      }

      if (accept) {
        // Update the join request status
        await this.organizationRepository.updateJoinRequestStatus(
          requestId,
          "accepted",
        );

        // Add the user to the organization_members table
        await this.organizationRepository.addOrganizationMember({
          organization_id: organizationId,
          user_id: joinRequest.user_id,
          role: "member",
          joined_at: new Date().toISOString(),
        });
      } else {
        // If not accepting, just update the join request status to rejected
        await this.organizationRepository.updateJoinRequestStatus(
          requestId,
          "rejected",
        );
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
          error:
            "An unexpected error occurred while handling the join request.",
        });
      }
      return APIData({
        code: 500,
        success: false,
        error: "An unexpected error occurred while handling the join request.",
      });
    }
  }

  async getJoinRequestByUser(
    organizationId: string,
    userId: string,
  ): Promise<APIResponse<JoinRequest | null>> {
    try {
      const joinRequest =
        await this.organizationRepository.getJoinRequestByUser(
          organizationId,
          userId,
        );
      return APIData({
        code: 200,
        success: true,
        data: joinRequest,
      });
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while fetching the join request.",
      });
    }
  }

  async removeMember(
    organizationId: string,
    memberUserId: string,
    adminUserId: string,
  ): Promise<APIResponse<null>> {
    try {
      const isAdmin = await this.organizationRepository.isUserAdmin(
        organizationId,
        adminUserId,
      );
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

      await this.organizationRepository.removeMember(
        organizationId,
        memberUserId,
      );
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

  async getOrganizations(
    params: PaginationParams,
    orgType: string | null = null,
    locationId: string | null = null,
    userId: string,
  ): Promise<APIResponse<{ data: Organization[]; total: number }>> {
    try {
      const organizations = await this.organizationRepository.getOrganizations(
        params,
        orgType,
        locationId,
        userId,
      );
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

  async getOrganizationById(
    id: string,
    userId: string,
  ): Promise<APIResponse<Organization & { isAdmin: boolean }>> {
    try {
      const organization =
        await this.organizationRepository.getOrganizationById(id);
      const isAdmin = await this.organizationRepository.isUserAdmin(id, userId);

      return APIData({
        code: 200,
        success: true,
        data: {
          ...organization,
          isAdmin: isAdmin ?? false,
          averageSatisfactionRating: organization.averageSatisfactionRating,
        },
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

  async generateReport(
    organizationId: string,
    userId: string,
  ): Promise<APIResponse<null>> {
    try {
      const isAdmin: boolean = (await this.organizationRepository.isUserAdmin(
        organizationId,
        userId,
      )) as boolean;
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
        data: null,
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

  async deleteJoinRequest(
    requestId: number,
    userId: string,
  ): Promise<APIResponse<null>> {
    try {
      const joinRequest = await this.organizationRepository.getJoinRequestById(requestId);
      
      if (!joinRequest) {
        return APIError({
          code: 404,
          success: false,
          error: "Join request not found.",
        });
      }

      if (joinRequest.user_id !== userId) {
        return APIError({
          code: 403,
          success: false,
          error: "You do not have permission to delete this join request.",
        });
      }

      await this.organizationRepository.deleteJoinRequest(requestId, userId);

      return APIData({
        code: 200,
        success: true,
        data: null,
      });
    } catch (error) {
      return APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while deleting the join request.",
      });
    }
  }

  async getJoinRequestsByUser(
    userId: string,
  ): Promise<APIResponse<JoinRequest[]>> {
    try {
      const joinRequests =
        await this.organizationRepository.getJoinRequestsByUser(userId);
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
        error:
          "An unexpected error occurred while fetching user's join requests.",
      });
    }
  }

  async searchOrganizations(
    searchTerm: string,
    orgType: string | null,
    locationId: string | null,
    params: PaginationParams,
  ): Promise<APIResponse<{ data: Organization[]; total: number }>> {
    try {
      const result = await this.organizationRepository.searchOrganizations(
        searchTerm,
        orgType,
        locationId,
        params,
      );
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

  async getOrganizationPosts(
    organizationId: string,
    userId: string,
    params: PaginationParams,
  ): Promise<APIResponse<{ data: OrganizationPost[]; total: number }>> {
    try {
      const posts = await this.organizationRepository.getOrganizationPosts(
        organizationId,
        userId,
        params,
      );
      return APIData({
        code: 200,
        success: true,
        data: posts,
      });
    } catch (error) {
      console.error("Service: Error in getOrganizationPosts", error);
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError({
        code: 500,
        success: false,
        error:
          "An unexpected error occurred while fetching organization posts.",
      });
    }
  }

  async createOrganizationPost(
    post: Partial<OrganizationPost>,
    userId: string,
    image?: MulterFile,
  ): Promise<APIResponse<OrganizationPost>> {
    try {
      let imageUrl: string | null = null;

      if (image) {
        imageUrl = await this.uploadImage(post.organization_id!, image);
      }

      const newPost = await this.organizationRepository.createOrganizationPost({
        ...post,
        image_url: imageUrl,
        created_at: new Date().toISOString(),
      });

      const actionDetails: ActionDetails = {
        type: "CREATE_POST",
        details: { postId: newPost.post_id },
      };
      await this.organizationRepository.logActivity(
        post.organization_id!,
        userId,
        "CREATE_POST",
        actionDetails,
      );

      return APIData({
        code: 201,
        success: true,
        data: newPost,
      });
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError({
        code: 500,
        success: false,
        error:
          "An unexpected error occurred while creating the organization post.",
      });
    }
  }

  async isMember(organizationId: string, userId: string): Promise<boolean> {
    return await this.organizationRepository.isMember(organizationId, userId);
  }

  async deleteOrganizationPost(postId: string): Promise<APIResponse<null>> {
    try {
      const post =
        await this.organizationRepository.getOrganizationPostById(postId);

      if (post.image_url) {
        await this.deleteImage(post.image_url);
      }

      await this.organizationRepository.deleteOrganizationPost(postId);
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
        error:
          "An unexpected error occurred while deleting the organization post.",
      });
    }
  }

  async getTopActiveMembers(
    organizationId: string,
  ): Promise<APIResponse<OrganizationMember[]>> {
    try {
      const members =
        await this.organizationRepository.getTopActiveMembers(organizationId);
      return APIData({
        code: 200,
        success: true,
        data: members,
      });
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError({
        code: 500,
        success: false,
        error:
          "An unexpected error occurred while fetching top active members.",
      });
    }
  }

  private async uploadImage(
    organizationId: string,
    image: MulterFile,
  ): Promise<string> {
    const fileName = `${organizationId}_${Date.now()}-${image.originalname}`;
    const { error: uploadError } = await supabase.storage
      .from("organization_posts")
      .upload(fileName, image.buffer);

    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      throw APIError({
        code: 500,
        success: false,
        error: "An error occurred while uploading the image. Please try again.",
      });
    }

    const { data: urlData } = supabase.storage
      .from("organization_posts")
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  }

  private async deleteImage(imageUrl: string): Promise<void> {
    const imageName = imageUrl.split("/").slice(-1)[0];
    const { error: deleteError } = await supabase.storage
      .from("organization_posts")
      .remove([imageName]);

    if (deleteError) {
      console.error("Failed to delete image from storage:", deleteError);
      throw APIError({
        code: 500,
        success: false,
        error: "An error occurred while deleting the image. Please try again.",
      });
    }
  }

  async getOrganizationMembers(
    organizationId: string,
    userId: string,
    params: PaginationParams,
  ): Promise<APIResponse<{ data: OrganizationMember[]; total: number }>> {
    try {
      const members = await this.organizationRepository.getOrganizationMembers(
        organizationId,
        params,
      );
      return APIData({
        code: 200,
        success: true,
        data: members,
      });
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError({
        code: 500,
        success: false,
        error:
          "An unexpected error occurred while fetching organization members.",
      });
    }
  }

  async getOrganizationPost(
    organizationId: string,
    postId: string,
    userId: string,
  ): Promise<APIResponse<OrganizationPost>> {
    try {
      const post = await this.organizationRepository.getOrganizationPost(
        organizationId,
        postId,
      );

      // Fetch user's reaction
      const userReaction =
        await this.organizationRepository.reactionRepository.getReactionByUserAndItem(
          postId,
          "post",
          userId,
        );

      // Add user's reaction to the post data
      post.reactions.userReaction = userReaction?.emoji || null;

      return APIData({
        code: 200,
        success: true,
        data: post,
      });
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError({
        code: 500,
        success: false,
        error:
          "An unexpected error occurred while fetching the organization post.",
      });
    }
  }

  async checkUserMembership(
    organizationId: string,
    userId: string,
  ): Promise<APIResponse<{ isMember: boolean }>> {
    try {
      const isMember = await this.organizationRepository.isMember(
        organizationId,
        userId,
      );
      return APIData({
        code: 200,
        success: true,
        data: { isMember },
      });
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while checking user membership.",
      });
    }
  }

  async getActivityLogs(
    organizationId: string,
    userId: string,
    params: PaginationParams,
  ): Promise<APIResponse<{ data: ActivityLog[]; total: number }>> {
    try {
      const isAdmin = await this.organizationRepository.isUserAdmin(
        organizationId,
        userId,
      );
      if (!isAdmin) {
        throw APIError({
          code: 403,
          success: false,
          error: "You do not have permission to view activity logs.",
        });
      }

      const logs = await this.organizationRepository.getActivityLogs(
        organizationId,
        params,
      );
      return APIData({
        code: 200,
        success: true,
        data: logs,
      });
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while fetching activity logs.",
      });
    }
  }
}
