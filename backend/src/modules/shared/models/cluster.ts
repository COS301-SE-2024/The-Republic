export interface Cluster {
    cluster_id: string;
    category_id: number;
    location_id: number;
    created_at: string;
    last_modified: string;
    issue_count: number;
    centroid_embedding: number[] | string;
  }