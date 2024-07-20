import React from "react";
import { useQuery } from '@tanstack/react-query';
import { useUser } from "@/lib/contexts/UserContext";
import Issue from "../Issue/Issue";
import IssueInputBox from "@/components/IssueInputBox/IssueInputBox";
import RightSidebar from "@/components/RightSidebar/RightSidebar";
import { UserAlt, Issue as IssueType, FeedProps } from "@/lib/types";
import LoadingIndicator from "@/components/ui/loader";
import styles from '@/styles/Feed.module.css';

import { fetchIssues } from "@/lib/api/fetchIssues";

const Feed: React.FC<FeedProps> = ({ showInputBox = true }) => {
  const { user } = useUser();
  const [sortBy, setSortBy] = React.useState("newest");
  const [filter, setFilter] = React.useState("All");

  const { data: issues, isLoading, isError } = useQuery({
    queryKey: ['feed_issues', user, sortBy, filter],
    queryFn: () => fetchIssues(user as UserAlt, sortBy, filter),
    enabled: true,
  });

  return (
    <div className="flex h-full">
      <div className={`flex-1 overflow-y-auto px-6 ${styles['feed-scroll']}`}>
        {showInputBox && user && <IssueInputBox user={user} />}
        {isLoading ? (
          <LoadingIndicator />
        ) : isError ? (
          <p>Error loading issues.</p>
        ) : (
          <>
            {issues && Array.isArray(issues) && issues.length > 0 ? (
              issues.map((issue: IssueType) => <Issue key={issue.issue_id} issue={issue} />)
            ) : (
              <p>No issues found.</p>
            )}
          </>
        )}
      </div>
      <RightSidebar
        sortBy={sortBy}
        setSortBy={setSortBy}
        filter={filter}
        setFilter={setFilter}
      />
    </div>
  );
};

export default Feed;
