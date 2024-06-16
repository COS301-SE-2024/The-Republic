import React, { useEffect, useState } from "react";
import Issue from "../Issue/Issue";
import IssueInputBox from "@/components/IssueInputBox/IssueInputBox";
import { Issue as IssueType } from "@/lib/types";
import { useUser } from "@/lib/contexts/UserContext";

interface FeedProps {
  userId?: string;
  showInputBox?: boolean;
}

const Feed: React.FC<FeedProps> = ({ userId, showInputBox = true }) => {
  const [issues, setIssues] = useState<IssueType[]>([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues`;
        const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify({
            from: 0,
            amount: 99,
          }),
          headers: {
            "content-type": "application/json"
          }
        });
        const apiResponse = await response.json();
        setIssues(apiResponse.data);
      } catch (error) {
        console.error("Error fetching issues:", error);
      }
    };

    fetchIssues();
  }, [userId]);

  return (
    <div className="w-full px-6">
      {showInputBox && <IssueInputBox user={user} />}
      {issues.map((issue) => (
        <Issue key={issue.issue_id} issue={issue} />
      ))}
    </div>
  );
};

export default Feed;
