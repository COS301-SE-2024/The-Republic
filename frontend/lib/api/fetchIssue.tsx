import { UserAlt as User, RequestBody, Issue as IssueType } from "@/lib/types";

async function fetchIssueDetails(issueId: string): Promise<IssueType | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues/${issueId}`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch issue details");
    }
    const issue = await response.json();
    return issue;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default fetchIssueDetails;

export const fetchIssues = async (user: User | null, sortBy: string, filter: string): Promise<IssueType[]> => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (user) {
    headers.Authorization = `Bearer ${user.access_token}`;
  }

  const requestBody: RequestBody = {
    from: 0,
    amount: 99,
    order_by:
      sortBy === "newest"
        ? "created_at"
        : sortBy === "oldest"
          ? "created_at"
          : "comment_count",
    ascending: sortBy === "oldest",
  };

  if (filter !== "All") {
    requestBody.category = filter;
  }

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues`;
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(requestBody),
  });

  const apiResponse = await response.json();

  if (apiResponse.success && apiResponse.data) {
    return apiResponse.data;
  } else {
    throw new Error(apiResponse.error);
  }
};

export const addIssue = async (newIssue: IssueType, user: User | null) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (user) {
    headers.Authorization = `Bearer ${user.access_token}`;
  }

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues`;
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(newIssue),
  });

  const apiResponse = await response.json();

  if (apiResponse.success && apiResponse.data) {
    return apiResponse.data;
  } else {
    throw new Error(apiResponse.error);
  }
};

export const removeIssue = async (issueId: string, user: User | null) => {
  const headers: HeadersInit = {
    Authorization: `Bearer ${user?.access_token}`,
  };

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues/${issueId}`;
  const response = await fetch(url, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    throw new Error("Error removing issue");
  }

  return { issueId };
};
