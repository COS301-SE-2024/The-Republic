import { UserAlt as User, ActivityLog } from "@/lib/types";

export const getActivityLogs = async (user: User, organizationId: string): Promise<ActivityLog[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/organizations/${organizationId}/activity-logs`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.access_token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch activity logs');
  }

  const responseData = await response.json();
  return responseData.data.data;
};