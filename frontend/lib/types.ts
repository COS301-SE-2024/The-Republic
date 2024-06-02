// Shared types

export interface User {
  user_id: string;
  email_address: string;
  username: string;
  fullname: string;
  image_url: string;
}
export interface Issue {
    issue_id: number;
    user_id: string;
    username: string;
    content: string;
    created_at: string;
    category: Category;
    sentiment: string;
    numberofcomments: number;
    user: User;
    resolved_at: string;
  }

export interface Category {
  id: number;
  name: string;
}
