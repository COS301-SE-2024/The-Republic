import supabase from "@/modules/shared/services/supabaseClient";
import { APIError } from "@/types/response";
import { Issue } from "@/modules/shared/models/issue";
import { Cluster } from '@/modules/shared/models/cluster';

export class ClusterRepository {
  async createCluster(issue: Issue): Promise<Cluster> {
    const { data: locationData, error: locationError } = await supabase
      .from('location')
      .select('suburb')
      .eq('location_id', issue.location_id)
      .single();
  
    if (locationError) {
      console.error('Error fetching location:', locationError);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while fetching location data.",
      });
    }
  
    const { data, error } = await supabase
      .from('cluster')
      .insert({
        category_id: issue.category_id,
        suburb: locationData.suburb,
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
    threshold: number = 0.7
  ): Promise<Cluster[]> {
    // console.log('Finding similar clusters for issue:', {
    //   issue_id: issue.issue_id,
    //   category_id: issue.category_id,
    //   location_id: issue.location_id,
    //   threshold
    // });

    const { data: locationData, error: locationError } = await supabase
    .from('location')
    .select('suburb')
    .eq('location_id', issue.location_id)
    .single();

  if (locationError) {
    console.error('Error fetching location:', locationError);
    throw APIError({
      code: 500,
      success: false,
      error: "An unexpected error occurred while fetching location data.",
    });
  }
  
    const { data, error } = await supabase
      .rpc('find_similar_clusters', { 
        query_embedding: issue.content_embedding,
        similarity_threshold: threshold,
        category_id_param: issue.category_id,
        suburb_param: locationData.suburb,
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

  async findSimilarClustersForIssues(
    issues: Issue[],
    threshold: number = 0.8
  ): Promise<Cluster[]> {
    if (issues.length === 0) {
      return [];
    }
  
    const categoryId = issues[0].category_id;
    const suburb = issues[0].location?.suburb || issues[0].location_data?.suburb;

    if (!suburb) {
      console.error('No suburb information found for the issue');
      throw APIError({
        code: 400,
        success: false,
        error: "Suburb information is missing for the issue.",
      });
    }
  
    const embeddings = issues.map(issue => issue.content_embedding);
    const averageEmbedding = this.calculateAverageEmbedding(embeddings);
  
    const { data, error } = await supabase
      .rpc('find_similar_clusters', {
        query_embedding: averageEmbedding,
        similarity_threshold: threshold,
        category_id_param: categoryId,
        suburb_param: suburb,
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
  
    return data;
  }
  
  private calculateAverageEmbedding(embeddings: (number[] | string | null | undefined)[]): number[] {
    let sumEmbedding: number[] = [];
    let validEmbeddingsCount = 0;
  
    for (const embedding of embeddings) {
      let embeddingArray: number[] = [];
      
      if (typeof embedding === 'string') {
        try {
          embeddingArray = JSON.parse(embedding);
        } catch (error) {
          console.error(`Error parsing embedding:`, error);
          continue;
        }
      } else if (Array.isArray(embedding)) {
        embeddingArray = embedding;
      } else {
        console.error(`Invalid embedding type:`, typeof embedding);
        continue;
      }
  
      if (embeddingArray.length > 0) {
        if (sumEmbedding.length === 0) {
          sumEmbedding = new Array(embeddingArray.length).fill(0);
        }
        for (let i = 0; i < embeddingArray.length; i++) {
          sumEmbedding[i] += embeddingArray[i];
        }
        validEmbeddingsCount++;
      }
    }
  
    return sumEmbedding.map(val => val / validEmbeddingsCount);
  }

  async getClusters(params: {
    categoryId: number;
    suburb: string;
    fromDate?: Date;
    toDate?: Date;
  }): Promise<Cluster[]> {
    let query = supabase
      .from('cluster')
      .select('*')
      .eq('category_id', params.categoryId)
      .eq('suburb', params.suburb);

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

  async updateIssueCluster(issueId: number, newClusterId: string): Promise<void> {
    const { error } = await supabase
      .from('issue')
      .update({ cluster_id: newClusterId })
      .eq('issue_id', issueId);

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while updating the issue's cluster.",
      });
    }
  }

  async getClusterSize(clusterId: string): Promise<number> {
    const { count, error } = await supabase
      .from('issue')
      .select('issue_id', { count: 'exact' })
      .eq('cluster_id', clusterId);

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while getting the cluster size.",
      });
    }

    return count || 0;
  }
}