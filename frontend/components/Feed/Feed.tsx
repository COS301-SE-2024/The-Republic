import React, { useEffect, useState } from "react";
import Issue from "../Issue/Issue";
import IssueInputBox from "@/components/IssueInputBox/IssueInputBox";
import { Issue as IssueType } from "@/lib/types";

interface FeedProps {
  userId?: string;
  showInputBox?: boolean;
}

const Feed: React.FC<FeedProps> = ({ userId, showInputBox= true }) => {
  const [issues, setIssues] = useState<IssueType[]>([]);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues`;
        if (userId) {
          url += `?user_id=${userId}`; // API CALL to make
        }

        const response = await fetch(url);
        const data: IssueType[] = await response.json();
        setIssues(data);
      } catch (error) {
        console.error("Error fetching issues:", error);
      }
    };

    fetchIssues();
  }, [userId]);

  return (
    <div className="w-full px-6">
      {showInputBox && <IssueInputBox />}
      {issues.map((issue) => (
        <Issue key={issue.issue_id} issue={issue} />
      ))}
    </div>
  );
};

export default Feed;
