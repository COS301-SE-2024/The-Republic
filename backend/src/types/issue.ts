export interface GetIssuesParams {
  from: number;
  amount: number;
  order_by: string;
  ascending: boolean;
  category?: string;
  mood?: string;
  user_id?: string;
  location: {
    province?: string;
    city?: string;
    suburb?: string;
    district?: string;
    place_id?: string;
  }
  location_id?: number;
}
