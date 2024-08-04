import { User, Issue } from "@/lib/types";

const fetchUserIssueInCluster = async (user: User, clusterId: string): Promise<Issue | null> => {
  const response = await fetch("/api/issues/user-issue-in-cluster", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${user.access_token}`,
    },
    body: JSON.stringify({ clusterId }),
  });

  if (response.ok) {
    const data = await response.json();
    return data.issue as Issue;
  } else {
    console.error("Failed to fetch user's issue in cluster:", response.statusText);
    return null;
  }
};

export { fetchUserIssueInCluster };