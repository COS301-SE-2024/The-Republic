"use client";

import React from "react";
import { useQuery } from '@tanstack/react-query';
import { useParams } from "next/navigation";
import { useUser } from "@/lib/contexts/UserContext";
import { UserAlt } from "@/lib/types";
import Issue from "@/components/Issue/Issue";
import CommentList from "@/components/Comment/CommentList";
import { Loader2 } from "lucide-react";
import { fetchIssueDetails } from "@/lib/api/fetchIssueDetails";

const IssuePage = () => {
  const { issueId } = useParams();
  const { user } = useUser();
  const { data: issue, isLoading, isError } = useQuery({
    queryKey: ['single_issue', user, issueId],
    queryFn: () => fetchIssueDetails(user as UserAlt, issueId as string),
    enabled: (issueId !== undefined && issueId !== null),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-6 w-6 animate-spin text-green-400" />
      </div>
    );
  }

  if (!issue || isError) {
    return (
      <div className="flex justify-center items-center h-full">
        <h3 className="text-xlg">Issue not found</h3>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-2">
      <Issue issue={issue} />
      <CommentList
        issueId={Number.parseInt(issueId as string)}
        parentCommentId={null}
      />
    </div>
  );
};

export default IssuePage;
