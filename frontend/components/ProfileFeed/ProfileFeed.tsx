"use client";

import React from "react";
import { useUser } from "@/lib/contexts/UserContext";
import { Issue as IssueType, ProfileFeedProps } from "@/lib/types";
import Issue from "../Issue/Issue";
import { FaSpinner } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";

import { profileFetchIssues } from "@/lib/api/profileFetchIssues";

const ProfileFeed: React.FC<ProfileFeedProps> = ({ userId, selectedTab }) => {
  const { user } = useUser();
  const accessToken = user?.access_token;
  const url =
    selectedTab === "issues"
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues/user`
      : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues/user/resolved`;

  const {
    data: issues = [],
    isLoading,
    isError,
  } = useQuery<IssueType[]>({
    queryKey: ["profile_issues", userId, selectedTab],
    queryFn: () => profileFetchIssues(user, userId, url),
    enabled: Boolean(accessToken),
  });

  // Filter out anonymous issues
  const nonAnonymousIssues = issues.filter((issue) => !issue.is_anonymous);

  const LoadingIndicator = () => (
    <div className="flex justify-center items-center h-24">
      <FaSpinner className="animate-spin text-4xl text-green-500" />
    </div>
  );

  return (
    <div className="w-full px-6">
      {isLoading ? (
        <LoadingIndicator />
      ) : isError ? (
        <p className="text-center text-red-500 mt-4">Failed to load issues.</p>
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
