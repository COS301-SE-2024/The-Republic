import { UserAlt as User, Organization } from "@/lib/types";

const getOrganizationById = async (
  user: User,
  organizationId: string
): Promise<Organization> => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user.access_token}`,
  };

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/organizations/${organizationId}`;
  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  if (response.ok) {
    const result = await response.json();
    return result.data;
  } else {
    const apiResponse = await response.json();
    throw new Error(apiResponse.error);
  }
};

export { getOrganizationById };
