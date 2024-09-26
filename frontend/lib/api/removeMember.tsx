import { UserAlt as User } from "@/lib/types";

const removeMember = async (
  user: User,
  organizationId: string,
  memberId: string
): Promise<void> => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user.access_token}`,
  };

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/organizations/${organizationId}/members/${memberId}`;
  const response = await fetch(url, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    const apiResponse = await response.json();
    throw new Error(apiResponse.error);
  }
};

export { removeMember };