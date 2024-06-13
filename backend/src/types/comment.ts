export interface GetCommentsParams {
  issue_id: number;
  parent_id: number | null;
  from: number;
  amount: number;
}

export interface GetNumCommentsParams {
  issue_id: number;
  parent_id: number | null;
}
