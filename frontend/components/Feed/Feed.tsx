import React, { useEffect, useState } from "react";
import Issue from "../Issue/Issue";
import IssueInputBox from "@/components/IssueInputBox/IssueInputBox";
import { Issue as IssueType } from "@/lib/types";
import { useUser } from "@/lib/contexts/UserContext";

const Feed = () => {
  const [issues, setIssues] = useState<IssueType[]>([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues`);
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
      <IssueInputBox user={user || { fullname: "Defalt User", image_url: "/default.png" }} />
      {issues.map((issue) => (
        <Issue key={issue.issue_id} issue={issue} />
      ))}
    </div>
  );
};

export default Feed;
