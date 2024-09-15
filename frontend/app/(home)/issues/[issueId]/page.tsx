"use client";

import { useParams } from "next/navigation";
import { Issue as IssueType } from "@/lib/types";
import Issue from "@/components/Issue/Issue";
import CommentList from "@/components/Comment/CommentList";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchIssueDetails } from "@/lib/api/fetchIssueDetails";
import { useUser } from "@/lib/contexts/UserContext";
import { Loader2 } from "lucide-react";

const IssuePage = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const issueId = Number.parseInt(useParams().issueId as string);
  const {
    data,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["issue", issueId],
    queryFn: () => fetchIssueDetails(user, issueId),
    initialData: () => {
      const cachedFeeds = queryClient
        .getQueriesData<{ pages: IssueType[][] }>({
          queryKey: ["feed-issues"],
        });

      for (const feed of cachedFeeds) {
        const issue = feed?.[1]?.pages
          .flat()
          .find((feedIssue) => feedIssue.issue_id === issueId);

        if (issue) {
          return issue;
        }
      }
    },
    staleTime: Number.POSITIVE_INFINITY
  });

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <h3 className="text-xlg">Issue not found</h3>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-6 w-6 animate-spin text-green-400" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-2">
      <Issue issue={data!} />
      <CommentList
          itemId={issueId.toString()}
          itemType="issue"
          parentCommentId={null}
          showAddComment={true}
      />
    </div>
  );
};

export default IssuePage;
