export interface User {
  user_id: string;
  email_address: string;
  username: string;
  fullname: string;
  image_url: string;
}

export interface Category {
  name: string;
}

export default interface Issue {
  issue_id: number;
  user_id: string;
  location_id: number | null;
  category_id: number;
  content: string;
  image_url: string | null;
  is_anonymous: boolean;
  created_at: string;
  resolved_at: string | null;
  sentiment: string;
  user: User;
  category: Category;
}
