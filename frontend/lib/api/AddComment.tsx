import { UserAlt as User } from "@/lib/types";

const AddComment = async (
  user: User,
  itemId: string,
  itemType: 'issue' | 'post',
  content: string,
  isAnonymous: boolean,
  parentCommentId: string | null,
) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user.access_token}`,
  };

  const requestBody = JSON.stringify({
    [itemType === 'issue' ? 'issue_id' : 'post_id']: itemId,
    content,
    is_anonymous: isAnonymous,
    parent_id: parentCommentId,
  });

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/comments/add`;
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: requestBody,
  });

  const apiResponse = await response.json();

  if (apiResponse.success && apiResponse.data) {
    return apiResponse.data;
  } else {
    throw new Error(apiResponse.error || "Failed to add comment");
  }
};

export { AddComment };