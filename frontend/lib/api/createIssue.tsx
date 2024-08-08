import { UserAlt as User } from "@/lib/types";
import { toast } from "@/components/ui/use-toast";

const createIssue = async (
  user: User,
  requestBody: FormData | null,
): Promise<void> => {
  if (!user) {
    toast({
      variant: "destructive",
      description: "Please log in to create issues.",
    });

    return;
  }

  const headers: HeadersInit = {
    Authorization: `Bearer ${user.access_token}`,
  };

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues/create`;
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: requestBody,
  });

  if (response.status === 204) {
    return;
  }

  const apiResponse = await response.json();

  if (apiResponse.ok || apiResponse.success) {
    return apiResponse.data;
  } else {
    throw new Error(apiResponse.error || "Failed to create issue");
  }
};

export { createIssue };
