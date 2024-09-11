import { UserAlt as User } from "@/lib/types";

export const getTopOrganizationMembers = async (
  user: User,
  organizationId: string
): Promise<User[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/organizations/${organizationId}/top-members`, {
    headers: {
        Authorization: `Bearer ${user.access_token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch top organization members');
  }

  return await response.json();
};