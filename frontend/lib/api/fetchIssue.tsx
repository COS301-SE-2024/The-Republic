import { Issue as IssueType } from "@/lib/types";

async function fetchIssueDetails(issueId: string): Promise<IssueType | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues/${issueId}`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch issue details");
    }
    const issue = await response.json();
    return issue;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default fetchIssueDetails;
