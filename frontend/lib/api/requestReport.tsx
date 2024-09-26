import { User } from "@/lib/types";

const requestReport = async (user: User, organizationId: string, email: string): Promise<void> => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user.access_token}`,
  };

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/organizations/${organizationId}/report`;
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const apiResponse = await response.json();
    throw new Error(apiResponse.error);
  }
};

export { requestReport };