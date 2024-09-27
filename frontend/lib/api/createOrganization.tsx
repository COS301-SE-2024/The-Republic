import { UserAlt as User, Organization } from "@/lib/types";

const createOrganization = async (
  user: User,
  formData: FormData
): Promise<Organization> => {
  const headers: HeadersInit = {
    Authorization: `Bearer ${user.access_token}`,
  };
  
  formData.append('user_id', user.user_id);

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/organizations/create`;
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: formData,
  });

  const apiResponse = await response.json();

  if (apiResponse.success) {
    return apiResponse.data;
  } else {
    throw new Error(apiResponse.error);
  }
};

export { createOrganization };
