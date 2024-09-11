import { UserAlt as User, OrganizationPost } from "@/lib/types";

export const fetchOrganizationPost = async (
  user: User,
  organizationId: string,
  postId: string
): Promise<OrganizationPost> => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user.access_token}`,
  };

  const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/organizations/${organizationId}/posts/${postId}`);
  url.searchParams.append('user_id', user.user_id);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers,
  });

  const apiResponse = await response.json();

  if (apiResponse.success && apiResponse.data) {
    return apiResponse.data;
  } else {
    throw new Error(apiResponse.error || "Failed to fetch organization post");
  }
};