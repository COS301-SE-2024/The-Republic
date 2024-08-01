import { ClusterRepository } from '../repositories/clusterRepository';
import IssueRepository from '@/modules/issues/repositories/issueRepository';
import { OpenAIService } from '@/modules/shared/services/openAIService';
import { APIError } from "@/types/response";
import { Cluster } from '@/modules/shared/models/cluster';
import { Issue } from '@/modules/shared/models/issue';

export class ClusterService {
  private clusterRepository: ClusterRepository;
  private issueRepository: IssueRepository;
  private openAIService: OpenAIService;

  constructor() {
    this.clusterRepository = new ClusterRepository();
    this.issueRepository = new IssueRepository();
    this.openAIService = new OpenAIService();
  }

  async getClusters(params: {
    categoryId: number;
    locationId: number;
    fromDate?: Date;
    toDate?: Date;
  }): Promise<Cluster[]> {
    return this.clusterRepository.getClusters(params);
  }

  async getClusterById(clusterId: string): Promise<Cluster> {
    const cluster = await this.clusterRepository.getClusterById(clusterId);
    if (!cluster) {
      throw APIError({
        code: 404,
        success: false,
        error: "Cluster not found",
      });
    }
    return cluster;
  }

  async assignClusterToIssue(issueId: number): Promise<string> {
    const issue = await this.issueRepository.getIssueById(issueId);
    if (!issue) {
      throw APIError({
        code: 404,
        success: false,
        error: "Issue not found",
      });
    }
  
    if (!issue.content_embedding) {
      issue.content_embedding = await this.openAIService.getEmbedding(issue.content);
      await this.issueRepository.updateIssueEmbedding(issueId, issue.content_embedding);
    }
  
    const similarClusters = await this.clusterRepository.findSimilarClusters(issue, 0.9);
  
    if (similarClusters.length > 0) {
      const mostSimilarCluster = similarClusters[0];
      const newEmbedding = Array.isArray(issue.content_embedding) ? issue.content_embedding : JSON.parse(issue.content_embedding);
      await this.updateCluster(mostSimilarCluster.cluster_id, newEmbedding);
      await this.issueRepository.updateIssueCluster(issueId, mostSimilarCluster.cluster_id);
      return mostSimilarCluster.cluster_id;
    } else {
      const newCluster = await this.clusterRepository.createCluster(issue);
      await this.issueRepository.updateIssueCluster(issueId, newCluster.cluster_id);
      return newCluster.cluster_id;
    }
  }

  private async updateCluster(clusterId: string, newEmbedding: number[]): Promise<void> {
    const cluster = await this.clusterRepository.getClusterById(clusterId);
    if (!cluster) {
      throw APIError({
        code: 404,
        success: false,
        error: "Cluster not found",
      });
    }
  
    // console.log('Cluster data:', cluster);
    // console.log('Centroid embedding type:', typeof cluster.centroid_embedding);
  
    let centroidEmbedding: number[];
    if (typeof cluster.centroid_embedding === 'string') {
      try {
        centroidEmbedding = JSON.parse(cluster.centroid_embedding);
      } catch (error) {
        console.error('Error parsing centroid_embedding:', error);
        throw APIError({
          code: 500,
          success: false,
          error: "Invalid centroid_embedding format",
        });
      }
    } else if (Array.isArray(cluster.centroid_embedding)) {
      centroidEmbedding = cluster.centroid_embedding;
    } else {
      console.error('Unexpected centroid_embedding type:', typeof cluster.centroid_embedding);
      throw APIError({
        code: 500,
        success: false,
        error: "Invalid centroid_embedding format",
      });
    }
  
    const newIssueCount = cluster.issue_count + 1;
    const newCentroid = centroidEmbedding.map((val: number, i: number) => 
      (val * cluster.issue_count + newEmbedding[i]) / newIssueCount
    );
  
    await this.clusterRepository.updateCluster(clusterId, JSON.stringify(newCentroid), newIssueCount);
  }

  async removeIssueFromCluster(issueId: number, clusterId: string): Promise<void> {
    try {
      const cluster = await this.clusterRepository.getClusterById(clusterId);
      if (!cluster) {
        throw APIError({
          code: 404,
          success: false,
          error: "Cluster not found",
        });
      }
  
      //console.log('Cluster:', cluster);
  
      if (cluster.issue_count <= 1) {
        await this.clusterRepository.deleteCluster(clusterId);
      } else {
        const updatedIssueCount = cluster.issue_count - 1;
        const issues = await this.clusterRepository.getIssuesInCluster(clusterId);
        //console.log('Issues in cluster:', issues);
        const updatedCentroid = this.recalculateCentroid(issues, issueId);
        const formattedCentroid = this.formatCentroidForDatabase(updatedCentroid);
        
        await this.clusterRepository.updateCluster(clusterId, formattedCentroid, updatedIssueCount);
      }
    } catch (error) {
      console.error('Error in removeIssueFromCluster:', error);
      throw APIError({
        code: 500,
        success: false,
        error: `An error occurred while removing issue from cluster: ${error}`,
      });
    }
  }

  private recalculateCentroid(issues: Issue[], excludeIssueId: number): number[] {
    const relevantIssues = issues.filter(issue => issue.issue_id !== excludeIssueId);
    if (relevantIssues.length === 0) {
      throw new Error("No issues left in cluster after exclusion");
    }
    
    //console.log('Relevant issues:', relevantIssues);
  
    let embeddingLength = 0;
    let sumEmbedding: number[] = [];
    let validEmbeddingsCount = 0;
  
    for (const issue of relevantIssues) {
      let embeddingArray: number[] = [];
      
      if (typeof issue.content_embedding === 'string') {
        try {
          embeddingArray = JSON.parse(issue.content_embedding);
        } catch (error) {
          console.error(`Error parsing embedding for issue ${issue.issue_id}:`, error);
          continue;
        }
      } else if (Array.isArray(issue.content_embedding)) {
        embeddingArray = issue.content_embedding;
      } else {
        console.error(`Invalid embedding type for issue ${issue.issue_id}:`, typeof issue.content_embedding);
        continue;
      }
  
      if (embeddingArray.length > 0) {
        if (embeddingLength === 0) {
          embeddingLength = embeddingArray.length;
          sumEmbedding = new Array(embeddingLength).fill(0);
        }
        if (embeddingArray.length === embeddingLength) {
          for (let i = 0; i < embeddingLength; i++) {
            const value = embeddingArray[i];
            if (typeof value === 'number' && !isNaN(value) && isFinite(value)) {
              sumEmbedding[i] += value;
            }
          }
          validEmbeddingsCount++;
        }
      }
    }
  
    if (validEmbeddingsCount === 0) {
      console.error('No valid embeddings found in cluster');
      return this.getDefaultEmbedding(relevantIssues);
    }
  
    return sumEmbedding.map(val => val / validEmbeddingsCount);
  }
  
  private getDefaultEmbedding(issues: Issue[]): number[] {
    for (const issue of issues) {
      if (issue.cluster && typeof issue.cluster.centroid_embedding === 'string') {
        try {
          return JSON.parse(issue.cluster.centroid_embedding);
        } catch (error) {
          console.error('Error parsing cluster centroid:', error);
        }
      }
    }
    
    const embeddingLength = 1536;
    return new Array(embeddingLength).fill(0);
  }

  private formatCentroidForDatabase(centroid: number[]): string {
    return `[${centroid.map(val => {
      if (isNaN(val) || !isFinite(val)) {
        return '0';
      }
      return val.toFixed(6);
    }).join(',')}]`;
  }
}