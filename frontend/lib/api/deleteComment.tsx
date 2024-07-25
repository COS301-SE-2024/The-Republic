import { UserAlt as User } from "@/lib/types";

const deleteComment = async (
  user: User,
  commentToDelete: string | null,
): Promise<void> => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (user) {
    headers.Authorization = `Bearer ${user.access_token}`;
  }

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/comments/delete`;
  const response = await fetch(url, {
    method: "DELETE",
    headers,
    body: JSON.stringify({ comment_id: commentToDelete }),
  });

  if (response.status === 204) {
    return;
  }

  const apiResponse = await response.json();

  if (apiResponse.ok) {
    return apiResponse;
  } else {
    throw new Error(apiResponse.error || "Failed to delete comment");
  }
};

export { deleteComment };
