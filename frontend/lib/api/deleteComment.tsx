import { UserAlt as User } from "@/lib/types";

const deleteComment = async (
  user: User,
  commentId: string,
): Promise<void> => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user.access_token}`,
  };

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/comments/delete`;
  const response = await fetch(url, {
    method: "DELETE",
    headers,
    body: JSON.stringify({ comment_id: commentId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to delete comment");
  }
};

export { deleteComment };