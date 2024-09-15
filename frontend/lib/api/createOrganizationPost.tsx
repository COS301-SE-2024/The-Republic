import { UserAlt as User, OrganizationPost } from "@/lib/types";

export const createOrganizationPost = async (
  user: User,
  organizationId: string,
  content: string,
  image?: File
): Promise<OrganizationPost> => {
  const formData = new FormData();
  formData.append('content', content);
  formData.append('organization_id', organizationId);
  formData.append('author_id', user.user_id);
  if (image) {
    formData.append('image', image);
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/organizations/${organizationId}/posts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${user.access_token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to create organization post');
  }

  return await response.json();
};