import { UserAlt as User } from "@/lib/types";

const leaveOrganization = async (
  user: User,
  organizationId: string
): Promise<void> => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user.access_token}`,
  };

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/organizations/${organizationId}/leave`;
  const response = await fetch(url, {
    method: "POST",
    headers,
  });

  if (!response.ok) {
    const apiResponse = await response.json();
    throw new Error(apiResponse.error);
  }
};

export { leaveOrganization };