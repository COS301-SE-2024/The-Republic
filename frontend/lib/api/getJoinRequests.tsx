import { User, UserAlt } from "@/lib/types";

interface JoinRequest {
  id: number;
  organization_id: string;
  user_id: string;
  status: string;
  created_at: string;
  user: UserAlt;
}

const getJoinRequests = async (
  user: User,
  organizationId: string
): Promise<JoinRequest[]> => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user.access_token}`,
  };

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/organizations/${organizationId}/join-requests`;
  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  if (response.ok) {
    const apiResponse = await response.json();
    return apiResponse.data.data;
  } else {
    const apiResponse = await response.json();
    throw new Error(apiResponse.error);
  }
};

export { getJoinRequests };