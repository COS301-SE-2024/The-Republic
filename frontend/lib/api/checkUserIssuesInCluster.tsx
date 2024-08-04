import { User } from "@/lib/types";

const checkUserIssuesInCluster = async (user: User, clusterId: string) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (user) {
    headers.Authorization = `Bearer ${user.access_token}`;
  }

  const requestBody = {
    userId: user.user_id,
    clusterId,
  };

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues/user-issues-in-cluster`;
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(requestBody),
  });

  const apiResponse = await response.json();

  if (apiResponse.success && apiResponse.data !== undefined) {
    return apiResponse.data as boolean;
  } else {
    throw new Error(apiResponse.error || "Error checking user issues in cluster");
  }
};

export { checkUserIssuesInCluster };