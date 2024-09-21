import { UserAlt as User, Organization } from "@/lib/types";

const updateOrganization = async (
  user: User,
  organizationId: string,
  updates: FormData,
  originalOrganization: Organization
): Promise<Organization> => {
  const headers: HeadersInit = {
    Authorization: `Bearer ${user.access_token}`,
  };

  const updatedFormData = new FormData();
  
  for (const [key, value] of Array.from(updates.entries())) {
    if (key === 'location') {
      const newLocation = JSON.parse(value as string);
      const oldLocation = originalOrganization.location;
      
      // Check if the location has actually changed
      if (JSON.stringify(newLocation) !== JSON.stringify(oldLocation)) {
        updatedFormData.append(key, JSON.stringify(newLocation));
      }
    } else if (key === 'profilePhoto') {
      // Always include the profile photo if it's present
      updatedFormData.append(key, value);
    } else if (originalOrganization[key as keyof Organization] !== value) {
      updatedFormData.append(key, value);
    }
  }

  updatedFormData.append('user_id', user.user_id);

  // Only proceed with the update if there are changes
  if (Array.from(updatedFormData.entries()).length > 1) { // > 1 because user_id is always appended
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/organizations/${organizationId}`;
    const response = await fetch(url, {
      method: "PUT",
      headers,
      body: updatedFormData,
    });

    if (response.ok) {
      return await response.json();
    } else {
      const apiResponse = await response.json();
      throw new Error(apiResponse.error);
    }
  } else {
    return originalOrganization;
  }
};

export { updateOrganization };