import { Resolution, UserAlt as User } from "@/lib/types";
import { toast } from "@/components/ui/use-toast";

const createSelfResolution = async (
  user: User,
  issueId: number,
  resolutionText: string,
  proofImage?: File
): Promise<Resolution | null> => {
  if (!user) {
    toast({
      variant: "destructive",
      description: "Please log in to create a resolution.",
    });
    return null;
  }

  const headers: HeadersInit = {
    Authorization: `Bearer ${user.access_token}`,
  };

  const formData = new FormData();
  formData.append('issueId', issueId.toString());
  formData.append('userId', user.user_id);
  formData.append('resolutionText', resolutionText);
  if (proofImage) {
    formData.append('proofImage', proofImage);
  }

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues/self-resolution`;
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: formData,
  });

  const apiResponse = await response.json();

  if (apiResponse.success && apiResponse.data) {
    return apiResponse.data;
  } else {
    throw new Error(apiResponse.error || "Failed to create external resolution");
  }
};

export { createSelfResolution };