export interface Resolution {
  resolution_id: string;
  issue_id: number;
  resolver_id: string;
  resolution_text: string;
  proof_image: string | null;
  status: "pending" | "accepted" | "declined";
  created_at: string;
  updated_at: string;
  num_cluster_members: number;
  num_cluster_members_accepted: number;
  num_cluster_members_rejected: number;
  political_association: string | null;
  state_entity_association: string | null;
  resolution_source: "self" | "unknown" | "other";
  resolved_by: string | null;
  organization_id?: string | null;
}
