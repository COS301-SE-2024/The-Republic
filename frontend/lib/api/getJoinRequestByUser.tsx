import { User, JoinRequest } from "@/lib/types";

export const getJoinRequestByUser = async (user: User, organizationId: string): Promise<JoinRequest | null> => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user.access_token}`,
  };

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/organizations/${organizationId}/join-requests/user`;
  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  if (response.ok) {
    const apiResponse = await response.json();
    return apiResponse.data;
  } else if (response.status === 404) {
    // No join request found
    return null;
  } else {
    const apiResponse = await response.json();
    throw new Error(apiResponse.error);
  }
};