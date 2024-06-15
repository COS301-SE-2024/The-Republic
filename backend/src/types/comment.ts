export interface GetCommentsParams {
  issue_id: number;
  parent_id?: number;
  user_id?: string;
  from: number;
  amount: number;
}
