import { User, Resolution } from "@/lib/types";

const fetchResolutionsForIssue = async (user: User, issueId: number) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (user) {
    headers.Authorization = `Bearer ${user.access_token}`;
  }

  const requestBody = {
    issueId,
  };

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues/resolutions`;
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(requestBody),
  });

  const apiResponse = await response.json();

  if (apiResponse.success && apiResponse.data) {
    return apiResponse.data as Resolution[];
  } else {
    throw new Error(apiResponse.error || "Error fetching resolutions for issue");
  }
};

export { fetchResolutionsForIssue };