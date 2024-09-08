import { UserAlt as User } from "@/lib/types";

export const deleteOrganizationPost = async (
  user: User,
  organizationId: string,
  postId: string
): Promise<void> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/organizations/${organizationId}/posts/${postId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${user.access_token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete organization post');
  }
};