import supabase from "@/modules/shared/services/supabaseClient";
import { APIError } from "@/types/response";
import { Issue } from "@/modules/shared/models/issue";
import { Cluster } from '@/modules/shared/models/cluster';

export class ClusterRepository {
  async createCluster(issue: Issue): Promise<Cluster> {
    const { data, error } = await supabase
      .from('cluster')
      .insert({
        category_id: issue.category_id,
        location_id: issue.location_id,
        issue_count: 1,
        centroid_embedding: issue.content_embedding
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while creating a new cluster.",
      });
    }

    return data;
  }

  async updateCluster(clusterId: string, newCentroid: string, newIssueCount: number): Promise<void> {
    const { error } = await supabase
      .from('cluster')
      .update({ 
        centroid_embedding: newCentroid,
        issue_count: newIssueCount,
        last_modified: new Date().toISOString()
      })
      .eq('cluster_id', clusterId);
  
    if (error) {
      console.error('Error updating cluster:', error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while updating cluster.",
      });
    }
  }

  async findSimilarClusters(
    issue: Issue, 
    threshold: number = 0.8
  ): Promise<Cluster[]> {
    // console.log('Finding similar clusters for issue:', {
    //   issue_id: issue.issue_id,
    //   category_id: issue.category_id,
    //   location_id: issue.location_id,
    //   threshold
    // });
  
    const { data, error } = await supabase
      .rpc('find_similar_clusters', { 
        query_embedding: issue.content_embedding,
        similarity_threshold: threshold,
        category_id_param: issue.category_id,
        location_id_param: issue.location_id,
        current_time_param: new Date().toISOString()
      });
  
    if (error) {
      console.error('Error finding similar clusters:', error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while finding similar clusters.",
      });
    }
  
    // console.log('Similar clusters found:', data);
  
    return data;
  }

  async getClusters(params: {
    categoryId: number;
    locationId: number;
    fromDate?: Date;
    toDate?: Date;
  }): Promise<Cluster[]> {
    let query = supabase
      .from('cluster')
      .select('*')
      .eq('category_id', params.categoryId)
      .eq('location_id', params.locationId);

    if (params.fromDate) {
      query = query.gte('created_at', params.fromDate.toISOString());
    }
    if (params.toDate) {
      query = query.lte('created_at', params.toDate.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while fetching clusters.",
      });
    }

    return data;
  }

  async getClusterById(clusterId: string): Promise<Cluster> {
    const { data, error } = await supabase
      .from('cluster')
      .select('*')
      .eq('cluster_id', clusterId)
      .single();

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while fetching the cluster.",
      });
    }

    return data;
  }

  async deleteCluster(clusterId: string): Promise<void> {
    const { error } = await supabase
      .from('cluster')
      .delete()
      .eq('cluster_id', clusterId);

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while deleting the cluster.",
      });
    }
  }

  async getIssuesInCluster(clusterId: string): Promise<Issue[]> {
    const { data, error } = await supabase
      .from('issue')
      .select(`
        *,
        cluster:cluster_id (
          centroid_embedding
        )
      `)
      .eq('cluster_id', clusterId);
  
    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while fetching issues in the cluster.",
      });
    }
  
    return data;
  }
}