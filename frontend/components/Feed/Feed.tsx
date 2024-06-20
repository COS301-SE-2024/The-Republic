import React, { useEffect, useState } from "react";
import Issue from "../Issue/Issue";
import IssueInputBox from "@/components/IssueInputBox/IssueInputBox";
import { Issue as IssueType } from "@/lib/types";
import { supabase } from "@/lib/globals";

interface User {
  user_id: string;
  email_address: string;
  username: string;
  fullname: string;
  image_url: string;
  bio: string;
  is_owner: boolean;
  total_issues: number;
  resolved_issues: number;
  access_token: string;
}

interface FeedProps {
  userId?: string;
  showInputBox?: boolean;
}

const Feed: React.FC<FeedProps> = ({ userId, showInputBox = true }) => {
  const [issues, setIssues] = useState<IssueType[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: sessionData, error } = await supabase.auth.getSession();
      if (!error && sessionData.session) {
        const session = sessionData.session;
        const userDetails: User = {
          user_id: session.user.id,
          fullname: session.user.user_metadata.full_name,
          image_url: session.user.user_metadata.avatar_url,
          email_address: session.user.email as string,
          username: session.user.user_metadata.user_name,
          bio: session.user.user_metadata.bio,
          is_owner: false, // Assuming this field needs to be filled later
          total_issues: 0, // Assuming this field needs to be filled later
          resolved_issues: 0, // Assuming this field needs to be filled later
          access_token: session.access_token,
        };
        setUser(userDetails);
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

        if (user) {
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
      {showInputBox && user && <IssueInputBox user={user} />}
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
