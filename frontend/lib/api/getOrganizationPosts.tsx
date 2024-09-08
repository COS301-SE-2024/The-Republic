import { UserAlt as User, OrganizationPost } from "@/lib/types";

interface GetOrganizationPostsResponse {
  data: OrganizationPost[];
  total: number;
}

export const getOrganizationPosts = async (
  user: User,
  organizationId: string,
  offset: number = 0,
  limit: number = 10
): Promise<GetOrganizationPostsResponse> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/organizations/${organizationId}/posts?offset=${offset}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${user.access_token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch organization posts');
  }

  return await response.json();
};