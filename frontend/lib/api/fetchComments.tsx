import { UserAlt as User, Comment as CommentType } from "@/lib/types";

const fetchComments = async (user: User, issueId: string): Promise<CommentType[]> => {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
  
    if (user) {
      headers.Authorization = `Bearer ${user.access_token}`;
    }
  
    const requestBody = JSON.stringify({
        issue_id: issueId,
        from: 0,
        amount: 99
    });
  
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/comments`;
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: requestBody,
    });
  
    const apiResponse = await response.json();
  
    if (apiResponse.success && apiResponse.data) {
      return apiResponse.data;
    } else {
      throw new Error(apiResponse.error || 'Failed to fetch issue details');
    }
};

export { fetchComments };