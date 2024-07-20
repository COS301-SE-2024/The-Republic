"use client";

import React, { useEffect, useState } from "react";
import Issue from "../Issue/Issue";
import IssueInputBox from "@/components/IssueInputBox/IssueInputBox";
import RightSidebar from "@/components/RightSidebar/RightSidebar";
import {
  Issue as IssueType,
  UserAlt,
  RequestBody,
  FeedProps,
  Location,
} from "@/lib/types";
import { supabase } from "@/lib/globals";
import { FaSpinner } from "react-icons/fa";
import styles from './Feed.module.css';

const Feed: React.FC<FeedProps> = ({ userId, showInputBox = true }) => {
  const [issues, setIssues] = useState<IssueType[]>([]);
  const [user, setUser] = useState<UserAlt | null>(null);
  const [sortBy, setSortBy] = useState("newest");
  const [filter, setFilter] = useState("All");
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: sessionData, error } = await supabase.auth.getSession();
      if (!error && sessionData.session) {
        const session = sessionData.session;
        const userDetailsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${session.user.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
          },
        );

        if (userDetailsResponse.ok) {
          const userDetails = await userDetailsResponse.json();
          const user: UserAlt = {
            user_id: session.user.id,
            fullname: userDetails.data.fullname,
            image_url: userDetails.data.image_url,
            email_address: session.user.email as string,
            username: userDetails.data.username,
            bio: userDetails.data.bio,
            is_owner: false,
            total_issues: 0,
            resolved_issues: 0,
            access_token: session.access_token,
          };
          setUser(user);
        }
      }
    };

    fetchUser();
  }, []);

  const fetchIssues = async () => {
    setLoading(true);
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
        order_by:
          sortBy === "newest"
            ? "created_at"
            : sortBy === "oldest"
            ? "created_at"
            : "comment_count",
        ascending: sortBy === "oldest",
      };

      if (filter !== "All") {
        requestBody.category = filter;
      }

      if (location) {
        requestBody.location = location;
      }

      console.log(requestBody);

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
    } finally {
      setLoading(false);
    }
  };

  // Fetch issues when component mounts and when user changes
  useEffect(() => {
    if (user) {
      fetchIssues();
    }
  }, [user]);
  
  // Fetch issues when filters change
  useEffect(() => {
    if (user) {
      fetchIssues();
    }
  }, [sortBy, filter, location]);

  const LoadingIndicator = () => (
    <div className="flex justify-center items-center h-24">
      <FaSpinner className="animate-spin text-4xl text-green-500" />
    </div>
  );

  return (
    <div className="flex h-full">
      <div className={`flex-1 overflow-y-auto px-6 ${styles['feed-scroll']}`}>
        {showInputBox && user && <IssueInputBox user={user} />}
        {loading ? (
          <LoadingIndicator />
        ) : issues.length > 0 ? (
          issues.map((issue) => <Issue key={issue.issue_id} issue={issue} />)
        ) : (
          <p>No issues found.</p>
        )}
      </div>
      <RightSidebar
        sortBy={sortBy}
        setSortBy={setSortBy}
        filter={filter}
        setFilter={setFilter}
        location={location}
        setLocation={setLocation}
      />
    </div>
  );
};

export default Feed;