import { User } from "@/modules/shared/models/issue";

export interface Comment {
  comment_id: number;
  user_id: string;
  issue_id: number;
  parent_id: number | null;
  content: string;
  created_at: string;
  is_anonymous: boolean;
  is_owner: boolean;
  post_id?: number;
  user: User;
}
