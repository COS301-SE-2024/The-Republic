import { UserAlt as User, UserExists } from "@/lib/types";

export const checkUsername = async (
  user: User,
  requestBody: UserExists,
) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (user) {
    headers.Authorization = `Bearer ${user.access_token}`;
  }

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/username/exists`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    });

    const apiResponse = await response.json();

    if (apiResponse.success && apiResponse.data) {
      return apiResponse.data;
    }
  } catch (err) {
    return false;
  }

  return false;
};

export default checkUsername;
