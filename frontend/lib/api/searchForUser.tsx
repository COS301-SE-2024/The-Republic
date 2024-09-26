import { UserSearchResult } from "../types";

export async function searchForUser(body: { 
  name?: string, 
  username?: string
}): Promise<UserSearchResult[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/search`;
  const response = await fetch(url, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const apiResponse = await response.json();

  if (apiResponse.success) {
    return apiResponse.data;
  } else {
    throw new Error(apiResponse.error);
  }
}     

