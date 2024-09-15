export interface Reaction {
  reaction_id: number;
  issue_id?: number;
  post_id?: string;
  user_id: string;
  emoji: string;
  created_at: string;
}