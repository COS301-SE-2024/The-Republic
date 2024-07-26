interface User {
  user_id: string | null;
  email_address: string | null;
  username: string;
  fullname: string;
  image_url: string | null;
  is_owner: boolean | null;
  total_issues: number | null;
  resolved_issues: number | null;
}

interface Category {
  name: string;
}

interface ReactionCount {
  emoji: string;
  count: number;
}

interface Issue {
  issue_id: number;
  user_id: string;
  category_id: number;
  content: string;
  sentiment: string;
  image_url: string | null;
  is_anonymous: boolean;
  location_id: number | null;
  location_data: {
    province: string;
    city: string;
    suburb: string;
    district: string;
    place_id: string;
  } | null;
  location?: {
    province: string;
    city: string;
    suburb: string;
    district: string;
    place_id: string;
  } | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  user: User;
  category: Category;
  reactions: ReactionCount[];
  user_reaction: string | null;
  comment_count: number;
  is_owner: boolean;
  profile_user_id: string;
}

export { User, Category, ReactionCount, Issue };
