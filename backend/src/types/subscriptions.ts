export interface SubsParams {
  user_id: string;
  issue_id?: string;
  category_id?: string;
  location_id?: string;
}

export interface NotificationData {
  categories: string[];
  locations: string[];
  issues: string[];
}

export interface Notification {
  type: string;
  content: string;
  issue_id?: string;
  category?: string;
  location?: string;
  created_at: string;
}
