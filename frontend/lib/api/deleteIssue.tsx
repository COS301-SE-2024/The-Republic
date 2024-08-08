import { UserAlt as User } from "@/lib/types";

const deleteIssue = async (
  user: User,
  issueId: number | null,
): Promise<void> => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user.access_token}`,
  };

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues`;
  const response = await fetch(url, {
    method: "DELETE",
    headers,
    body: JSON.stringify({ issue_id: issueId }),
  });

  if (response.status === 204) {
    return;
  } else {
    const apiResponse = await response.json();
    throw new Error(apiResponse.error);
  }
};

export { deleteIssue };
