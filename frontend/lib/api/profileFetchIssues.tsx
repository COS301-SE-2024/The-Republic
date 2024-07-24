import { UserAlt as User, Issue as IssueType } from "@/lib/types";

const profileFetchIssues = async (user: User | null, userId: string, url: string): Promise<IssueType[]> => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user?.access_token}`,
  };

  const requestBody = JSON.stringify({ profile_user_id: userId });

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: requestBody,
  });

  const apiResponse = await response.json();

  if (apiResponse.success && apiResponse.data) {
    return apiResponse.data;
  } else {
    throw new Error(apiResponse.error || 'Failed to fetch issue details');
  }
};

export { profileFetchIssues };