import React, { useEffect, useState } from "react";
import Issue from "../Issue/Issue";
import IssueInputBox from "@/components/IssueInputBox/IssueInputBox";
import { Issue as IssueType } from "@/lib/types";

const Feed = () => {
  const [issues, setIssues] = useState<IssueType[]>([]);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/issues");
        const data: IssueType[] = await response.json();
        setIssues(data);
      } catch (error) {
        console.error("Error fetching issues:", error);
      }
    };

    fetchIssues();
  }, []);

  return (
    <div className="w-full px-6">
      <IssueInputBox />
      {issues.map((issue) => (
        <Issue key={issue.issue_id} issue={issue} />
      ))}
    </div>
  );
};

export default Feed;
