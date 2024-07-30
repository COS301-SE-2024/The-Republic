interface User {
  user_id: string | null;
  email_address: string | null;
  username: string;
  fullname: string;
  image_url: string | null;
  is_owner: boolean | null;
  total_issues: number | null;
  resolved_issues: number | null;
  user_score: number;
  location_id: number | null;
  location: {
    location_id: number;
    province: string;
    city: string;
    suburb: string;
    district: string;
  } | null;
}

interface DatabaseUser {
  user_id: string | null;
  username: string;
  fullname: string;
  email_address: string | null;
  image_url: string | null;
  user_score: number;
  location?: {
    location_id: number;
    province: string;
    city: string;
    suburb: string;
    district: string;
  } | null;
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

export { User, Category, ReactionCount, Issue, DatabaseUser };
