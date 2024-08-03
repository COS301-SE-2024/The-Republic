import { User } from "@/lib/types";

const deleteResolution = async (user: User, resolutionId: string) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (user) {
    headers.Authorization = `Bearer ${user.access_token}`;
  }

  const requestBody = {
    resolutionId,
    userId: user.user_id,
  };

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues/delete-resolution`;
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(requestBody),
  });

  const apiResponse = await response.json();

  if (apiResponse.success) {
    return true;
  } else {
    throw new Error(apiResponse.error || "Error deleting resolution");
  }
};

export { deleteResolution };