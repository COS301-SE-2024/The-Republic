import { UserAlt as User, Organization } from "@/lib/types";

interface SearchOrganizationsResponse {
  data: Organization[];
  total: number;
}

interface SearchOrganizationsParams {
  orgType?: string | null;
  locationId?: string | null;
  offset?: number;
  limit?: number;
}

export const searchOrganizations = async (
  user: User,
  searchTerm: string,
  params: SearchOrganizationsParams = {}
): Promise<SearchOrganizationsResponse> => {
  const queryParams = new URLSearchParams({
    searchTerm,
    offset: (params.offset || 0).toString(),
    limit: (params.limit || 10).toString(),
  });

  if (params.orgType) queryParams.append('orgType', params.orgType);
  if (params.locationId) queryParams.append('locationId', params.locationId);

  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/organizations/search?${queryParams}`, {
    headers: {
      Authorization: `Bearer ${user.access_token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Search organizations error:", errorData);
    throw new Error(errorData.error || 'Failed to search organizations');
  }

  const result = await response.json();

  return result.data as SearchOrganizationsResponse;
};