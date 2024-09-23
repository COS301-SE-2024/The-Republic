import { User } from "@/lib/types";

const deleteJoinRequest = async (
  user: User,
  requestId: number
): Promise<void> => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user.access_token}`,
  };

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/organizations/join-requests/${requestId}`;
  const response = await fetch(url, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    const apiResponse = await response.json();
    throw new Error(apiResponse.error);
  }
};

export { deleteJoinRequest };