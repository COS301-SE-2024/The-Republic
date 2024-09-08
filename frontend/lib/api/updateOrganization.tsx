import { UserAlt as User, Organization } from "@/lib/types";

const updateOrganization = async (
  user: User,
  organizationId: string,
  updates: FormData
): Promise<Organization> => {
  const headers: HeadersInit = {
    Authorization: `Bearer ${user.access_token}`,
  };

  updates.append('user_id', user.user_id);

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/organizations/${organizationId}`;
  const response = await fetch(url, {
    method: "PUT",
    headers,
    body: updates,
  });

  if (response.ok) {
    return await response.json();
  } else {
    const apiResponse = await response.json();
    throw new Error(apiResponse.error);
  }
};

export { updateOrganization };