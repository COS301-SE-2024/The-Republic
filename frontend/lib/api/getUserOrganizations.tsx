import { UserAlt as User, Organization } from "@/lib/types";

const getUserOrganizations = async (user: User): Promise<Organization[]> => {
  const headers: HeadersInit = {
    Authorization: `Bearer ${user.access_token}`,
    'Content-Type': 'application/json',
  };

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/organizations/user/organizations`;
  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  if (response.ok) {
    const apiResponse = await response.json();
    return apiResponse.data;
  } else {
    const apiResponse = await response.json();
    throw new Error(apiResponse.error);
  }
};

export { getUserOrganizations };