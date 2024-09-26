export interface Cluster {
  cluster_id: string;
  category_id: number;
  suburb: string;
  created_at: string;
  last_modified: string;
  issue_count: number;
  centroid_embedding: number[] | string;
}
