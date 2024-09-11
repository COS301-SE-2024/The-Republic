import { UserAlt as User, Organization } from "@/lib/types";

const createOrganization = async (
  user: User,
  formData: FormData
): Promise<Organization> => {
  const headers: HeadersInit = {
    Authorization: `Bearer ${user.access_token}`,
    'Content-Type': 'application/json',
  };

  const organizationData = {
    name: formData.get('name'),
    username: formData.get('username'),
    join_policy: formData.get('join_policy'),
    bio: formData.get('bio'),
    website_url: formData.get('website_url'),
    org_type: formData.get('org_type'),
  };

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/organizations/create`;
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(organizationData),
  });

  if (response.ok) {
    const data = await response.json();
    return data.organization as Organization;
  } else {
    const apiResponse = await response.json();
    throw new Error(apiResponse.error);
  }
};

export { createOrganization };
