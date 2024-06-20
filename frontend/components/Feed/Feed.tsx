import React, { useEffect, useState } from "react";
import Issue from "../Issue/Issue";
import IssueInputBox from "@/components/IssueInputBox/IssueInputBox";
import RightSidebar from "@/components/RightSidebar/RightSidebar";
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

interface RequestBody {
  from: number;
  amount: number;
  order_by: string;
  ascending: boolean;
  category?: string;
}

interface FeedProps {
  userId?: string;
  showInputBox?: boolean;
}

const Feed: React.FC<FeedProps> = ({ userId, showInputBox = true }) => {
  const [issues, setIssues] = useState<IssueType[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [sortBy, setSortBy] = useState("newest");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchUser = async () => {
      const { data: sessionData, error } = await supabase.auth.getSession();
      if (!error && sessionData.session) {
        const session = sessionData.session;
        const userDetailsResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${session.user.id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (userDetailsResponse.ok) {
          const userDetails = await userDetailsResponse.json();
          const user: User = {
            user_id: session.user.id,
            fullname: userDetails.data.fullname,
            image_url: userDetails.data.image_url,
            email_address: session.user.email as string,
            username: userDetails.data.username,
            bio: userDetails.data.bio,
            is_owner: false, // Assuming this field needs to be filled later
            total_issues: 0, // Assuming this field needs to be filled later
            resolved_issues: 0, // Assuming this field needs to be filled later
            access_token: session.access_token,
          };
          setUser(user);
        }
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
    
        const requestBody: RequestBody = {
          from: 0,
          amount: 99,
          order_by: sortBy === "newest" ? "created_at" : sortBy === "oldest" ? "created_at" : "comment_count",
          ascending: sortBy === "oldest",
        };
    
        if (filter !== "All") {
          requestBody.category = filter;
        }
    
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues`;
        const response = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify(requestBody),
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
  }, [user, userId, sortBy, filter]);

  return (
    <div className="flex">
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
      <RightSidebar sortBy={sortBy} setSortBy={setSortBy} filter={filter} setFilter={setFilter} />
    </div>
  );
};

export default Feed;
