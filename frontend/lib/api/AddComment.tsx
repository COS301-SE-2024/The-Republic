import { UserAlt as User } from "@/lib/types";

const AddComment = async (
  user: User,
  issueId: number,
  content: string,
  isAnonymous: boolean,
  parentCommentId: number | null,
) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (user) {
    headers.Authorization = `Bearer ${user.access_token}`;
  }

  const requestBody = JSON.stringify({
    issue_id: issueId,
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
    throw new Error(apiResponse.error || "Request Failed");
  }
};

export { AddComment };
