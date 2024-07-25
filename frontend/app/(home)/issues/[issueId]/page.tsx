"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useUser } from "@/lib/contexts/UserContext";
import { UserAlt } from "@/lib/types";
import LoadingIndicator from "@/components/ui/loader";
import Issue from "@/components/Issue/Issue";
import CommentList from "@/components/Comment/CommentList";
import AddCommentForm from "@/components/Comment/AddCommentForm";

import { fetchIssueDetails } from "@/lib/api/fetchIssueDetails";

const IssuePage = () => {
  const { issueId } = useParams();
  const { user } = useUser();

  const {
    data: issue,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["single_issue", user, issueId],
    queryFn: () => fetchIssueDetails(user as UserAlt, issueId as string),
    enabled: issueId !== undefined && issueId !== null,
  });

  return (
    <div className="container mx-auto p-2">
      {isLoading ? (
        <LoadingIndicator />
      ) : isError || !issue ? (
        <p>Error loading This Issue.</p>
      ) : (
        <>
          <Issue issue={issue} />
          {user && (
            <AddCommentForm
              issueId={issueId as string}
              onCommentAdded={() => {}}
            />
          )}
          <CommentList issueId={issueId as string} />
        </>
      )}
    </div>
  );
};

export default IssuePage;
