import { UserAlt as User, Comment as CommentType } from "@/lib/types";

const fetchMoreComments = async (
  user: User,
  from: number,
  amount: number,
  itemId: string,
  itemType: 'issue' | 'post',
  parentCommentId?: string | null
): Promise<CommentType[]> => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user.access_token}`,
  };

  const requestBody = JSON.stringify({
    itemId,
    itemType,
    from,
    amount,
    parent_id: parentCommentId,
  });

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/comments`;
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: requestBody,
  });

  const apiResponse = await response.json();

  if (apiResponse.success && apiResponse.data) {
    return apiResponse.data;
  } else {
    throw new Error(apiResponse.error || "Failed to fetch comments");
  }
};

export { fetchMoreComments };