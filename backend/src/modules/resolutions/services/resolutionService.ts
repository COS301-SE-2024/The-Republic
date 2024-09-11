import { ResolutionRepository } from '../repositories/resolutionRepository';
import { Resolution } from '@/modules/shared/models/resolution';
import { APIError } from "@/types/response";
import { PointsService } from '@/modules/points/services/pointsService';
import { ClusterService } from '@/modules/clusters/services/clusterService';
import IssueRepository from '@/modules/issues/repositories/issueRepository';
import { ResolutionResponseRepository } from '../repositories/resolutionResponseRepository';
import { Issue } from '@/modules/shared/models/issue';

export class ResolutionService {
  private resolutionRepository: ResolutionRepository;
  private pointsService: PointsService;
  private clusterService: ClusterService;
  private issueRepository: IssueRepository;
  private ResolutionResponseRepository: ResolutionResponseRepository;

  constructor() {
    this.resolutionRepository = new ResolutionRepository();
    this.pointsService = new PointsService();
    this.clusterService = new ClusterService();
    this.issueRepository = new IssueRepository();
    this.ResolutionResponseRepository = new ResolutionResponseRepository();
  }

  async createResolution(resolution: Omit<Resolution, 'resolution_id' | 'created_at' | 'updated_at' | 'status' | 'num_cluster_members_accepted' | 'num_cluster_members_rejected'>): Promise<Resolution> {
    const isResolved = await this.issueRepository.isIssueResolved(resolution.issue_id);
    if (isResolved) {
      throw APIError({
        code: 400,
        success: false,
        error: "This issue has already been resolved.",
      });
    }

    const pendingResolution = await this.issueRepository.getPendingResolutionForIssue(resolution.issue_id);
    if (pendingResolution) {
      throw APIError({
        code: 400,
        success: false,
        error: "There is already a pending resolution for this issue.",
      });
    }

    const issue = await this.issueRepository.getIssueById(resolution.issue_id);
    const clusterId = issue.cluster_id;

    let status: 'pending' | 'accepted' | 'declined' = 'pending';
    if (resolution.resolution_source === 'self') {
      status = 'accepted';
      await this.issueRepository.updateIssueResolutionStatus(resolution.issue_id, true);
      await this.clusterService.moveAcceptedMembersToNewCluster(resolution.issue_id, [resolution.resolver_id]);
      await this.pointsService.awardPoints(resolution.resolver_id, 70, "self-resolution logged");
      
      // Award points to the organization if it's a self-resolution
      if (resolution.organization_id) {
        await this.pointsService.awardOrganizationPoints(resolution.organization_id, 2, "self-resolution logged");
      }
    }

    const clusterIssues = clusterId ? await this.issueRepository.getIssuesInCluster(clusterId) : [issue];
    const numClusterMembers = clusterIssues.length;

    const createdResolution = await this.resolutionRepository.createResolution({
      ...resolution,
      status,
      num_cluster_members: numClusterMembers,
      num_cluster_members_accepted: resolution.resolution_source === 'self' ? 1 : 0,
      num_cluster_members_rejected: 0,
    });

    // Create resolutions for other issues in the cluster
    if (clusterId) {
      for (const clusterIssue of clusterIssues) {
        if (clusterIssue.issue_id !== resolution.issue_id) {
          await this.resolutionRepository.createResolution({
            ...resolution,
            issue_id: clusterIssue.issue_id,
            status: 'pending',
            num_cluster_members: numClusterMembers,
            num_cluster_members_accepted: 0,
            num_cluster_members_rejected: 0,
          });
        }
      }
    }

    // Notify cluster members for both self and external resolutions
    await this.notifyClusterMembers(createdResolution, clusterIssues);

    return createdResolution;
  }

private async notifyClusterMembers(resolution: Resolution, clusterIssues: Issue[]): Promise<void> {
  // Implement logic to notify cluster members about the new resolution
  // For self-resolutions, inform them that the issue has been resolved but ask for their feedback
  // For external resolutions, ask for their acceptance or rejection
  // Only notify users who have issues in the cluster
  for (const issue of clusterIssues) {
    if (issue.user_id !== resolution.resolver_id) {
      // Implement notification logic here
    }
  }
}

async updateResolutionStatus(resolutionId: string, status: 'accepted' | 'declined', userId: string, satisfactionRating?: number): Promise<Resolution> {
  const resolution = await this.resolutionRepository.getResolutionById(resolutionId);
  
  if (resolution.status !== 'pending') {
    throw APIError({
      code: 400,
      success: false,
      error: "This resolution has already been processed.",
    });
  }

  const issue = await this.issueRepository.getIssueById(resolution.issue_id);
  if (issue.user_id !== userId) {
    throw APIError({
      code: 403,
      success: false,
      error: "You don't have permission to respond to this resolution.",
    });
  }

  await this.ResolutionResponseRepository.createResponse(resolutionId, userId, status, satisfactionRating);

  const updatedResolution = await this.resolutionRepository.updateResolution(resolutionId, {
    num_cluster_members_accepted: status === 'accepted' ? resolution.num_cluster_members_accepted + 1 : resolution.num_cluster_members_accepted,
    num_cluster_members_rejected: status === 'declined' ? resolution.num_cluster_members_rejected + 1 : resolution.num_cluster_members_rejected,
  });

  const totalResponses = updatedResolution.num_cluster_members_accepted + updatedResolution.num_cluster_members_rejected;
  
  // Only process the final decision if all members have responded
  if (totalResponses === updatedResolution.num_cluster_members) {
    if (updatedResolution.num_cluster_members_accepted > updatedResolution.num_cluster_members_rejected) {
      await this.finalizeResolution(updatedResolution);
    } else if (updatedResolution.num_cluster_members_accepted < updatedResolution.num_cluster_members_rejected) {
      await this.rejectResolution(updatedResolution);
    } else {
      // In case of a tie, accept external resolutions and reject self-resolutions
      if (updatedResolution.resolution_source !== 'self') {
        await this.finalizeResolution(updatedResolution);
      } else {
        await this.rejectResolution(updatedResolution);
      }
    }
  }

  return updatedResolution;
}

private async finalizeResolution(resolution: Resolution): Promise<void> {
  await this.resolutionRepository.updateResolution(resolution.resolution_id, { 
    status: 'accepted',
  });

  await this.issueRepository.updateIssueResolutionStatus(resolution.issue_id, true);

  if (resolution.resolution_source === 'self') {
    await this.pointsService.awardPoints(resolution.resolver_id, 50, "self-resolution accepted");
  } else {
    if (resolution.organization_id) {
      await this.pointsService.awardOrganizationPoints(resolution.organization_id, 75, "External resolution accepted for Organization member");
    }
    await this.pointsService.awardPoints(resolution.resolver_id, 100, "external resolution accepted");
  }

  // Award points to the organization
  

  await this.issueRepository.updateIssueResolutionStatus(resolution.issue_id, true);

  const acceptedUsers = await this.getAcceptedUsers(resolution.resolution_id);

  // Move cluster members who ACCEPTED to a NEW CLUSTER
  await this.clusterService.moveAcceptedMembersToNewCluster(resolution.issue_id, acceptedUsers);
}

  private async rejectResolution(resolution: Resolution): Promise<void> {
    await this.resolutionRepository.updateResolution(resolution.resolution_id, { 
      status: 'declined',
    });

    if (resolution.resolution_source !== 'self') {
      // Check if all members have responded or if a majority has rejected
      const totalResponses = resolution.num_cluster_members_accepted + resolution.num_cluster_members_rejected;
      const majority = Math.ceil(resolution.num_cluster_members / 2);

      if (totalResponses === resolution.num_cluster_members || resolution.num_cluster_members_rejected > majority) {
        await this.pointsService.penalizeUser(resolution.resolver_id, 50, "external resolution rejected");
      }
    }

    // Get the list of users who accepted the resolution
    const acceptedUsers = await this.getAcceptedUsers(resolution.resolution_id);

    // Move cluster members who ACCEPTED to a NEW CLUSTER
    await this.clusterService.moveAcceptedMembersToNewCluster(resolution.issue_id, acceptedUsers);
  }

  private async getAcceptedUsers(resolutionId: string): Promise<string[]> {
    const acceptedUsers = await this.ResolutionResponseRepository.getAcceptedUsers(resolutionId);
    return acceptedUsers.map(user => user.userId);
  }

  async getUserResolutions(userId: string): Promise<Resolution[]> {
    return this.resolutionRepository.getUserResolutions(userId);
  }

  async getOrganizationResolutions(organizationId: string): Promise<Resolution[]> {
    return this.resolutionRepository.getOrganizationResolutions(organizationId);
  }

  async getResolutionsByIssueId(issueId: number): Promise<Resolution[]> {
    try {
      return await this.resolutionRepository.getResolutionsByIssueId(issueId);
    } catch (error) {
      console.error(`Error fetching resolutions for issue ${issueId}:`, error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while fetching resolutions for the issue.",
      });
    }
  }
  
  async deleteResolution(resolutionId: string, userId: string): Promise<void> {
    await this.resolutionRepository.deleteResolution(resolutionId, userId);
  }
}