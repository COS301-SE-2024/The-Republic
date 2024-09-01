import IssueRepository from "@/modules/issues/repositories/issueRepository";
import { Issue } from "@/modules/shared/models/issue";
import { Resolution } from "@/modules/shared/models/resolution";
import { GetIssuesParams } from "@/types/issue";
import { APIData, APIError, APIResponse } from "@/types/response";
import { LocationRepository } from "@/modules/locations/repositories/locationRepository";
import supabase from "@/modules/shared/services/supabaseClient";
import { MulterFile } from "@/types/users";
import { PointsService } from "@/modules/points/services/pointsService";
import { ClusterService } from '@/modules/clusters/services/clusterService';
import { OpenAIService } from '@/modules/shared/services/openAIService';
import { ResolutionService } from "@/modules/resolutions/services/resolutionService";
import ReactionRepository from "@/modules/reactions/repositories/reactionRepository";
import { CommentRepository } from "@/modules/comments/repositories/commentRepository";

export default class IssueService {
  private issueRepository: IssueRepository;
  private locationRepository: LocationRepository;
  private pointsService: PointsService;
  private clusterService: ClusterService;
  private openAIService: OpenAIService;
  private resolutionService: ResolutionService;
  private reactionRepository: ReactionRepository;
  private commentRepository: CommentRepository;

  constructor() {
    this.issueRepository = new IssueRepository();
    this.locationRepository = new LocationRepository();
    this.pointsService = new PointsService();
    this.clusterService = new ClusterService();
    this.openAIService = new OpenAIService();
    this.resolutionService = new ResolutionService();
    this.reactionRepository = new ReactionRepository();
    this.commentRepository = new CommentRepository();
  }

  setIssueRepository(issueRepository: IssueRepository): void {
    this.issueRepository = issueRepository;
  }

  setLocationRepository(locationRepository: LocationRepository): void {
    this.locationRepository = locationRepository;
  }

  setPointsService(pointsService: PointsService): void {
    this.pointsService = pointsService;
  }

  setClusterService(clusterService: ClusterService): void {
    this.clusterService = clusterService;
  }

  setOpenAIService(openAIService: OpenAIService): void {
    this.openAIService = openAIService;
  }

  setResolutionService(resolutionService: ResolutionService): void {
    this.resolutionService = resolutionService;
  }

  setReactionRepository(reactionRepository: ReactionRepository): void{
    this.reactionRepository = reactionRepository;
  }

  setCommentRepository(commentRepository: CommentRepository): void{
    this.commentRepository = commentRepository;
  }

  async getIssues(params: Partial<GetIssuesParams>) {
    if (params.from === undefined || !params.amount) {
      throw APIError({
        code: 400,
        success: false,
        error: "Missing required fields for getting issues",
      });
    }

    const issues = await this.issueRepository.getIssues(params);

    const issuesWithUserInfo = issues.map((issue) => {
      const isOwner = issue.user_id === params.user_id;

      if (issue.is_anonymous) {
        issue.user = {
          user_id: null,
          email_address: null,
          username: "Anonymous",
          fullname: "Anonymous",
          image_url: null,
          is_owner: false,
          total_issues: null,
          resolved_issues: null,
          user_score: 0, 
          location_id: null,
          location: null
        };
      }

      return {
        ...issue,
        is_owner: isOwner,
      };
    });

    return APIData({
      code: 200,
      success: true,
      data: issuesWithUserInfo,
    });
  }

  async getIssueById(issue: Partial<Issue>) {
    const issue_id = issue.issue_id;
    if (!issue_id) {
      throw APIError({
        code: 400,
        success: false,
        error: "Missing required fields for getting an issue",
      });
    }

    const resIssue = await this.issueRepository.getIssueById(
      issue_id,
      issue.user_id,
    );

    const isOwner = resIssue.user_id === issue.user_id;
    
    if (resIssue.cluster_id) {
      const clusterInfo = await this.clusterService.getClusterById(resIssue.cluster_id);
      resIssue.cluster = clusterInfo;
    }

    if (resIssue.is_anonymous) {
      resIssue.user = {
        user_id: null,
        email_address: null,
        username: "Anonymous",
        fullname: "Anonymous",
        image_url: null,
        is_owner: false,
        total_issues: null,
        resolved_issues: null,
        user_score: 0, 
          location_id: null,
          location: null
      };
    }

    return APIData({
      code: 200,
      success: true,
      data: {
        ...resIssue,
        is_owner: isOwner,
      },
    });
  }

  async createIssue(issue: Partial<Issue>, image?: MulterFile) {
    if (!issue.user_id) {
      throw APIError({
        code: 401,
        success: false,
        error: "You need to be signed in to create an issue",
      });
    }

    if (!issue.category_id || !issue.content) {
      throw APIError({
        code: 400,
        success: false,
        error: "Missing required fields for creating an issue",
      });
    }

    if (issue.content.length > 500) {
      throw APIError({
        code: 413,
        success: false,
        error: "Issue content exceeds the maximum length of 500 characters",
      });
    }

    let imageUrl: string | null = null;

    if (image) {
      const fileName = `${issue.user_id}_${Date.now()}-${image.originalname}`;
      const { error } = await supabase.storage
        .from("issues")
        .upload(fileName, image.buffer);

      if (error) {
        console.error(error);
        throw APIError({
          code: 500,
          success: false,
          error:
            "An error occurred while uploading the image. Please try again.",
        });
      }

      const { data: urlData } = supabase.storage
        .from("issues")
        .getPublicUrl(fileName);

      imageUrl = urlData.publicUrl;
    }

    delete issue.issue_id;

    const createdIssue = await this.issueRepository.createIssue({
      ...issue,
      image_url: imageUrl,
    });

    this.processIssueAsync(createdIssue);

    const isFirstIssue = await this.pointsService.getFirstTimeAction(issue.user_id!, "created first issue");
    const points = isFirstIssue ? 50 : 20;
    await this.pointsService.awardPoints(issue.user_id!, points, isFirstIssue ? "created first issue" : "created an issue");

    return APIData({
      code: 200,
      success: true,
      data: createdIssue,
    });
  }

  public async processIssueAsync(issue: Issue) {
    try {
      const embedding = await this.openAIService.getEmbedding(issue.content);
      await this.issueRepository.setIssueEmbedding(issue.issue_id, embedding);
      issue.content_embedding = embedding;
  
      await this.clusterService.assignClusterToIssue(issue);
    } catch (error) {
      console.error(`Error processing issue ${issue}:`, error);
    }
  }

  async updateIssue(issue: Partial<Issue>) {
    const user_id = issue.user_id;
    if (!user_id) {
      throw APIError({
        code: 401,
        success: false,
        error: "You need to be signed in to update an issue",
      });
    }

    const issue_id = issue.issue_id;
    if (!issue_id) {
      throw APIError({
        code: 400,
        success: false,
        error: "Missing required fields for updating an issue",
      });
    }

    if (issue.created_at || issue.resolved_at) {
      throw APIError({
        code: 400,
        success: false,
        error: "Cannot change the time an issue was created or resolved",
      });
    }

    delete issue.user_id;
    delete issue.issue_id;

    const updatedIssue = await this.issueRepository.updateIssue(
      issue_id,
      issue,
      user_id,
    );

    return APIData({
      code: 200,
      success: true,
      data: updatedIssue,
    });
  }

  async deleteIssue(issue: Partial<Issue>) {
    const user_id = issue.user_id;
    if (!user_id) {
      throw APIError({
        code: 401,
        success: false,
        error: "You need to be signed in to delete an issue",
      });
    }

    const issue_id = issue.issue_id;
    if (!issue_id) {
      throw APIError({
        code: 400,
        success: false,
        error: "Missing required fields for deleting an issue",
      });
    }

    const issueToDelete = await this.issueRepository.getIssueById(
      issue_id,
      user_id,
    );

    if (issueToDelete.image_url) {
      const imageName = issueToDelete.image_url.split("/").slice(-1)[0];
      const { error } = await supabase.storage
        .from("issues")
        .remove([imageName]);

      if (error) {
        console.error("Failed to delete image from storage:", error);
        throw APIError({
          code: 500,
          success: false,
          error:
            "An error occurred while deleting the image. Please try again.",
        });
      }
    }

    if (issueToDelete.cluster_id) {
      await this.clusterService.removeIssueFromCluster(issue_id, issueToDelete.cluster_id);
    }

    await this.issueRepository.deleteIssue(issue_id, user_id);

    return APIData({
      code: 204,
      success: true,
    });
  }

  async resolveIssue(issue: Partial<Issue>): Promise<APIResponse<Resolution>> {
    const user_id = issue.user_id;
    const issue_id = issue.issue_id;
  
    if (!user_id || !issue_id) {
      throw APIError({
        code: 400,
        success: false,
        error: "Missing required fields for resolving an issue",
      });
    }
  
    return this.createSelfResolution(issue_id, user_id, "Issue resolved by owner");
  }

  async createSelfResolution(issueId: number, userId: string, resolutionText: string, proofImage?: MulterFile): Promise<APIResponse<Resolution>> {
    try {
      //console.log(`Starting createSelfResolution for issue ${issueId} by user ${userId}`);
      
      const issue = await this.issueRepository.getIssueById(issueId);
      
      if (issue.resolved_at) {
        throw APIError({
          code: 400,
          success: false,
          error: "This issue has already been resolved.",
        });
      }
    
      if (issue.user_id !== userId) {
        throw APIError({
          code: 403,
          success: false,
          error: "You can only create a self-resolution for your own issues.",
        });
      }
    
      let numClusterMembers = 1;
    
      if (issue.cluster_id) {
        const cluster = await this.clusterService.getClusterById(issue.cluster_id);
        numClusterMembers = cluster.issue_count;
      }
  
      let imageUrl: string | null = null;
  
      if (proofImage) {
        //console.log(`Uploading proof image`);
        const fileName = `${userId}_${Date.now()}-${proofImage.originalname}`;
        const { error } = await supabase.storage
          .from("resolutions")
          .upload(fileName, proofImage.buffer);
  
        if (error) {
          console.error("Image upload error:", error);
          throw APIError({
            code: 500,
            success: false,
            error: "An error occurred while uploading the image. Please try again.",
          });
        }
  
        const { data: urlData } = supabase.storage
          .from("resolutions")
          .getPublicUrl(fileName);
  
        imageUrl = urlData.publicUrl;
        //console.log(`Image uploaded successfully. URL: ${imageUrl}`);
      }
    
      //console.log(`Creating resolution`);
      const resolution = await this.resolutionService.createResolution({
        issue_id: issueId,
        resolver_id: userId,
        resolution_text: resolutionText,
        proof_image: imageUrl,
        resolution_source: 'self',
        num_cluster_members: numClusterMembers,
        political_association: null,
        state_entity_association: null,
        resolved_by: null
      });
  
      //console.log(`Returning successful response`);
      return APIData({
        code: 200,
        success: true,
        data: resolution,
      });
    } catch (error) {
      console.error("Error in createSelfResolution:", error);
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while creating a self-resolution.",
      });
    }
  }
  
  async createExternalResolution(
    issueId: number, 
    userId: string, 
    resolutionText: string, 
    proofImage?: MulterFile,
    politicalAssociation?: string,
    stateEntityAssociation?: string,
    resolvedBy?: string
  ): Promise<APIResponse<Resolution>> {
    try {
      const issue = await this.issueRepository.getIssueById(issueId);
      
      if (issue.resolved_at) {
        throw APIError({
          code: 400,
          success: false,
          error: "This issue has already been resolved.",
        });
      }
    
      let numClusterMembers = 1;
    
      if (issue.cluster_id) {
        const cluster = await this.clusterService.getClusterById(issue.cluster_id);
        numClusterMembers = cluster.issue_count;
      }
  
      let imageUrl: string | null = null;
  
      if (proofImage) {
        const fileName = `${userId}_${Date.now()}-${proofImage.originalname}`;
        const { error } = await supabase.storage
          .from("resolutions")
          .upload(fileName, proofImage.buffer);
  
        if (error) {
          console.error(error);
          throw APIError({
            code: 500,
            success: false,
            error: "An error occurred while uploading the image. Please try again.",
          });
        }
  
        const { data: urlData } = supabase.storage
          .from("resolutions")
          .getPublicUrl(fileName);
  
        imageUrl = urlData.publicUrl;
      }
    
      const resolution = await this.resolutionService.createResolution({
        issue_id: issueId,
        resolver_id: userId,
        resolution_text: resolutionText,
        proof_image: imageUrl,
        resolution_source: resolvedBy ? 'other' : 'unknown',
        num_cluster_members: numClusterMembers,
        political_association: politicalAssociation || null,
        state_entity_association: stateEntityAssociation || null,
        resolved_by: resolvedBy || null
      });
  
      return APIData({
        code: 200,
        success: true,
        data: resolution,
      });
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while creating an external resolution.",
      });
    }
  }

  async respondToResolution(resolutionId: string, userId: string, accept: boolean): Promise<APIResponse<Resolution>> {
    try {
      const resolution = await this.resolutionService.updateResolutionStatus(resolutionId, accept ? 'accepted' : 'declined', userId);
      return APIData({
        code: 200,
        success: true,
        data: resolution,
      });
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while responding to the resolution.",
      });
    }
  }

  async getUserIssues(issue: Partial<Issue>) {
    const userId = issue.profile_user_id;
    if (!userId) {
      throw APIError({
        code: 401,
        success: false,
        error: "Missing profile user ID",
      });
    }

    const issues = await this.issueRepository.getUserIssues(userId);

    const issuesWithUserInfo = issues.map((issue) => {
      const isOwner = issue.user_id === userId;

      if (issue.is_anonymous) {
        issue.user = {
          user_id: null,
          email_address: null,
          username: "Anonymous",
          fullname: "Anonymous",
          image_url: null,
          is_owner: false,
          total_issues: null,
          resolved_issues: null,
          user_score: 0, 
          location_id: null,
          location: null
        };
      }

      return {
        ...issue,
        is_owner: isOwner,
      };
    });

    return APIData({
      code: 200,
      success: true,
      data: issuesWithUserInfo,
    });
  }

  async getUserResolvedIssues(issue: Partial<Issue>) {
    const userId = issue.profile_user_id;
    if (!userId) {
      throw APIError({
        code: 401,
        success: false,
        error: "Missing profile user ID",
      });
    }

    const resolvedIssues =
      await this.issueRepository.getUserResolvedIssues(userId);

    const issuesWithUserInfo = resolvedIssues.map((issue) => {
      const isOwner = issue.user_id === userId;

      if (issue.is_anonymous) {
        issue.user = {
          user_id: null,
          email_address: null,
          username: "Anonymous",
          fullname: "Anonymous",
          image_url: null,
          is_owner: false,
          total_issues: null,
          resolved_issues: null,
          user_score: 0, 
          location_id: null,
          location: null
        };
      }

      return {
        ...issue,
        is_owner: isOwner,
      };
    });

    return APIData({
      code: 200,
      success: true,
      data: issuesWithUserInfo,
    });
  }

  async hasUserIssuesInCluster(userId: string, clusterId: string): Promise<APIResponse<boolean>> {
    try {
      const hasIssues = await this.issueRepository.hasUserIssuesInCluster(userId, clusterId);
      return APIData({
        code: 200,
        success: true,
        data: hasIssues,
      });
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while checking user issues in the cluster.",
      });
    }
  }

  async getResolutionsForIssue(issueId: number): Promise<APIResponse<Resolution[]>> {
    try {
      const resolutions = await this.issueRepository.getResolutionsForIssue(issueId);
      return APIData({
        code: 200,
        success: true,
        data: resolutions,
      });
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while fetching resolutions for the issue.",
      });
    }
  }

  async getUserIssueInCluster(user_id: string, clusterId: string) {
      const issue = await this.issueRepository.getUserIssueInCluster(user_id, clusterId);
      return issue;
  }

  async getUserResolutions(userId: string): Promise<Resolution[]> {
    return this.resolutionService.getUserResolutions(userId);
  }
  
  async deleteResolution(resolutionId: string, userId: string): Promise<void> {
    await this.resolutionService.deleteResolution(resolutionId, userId);
  }

  async getRelatedIssues(issueId: number, userId: string): Promise<APIResponse<Issue[]>> {
    try {
      const issue = await this.issueRepository.getIssueById(issueId);
      if (!issue.cluster_id) {
        return APIData({
          code: 200,
          success: true,
          data: [],
        });
      }
  
      const relatedIssues = await this.issueRepository.getIssuesInCluster(issue.cluster_id);
      const processedIssues = await Promise.all(relatedIssues
        .filter(relatedIssue => relatedIssue.issue_id !== issueId)
        .map(async (relatedIssue) => {
          // Use the existing getIssueById method to get full issue details
          const fullIssue = await this.issueRepository.getIssueById(relatedIssue.issue_id, userId);
          
          // Add any additional properties not included in getIssueById
          const processedIssue: Issue = {
            ...fullIssue,
            is_owner: fullIssue.user_id === userId,
          };
          
          return processedIssue;
        }));
  
      return APIData({
        code: 200,
        success: true,
        data: processedIssues,
      });
    } catch (error) {
      console.error("Error in getRelatedIssues:", error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while fetching related issues.",
      });
    }
  }
}
