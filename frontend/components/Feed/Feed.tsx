import React, { useEffect, useState } from "react";
import Issue from "../Issue/Issue";
import IssueInputBox from "@/components/IssueInputBox/IssueInputBox";
import { Issue as IssueType } from "@/lib/types";
import { supabase } from "@/lib/globals";

interface FeedProps {
  userId?: string;
  showInputBox?: boolean;
}

const Feed: React.FC<FeedProps> = ({ userId, showInputBox = true }) => {
  const [issues, setIssues] = useState<IssueType[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: sessionData, error } = await supabase.auth.getSession();
      if (!error && sessionData.session) {
        const session = sessionData.session;
        setUser({ ...session.user, access_token: session.access_token });
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        if (user && user.access_token) {
          headers.Authorization = `Bearer ${user.access_token}`;
        }

        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues`;
        const response = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify({
            from: 0,
            amount: 99,
          }),
        });

        const apiResponse = await response.json();

        if (apiResponse.success && apiResponse.data) {
          setIssues(apiResponse.data);
        } else {
          console.error("Error fetching issues:", apiResponse.error);
        }
      } catch (error) {
        console.error("Error fetching issues:", error);
      }
    };

    fetchIssues();
  }, [user, userId]);

  return (
    <div className="w-full px-6">
      {showInputBox && <IssueInputBox user={user} />}
      {issues && issues.length > 0 ? (
        issues.map((issue) => (
          <Issue key={issue.issue_id} issue={issue} />
        ))
      ) : (
        <p>No issues found.</p>
      )}
    </div>
  );
};

export default Feed;
