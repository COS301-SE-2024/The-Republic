import { ResolutionRepository } from '../repositories/resolutionRepository';
import { Resolution } from '@/modules/shared/models/resolution';
import { APIError } from "@/types/response";
import { PointsService } from '@/modules/points/services/pointsService';
import { ClusterService } from '@/modules/clusters/services/clusterService';
import IssueRepository from '@/modules/issues/repositories/issueRepository';
import { ResolutionResponseRepository } from '../repositories/resolutionResponseRepository';

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

    const createdResolution = await this.resolutionRepository.createResolution({
      ...resolution,
      status: 'pending',
      num_cluster_members_accepted: 0,
      num_cluster_members_rejected: 0,
    });
    
    if (resolution.resolution_source === 'self') {
      await this.pointsService.awardPoints(resolution.resolver_id, 20, "Logged a self-resolution");
      await this.finalizeResolution(createdResolution);
    } else {
      // Notify cluster members (to be implemented)
      // they will be creating resolution responses
    }

    return createdResolution;
  }

  async updateResolutionStatus(resolutionId: string, status: 'accepted' | 'declined', userId: string): Promise<Resolution> {
    const resolution = await this.resolutionRepository.getResolutionById(resolutionId);
    
    if (resolution.status !== 'pending') {
      throw APIError({
        code: 400,
        success: false,
        error: "This resolution has already been processed.",
      });
    }

    await this.ResolutionResponseRepository.createResponse(resolutionId, userId, status);

    const updatedResolution = await this.resolutionRepository.updateResolution(resolutionId, {
      status: status === 'accepted' ? 'accepted' : 'declined',
      num_cluster_members_accepted: status === 'accepted' ? resolution.num_cluster_members_accepted + 1 : resolution.num_cluster_members_accepted,
      num_cluster_members_rejected: status === 'declined' ? resolution.num_cluster_members_rejected + 1 : resolution.num_cluster_members_rejected,
    });

    const majority = Math.ceil(updatedResolution.num_cluster_members / 2);

    if (updatedResolution.num_cluster_members_accepted > majority) {
      await this.finalizeResolution(updatedResolution);
    } else if (updatedResolution.num_cluster_members_rejected >= majority) {
      await this.rejectResolution(updatedResolution);
    }

    return updatedResolution;
  }

  private async finalizeResolution(resolution: Resolution): Promise<void> {
    await this.resolutionRepository.updateResolution(resolution.resolution_id, { 
      status: 'accepted',
    });

    await this.issueRepository.updateIssueResolutionStatus(resolution.issue_id, true);

    if (resolution.resolution_source === 'self') {
      await this.pointsService.awardPoints(resolution.resolver_id, 50, "Self-resolution accepted");
    } else {
      await this.pointsService.awardPoints(resolution.resolver_id, 100, "External resolution accepted");
    }

    const acceptedUsers = await this.getAcceptedUsers(resolution.resolution_id);

    // Move cluster members who ACCEPTED to a NEW CLUSTER
    await this.clusterService.moveAcceptedMembersToNewCluster(resolution.issue_id, acceptedUsers);
  }

  private async rejectResolution(resolution: Resolution): Promise<void> {
    await this.resolutionRepository.updateResolution(resolution.resolution_id, { 
      status: 'declined',
    });

    await this.pointsService.penalizeUser(resolution.resolver_id, 50, "Resolution rejected");

    // Get the list of users who accepted the resolution
    const acceptedUsers = await this.getAcceptedUsers(resolution.resolution_id);

    // Move cluster members who ACCEPTED to a NEW CLUSTER
    await this.clusterService.moveAcceptedMembersToNewCluster(resolution.issue_id, acceptedUsers);
  }

  private async getAcceptedUsers(resolutionId: string): Promise<string[]> {
    return this.ResolutionResponseRepository.getAcceptedUsers(resolutionId);
  }
}