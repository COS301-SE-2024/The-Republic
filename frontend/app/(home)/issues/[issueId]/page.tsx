"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@/lib/contexts/UserContext";
import { Issue as IssueType } from "@/lib/types";
import Issue from "@/components/Issue/Issue";
import CommentList from "@/components/Comment/CommentList";
import { Loader2 } from "lucide-react";

const IssuePage = () => {
  const { issueId } = useParams();
  const { user } = useUser();
  const [issue, setIssue] = useState<IssueType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getIssueDetails = async () => {
      if (issueId) {
        try {
          const headers: HeadersInit = {
            "Content-Type": "application/json",
          };

          if (user) {
            headers.Authorization = `Bearer ${user.access_token}`;
          }

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues/single`,
            {
              method: "POST",
              headers,
              body: JSON.stringify({ issue_id: issueId }),
            },
          );

          if (!response.ok) {
            throw new Error("Failed to fetch issue details");
          }

          const responseData = await response.json();
          if (!responseData.success) {
            throw new Error(
              responseData.error || "Failed to fetch issue details",
            );
          }

          setIssue(responseData.data);
        } catch (error) {
          console.error(error);
          setIssue(null);
        } finally {
          setLoading(false);
        }
      }
    };

    getIssueDetails();
  }, [issueId, user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-6 w-6 animate-spin text-green-400" />
      </div>
    );
  }

  if (!issue) {
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
