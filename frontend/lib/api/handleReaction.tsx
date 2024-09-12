import { UserAlt as User } from "@/lib/types";

const handleReaction = async (
  user: User | null,
  itemId: string,
  itemType: 'issue' | 'post',
  emoji: string | null,
): Promise<{ [key: string]: string } | { [key: string]: number }> => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user?.access_token}`,
  };

  const requestBody = JSON.stringify({ 
    [itemType === 'issue' ? 'issue_id' : 'post_id']: itemId, 
    itemType,
    emoji 
  });

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reactions`;
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: requestBody,
  });

  const apiResponse = await response.json();

  if (apiResponse.success && apiResponse.data) {
    return apiResponse.data;
  } else {
    throw new Error(apiResponse.error || "Failed to update reaction");
  }
};

export { handleReaction };