import { UserAlt as User } from "@/lib/types";
import { toast } from "@/components/ui/use-toast";

const deleteIssue = async (
  user: User,
  issueId: string | null,
): Promise<void> => {
  if (!user) {
    toast({
      variant: "destructive",
      description: "Please log in to delete issues.",
    });

    return;
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user.access_token}`,
  };

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues`;
  const response = await fetch(url, {
    method: "DELETE",
    headers,
    body: JSON.stringify({ issue_id: issueId }),
  });

  if (response.status === 204) {
    return;
  }

  const apiResponse = await response.json();

  if (apiResponse.ok || apiResponse.success) {
    return apiResponse.data;
  } else {
    throw new Error(apiResponse.error || "Failed to delete issue");
  }
};

export { deleteIssue };
