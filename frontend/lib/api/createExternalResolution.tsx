import { UserAlt as User, Resolution, Suspension } from "@/lib/types";
import { toast } from "@/components/ui/use-toast";

const createExternalResolution = async (
  user: User,
  issueId: number,
  resolutionText: string,
  resolutionSource: 'unknown' | 'other',
  resolvedBy?: string,
  politicalAssociation?: string,
  stateEntityAssociation?: string,
  proofImage?: File,
  organizationId?: string
): Promise<Resolution | Suspension | null> => {
  if (!user) {
    toast({
      title: "Something Went Wrong",
      variant: "destructive",
      description: "Please log in to create a resolution.",
    });
    return null;
  }

  const formData = new FormData();
  formData.append('issueId', issueId.toString());
  formData.append('userId', user.user_id);
  formData.append('resolutionText', resolutionText);
  formData.append('resolutionSource', resolutionSource);
  if (resolvedBy) formData.append('resolvedBy', resolvedBy);
  if (politicalAssociation) formData.append('politicalAssociation', politicalAssociation);
  if (stateEntityAssociation) formData.append('stateEntityAssociation', stateEntityAssociation);
  if (proofImage) formData.append('proofImage', proofImage);
  if (organizationId) formData.append('organizationId', organizationId);

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues/external-resolution`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${user.access_token}`,
    },
    body: formData,
  });

  const apiResponse = await response.json();

  if (
    apiResponse.success ||
    apiResponse.error === "User is suspended"
  ) {
    return apiResponse.data;
  } {
    throw new Error(apiResponse.error || "Failed to create external resolution");
  }
};

export { createExternalResolution };
