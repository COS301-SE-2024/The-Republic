import { UserAlt as User, RequestBody, Location } from "@/lib/types";

const fetchIssues = async (
  user: User,
  sortBy: string,
  filter: string,
  location: Location | null,
) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (user) {
    headers.Authorization = `Bearer ${user.access_token}`;
  }

  const requestBody: RequestBody = {
    from: 0,
    amount: 99,
    order_by:
      sortBy === "newest"
        ? "created_at"
        : sortBy === "oldest"
          ? "created_at"
          : "comment_count",
    ascending: sortBy === "oldest",
  };

  if (filter !== "All") {
    requestBody.category = filter;
  }

  if (location) {
    requestBody.location = location;
  }

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues`;
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(requestBody),
  });

  const apiResponse = await response.json();

  if (apiResponse.success && apiResponse.data) {
    return apiResponse.data;
  } else {
    throw new Error(apiResponse.error || "Error fetching issues");
  }
};

export { fetchIssues };
