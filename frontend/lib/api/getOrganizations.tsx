import { UserAlt as User, Organization } from "@/lib/types";

interface OrganizationsResponse {
  data: Organization[];
  total: number;
}

interface GetOrganizationsParams {
  orgType?: string | null;
  locationId?: string | null;
  offset?: number;
  limit?: number;
}

export const getOrganizations = async (user: User, params: GetOrganizationsParams = {}): Promise<OrganizationsResponse> => {
  const queryParams = new URLSearchParams();

  if (params.orgType) queryParams.append('orgType', params.orgType);
  if (params.locationId) queryParams.append('locationId', params.locationId);
  if (params.offset) queryParams.append('offset', params.offset.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/organizations${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${user.access_token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch organizations');
  }

  const result = await response.json();
  return result.data as OrganizationsResponse;
};