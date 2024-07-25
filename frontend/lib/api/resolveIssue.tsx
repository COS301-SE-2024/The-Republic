import { UserAlt as User } from "@/lib/types";
import { toast } from "@/components/ui/use-toast";

const resolveIssue = async (
  user: User,
  issueId: string | null,
): Promise<void> => {
  if (!user) {
    toast({
      variant: "destructive",
      description: "Please log in to resolve issues.",
    });

    return;
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user.access_token}`,
  };

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues/resolve/`;
  const response = await fetch(url, {
    method: "PUT",
    headers,
    body: JSON.stringify({ issue_id: issueId }),
  });

  if (response.status === 204) {
    return;
  }

  const apiResponse = await response.json();
  console.log("Issue resolved:", apiResponse);

  if (apiResponse.ok || apiResponse.success) {
    return apiResponse.data;
  } else {
    throw new Error(apiResponse.error || "Failed to resolve issue");
  }
};

export { resolveIssue };
