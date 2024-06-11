export interface Comment {
  comment_id: number;
  user_id: string;
  issue_id: number;
  content: string;
  created_at: string;
  is_anonymous: boolean;
}
