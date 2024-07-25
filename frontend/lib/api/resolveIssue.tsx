import { Issue, UserAlt as User } from "@/lib/types";

const resolveIssue = async (
  user: User,
  issueId: number | null,
): Promise<Issue> => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user.access_token}`,
  };

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues/resolve/`;
  const response = await fetch(url, {
    method: "PUT",
    headers,
    body: JSON.stringify({ issue_id: issueId }),
  });

  const apiResponse = await response.json();

  if (apiResponse.success) {
    return apiResponse.data;
  } else {
    throw new Error(apiResponse.error);
  }
};

export { resolveIssue };
