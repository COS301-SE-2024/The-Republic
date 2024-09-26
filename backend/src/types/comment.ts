export interface GetCommentsParams {
  itemId: string;
  itemType: "issue" | "post";
  user_id: string;
  from: number;
  amount: number;
  parent_id?: number;
}
