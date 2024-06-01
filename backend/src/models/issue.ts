export interface Issue {
  issue_id: number;
  user_id?: string | null;
  department_id: number;
  location_id?: number | null;
  category_id: number;
  content: string;
  image_url?: string;
  sentiment?: string;
  is_anonymous: boolean;
  created_at: string;
  resolved_at?: string | null;
}
