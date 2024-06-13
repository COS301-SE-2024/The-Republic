import { User } from "./issue";

export interface Comment {
  comment_id: number;
  user_id: string;
  issue_id: number;
  parent_id: number | null;
  content: string;
  created_at: string;
  is_anonymous: boolean;
  user: User;
}
