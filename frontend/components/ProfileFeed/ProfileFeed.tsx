"use client";

import React, { useEffect, useState } from "react";
import { Issue as IssueType } from "@/lib/types";
import { supabase } from "@/lib/globals";
import Issue from "../Issue/Issue";
import { FaSpinner } from "react-icons/fa";

interface ProfileFeedProps {
  userId: string;
  selectedTab: "issues" | "resolved";
}

const ProfileFeed: React.FC<ProfileFeedProps> = ({ userId, selectedTab }) => {
  const [issues, setIssues] = useState<IssueType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData?.session;

        if (session && session.user) {
          const url =
            selectedTab === "issues"
              ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues/user`
              : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues/user/resolved`;

          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({ profile_user_id: userId }),
          });

          const responseData = await response.json();
          if (responseData.success && responseData.data) {
            setIssues(responseData.data);
          } else {
            console.error("Failed to fetch issues:", responseData.error);
          }
        } else {
          console.error("User ID not found in session");
        }
      } catch (error) {
        console.error("Error fetching issues:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, [userId, selectedTab]);

  // Filter out anonymous issues
  // TODO: filter out from backend
  const nonAnonymousIssues = issues.filter((issue) => !issue.is_anonymous);

  const LoadingIndicator = () => (
    <div className="flex justify-center items-center h-24">
      <FaSpinner className="animate-spin text-4xl text-blue-500" />
    </div>
  );

  return (
    <div className="w-full px-6">
      {loading ? (
        <LoadingIndicator />
      ) : nonAnonymousIssues.length > 0 ? (
        nonAnonymousIssues.map((issue) => (
          <Issue key={issue.issue_id} issue={issue} />
        ))
      ) : (
        <p className="text-center text-gray-500 mt-4">No issues found.</p>
      )}
    </div>
  );
};

export default ProfileFeed;
