"use client";

import React from "react";
import { useUser } from "@/lib/contexts/UserContext";
import { Issue as IssueType, ProfileFeedProps } from "@/lib/types";
import Issue from "../Issue/Issue";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import ResolutionFeed from "../ResolutionFeed/ResolutionFeed";
import ErrorPage from "@/components/ui/error_page";

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
    enabled: Boolean(accessToken) && selectedTab !== "resolutions",
  });

  // Filter out anonymous issues
  const nonAnonymousIssues = issues.filter((issue) => !issue.is_anonymous);

  const LoadingIndicator = () => (
    <div className="flex justify-center items-center h-32">
      <Loader2 className="h-6 w-6 animate-spin text-green-400" />
    </div>
  );

  if (selectedTab === "resolutions") {
    return <ResolutionFeed userId={userId} />;
  }

  return (
    <div className="w-full px-6">
      {isLoading ? (
        <LoadingIndicator />
      ) : isError ? (
        <ErrorPage
          message="Failed to load issues."
          error="We encountered a problem while trying to load issues. Please check your connection and try reloading the page."
        />
      ) : nonAnonymousIssues.length > 0 ? (
        nonAnonymousIssues.map((issue) => (
          <Issue key={issue.issue_id} issue={issue} />
        ))
      ) : (
        <ErrorPage
          message="No issues found."
          error="It seems there are no issues to display. Please check back later."
        />
      )}
    </div>
  );
};

export default ProfileFeed;