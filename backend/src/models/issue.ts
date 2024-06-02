interface Issue {
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

export const issue: Issue = {
  issue_id: 0,
  department_id: 0,
  category_id: 0,
  content: "",
  is_anonymous: false,
  created_at: "",
};

export default Issue;
