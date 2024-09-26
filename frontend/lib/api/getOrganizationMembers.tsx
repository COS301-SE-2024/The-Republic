import { UserAlt as User } from "@/lib/types";

interface OrganizationMember {
  id: number;
  organization_id: string;
  user_id: string;
  role: string;
  joined_at: string;
  user: User;
}

interface OrganizationMembersResponse {
  data: OrganizationMember[];
  total: number;
}

const getOrganizationMembers = async (
  user: User,
  organizationId: string
): Promise<OrganizationMembersResponse> => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user.access_token}`,
  };

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/organizations/${organizationId}/members`;
  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  if (response.ok) {
    const apiResponse = await response.json();
    return {
      data: apiResponse.data.data.map((member: OrganizationMember) => ({
        ...member,
        user: {
          ...member.user,
          isAdmin: member.role === 'admin'
        }
      })),
      total: apiResponse.data.total
    };
  } else {
    const apiResponse = await response.json();
    throw new Error(apiResponse.error);
  }
};

export { getOrganizationMembers };