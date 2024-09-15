import { User } from "@/lib/types";

const handleJoinRequest = async (
  user: User,
  organizationId: string,
  requestId: number,
  accept: boolean
): Promise<void> => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user.access_token}`,
  };

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/organizations/${organizationId}/join-requests/${requestId}`;
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ accept }),
  });

  if (!response.ok) {
    const apiResponse = await response.json();
    throw new Error(apiResponse.error);
  }
};

export { handleJoinRequest };