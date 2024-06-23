export interface GetIssuesParams {
  from: number;
  amount: number;
  order_by: string;
  ascending: boolean;
  category?: string;
  mood?: string;
  user_id?: string
}
