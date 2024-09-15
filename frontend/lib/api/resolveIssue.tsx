import { UserAlt as User, Resolution } from "@/lib/types";

const resolveIssue = async (
  user: User,
  issueId: number,
  resolutionText: string,
  proofImage?: File,
  organizationId?: string
): Promise<Resolution> => {
  const formData = new FormData();
  formData.append('issueId', issueId.toString());
  formData.append('userId', user.user_id);
  formData.append('resolutionText', resolutionText);
  if (proofImage) formData.append('proofImage', proofImage);
  if (organizationId) formData.append('organizationId', organizationId);

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues/self-resolution`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${user.access_token}`,
    },
    body: formData,
  });

  const apiResponse = await response.json();

  if (apiResponse.success && apiResponse.data) {
    return apiResponse.data;
  } else {
    throw new Error(apiResponse.error || "Failed to create self-resolution");
  }
};

export { resolveIssue };