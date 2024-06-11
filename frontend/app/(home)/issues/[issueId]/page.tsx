'use client';

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@/lib/contexts/UserContext";
import { Issue as IssueType } from "@/lib/types";
import fetchIssueDetails from "@/lib/api/fetchIssue";  // Adjust the import path as needed
import Issue from "@/components/Issue/Issue";
import CommentList from "@/components/Comment/CommentList";
import AddCommentForm from "@/components/Comment/AddCommentForm";

const IssuePage = () => {
  const { issueId } = useParams();
  const { user } = useUser();
  const [issue, setIssue] = useState<IssueType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getIssueDetails = async () => {
      if (issueId) {
        const issueDetails = await fetchIssueDetails(issueId as string);
        setIssue(issueDetails);
        setLoading(false);
      }
    };

    getIssueDetails();
  }, [issueId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!issue) {
    return <div>Issue not found</div>;
  }

  return (
    <div className="container mx-auto p-2">
      <Issue issue={issue} />
      {user && <AddCommentForm issueId={issueId as string} onCommentAdded={() => {}} />}
      <CommentList issueId={issueId as string} />
    </div>
  );
};

export default IssuePage;
