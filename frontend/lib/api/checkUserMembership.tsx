import { UserAlt as User } from "@/lib/types";

export const checkUserMembership = async (
  user: User,
  organizationId: string
): Promise<boolean> => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user.access_token}`,
  };

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/organizations/${organizationId}/members/${user.user_id}`;
  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  const apiResponse = await response.json();

  if (apiResponse.success && apiResponse.data) {
    return apiResponse.data.isMember;
  } else {
    throw new Error(apiResponse.error || "Failed to check user membership");
  }
};