import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient, InvalidateQueryFilters } from '@tanstack/react-query';
import { CommentListProps, Comment as CommentType, UserAlt } from "@/lib/types";
import Comment from "./Comment";
import LoadingIndicator from "@/components/ui/loader";
import { useUser } from "@/lib/contexts/UserContext";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

import { fetchComments } from "@/lib/api/fetchComments";
import { deleteComment } from "@/lib/api/deleteComment";

const CommentList: React.FC<CommentListProps> = ({ issueId }) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: com_data, isLoading: isLoadingComments, isError: isErrorComments } = useQuery({
    queryKey: [`comment_list ${issueId}`, user, issueId],
    queryFn: () => fetchComments(user as UserAlt, issueId),
    enabled: (issueId !== undefined && issueId !== null),
  });

  useEffect(() => {
    if (!isLoadingComments && !isErrorComments && com_data) {
      setComments(com_data);
    }
  }, [com_data]);

  const handleDeleteComment = async (commentId: string) => {
    if (!user) {
      toast({
        description: "You need to be logged in to delete a comment",
      });
      return;
    }

    setCommentToDelete(commentId);
  };

  const mutation = useMutation({
    mutationFn: async () => {
      if (user) {
        return await deleteComment(user, commentToDelete);
      } else {
        toast({
          description: "You need to be logged in to delete a comment",
        });
      }
    },
    onSuccess: () => {
      setComments((prevComments) =>
        prevComments.filter(
          (comment) => comment.comment_id !== commentToDelete,
        ),
      );
      setCommentToDelete(null);
      toast({
        description: "Comment deleted successfully",
      });

      queryClient.invalidateQueries([`comment_list ${issueId}`, user, issueId] as InvalidateQueryFilters);
    },
    onError: (error) => {
      console.error("Failed to delete comment:", error);
      toast({
        description: "Failed to delete comment",
      });
    }
  });

  const confirmDeleteComment = async () => {
    if (!commentToDelete) return;

    if (!user) {
      toast({
        description: "You need to be logged in to delete a comment",
      });
      return;
    }

    mutation.mutate();
  };

  const handleReply = (parentCommentId: string, reply: CommentType) => {
    const updatedReply = { ...reply, parent_id: parentCommentId };
    setComments((prevComments) => [...prevComments, updatedReply]);
  };

  const renderComments = (parentId: string | null) => {
    const threadComments = comments.filter(
      (comment) => comment.parent_id === parentId,
    );

    return threadComments.map((comment) => (
      <div key={comment.comment_id} className={parentId ? "ml-8" : ""}>
        <Comment
          comment={comment}
          onDelete={handleDeleteComment}
          isOwner={comment.is_owner}
          onReply={handleReply}
          replies={comments.filter((c) => c.parent_id === comment.comment_id)}
        />
      </div>
    ));
  };

  return (
    <div className="pt-4">
      {isLoadingComments ? (
        <LoadingIndicator />
      ) : (
        <>
          {renderComments(null)}
          {commentToDelete && (
            <Dialog open={true} onOpenChange={() => setCommentToDelete(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Deletion</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this comment? This action cannot
                    be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setCommentToDelete(null)}
                  >
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={confirmDeleteComment}>
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </>
      )}
    </div>
  );
};

export default CommentList;
