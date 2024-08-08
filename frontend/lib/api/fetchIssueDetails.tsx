import { UserAlt as User, Issue as IssueType } from "@/lib/types";

const fetchIssueDetails = async (
  user: User | null,
  issueId: number,
): Promise<IssueType> => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (user) {
    headers.Authorization = `Bearer ${user.access_token}`;
  }

  const requestBody = JSON.stringify({ issue_id: issueId });

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues/single`;
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: requestBody,
  });

  const apiResponse = await response.json();

  if (apiResponse.success && apiResponse.data) {
    return apiResponse.data;
  } else {
    throw new Error(apiResponse.error || "Failed to fetch issue details");
  }
};

export { fetchIssueDetails };
