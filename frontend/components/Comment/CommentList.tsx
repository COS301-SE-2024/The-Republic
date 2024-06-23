import React, { useEffect, useState } from "react";
import { Comment as CommentType } from "@/lib/types";
import Comment from "./Comment";
import { useUser } from "@/lib/contexts/UserContext";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "../ui/button";

interface CommentListProps {
  issueId: string;
}

const CommentList: React.FC<CommentListProps> = ({ issueId }) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const { user } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        if (user) {
          headers.Authorization = `Bearer ${user.access_token}`;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/comments`, {
          method: "POST",
          headers,
          body: JSON.stringify({ issue_id: issueId, from: 0, amount: 99 }),
        });

        const responseData = await response.json();
        if (responseData.success) {
          setComments(responseData.data);
        } else {
          console.error("Failed to fetch comments:", responseData.error);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [issueId, user]);

  const handleDeleteComment = async (commentId: string) => {
    if (!user) {
      toast({
        description: "You need to be logged in to delete a comment",
      });
      return;
    }

    setCommentToDelete(commentId);
  };

  const confirmDeleteComment = async () => {
    if (!commentToDelete) return;

    if (!user) {
      toast({
        description: "You need to be logged in to delete a comment",
      });
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/comments/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.access_token}`,
        },
        body: JSON.stringify({ comment_id: commentToDelete }),
      });

      if (response.ok) {
        setComments((prevComments) => prevComments.filter((comment) => comment.comment_id !== commentToDelete));
        setCommentToDelete(null);
        toast({
          description: "Comment deleted successfully",
        });
      } else {
        const responseData = await response.json();
        console.error("Failed to delete comment:", responseData.error);
        toast({
          description: "Failed to delete comment",
        });
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast({
        description: "Error deleting comment",
      });
    }
  };

  const handleReply = (parentCommentId: string, reply: CommentType) => {
    const updatedReply = { ...reply, parent_id: parentCommentId };
    setComments((prevComments) => [...prevComments, updatedReply]);
  };

  const renderComments = (parentId: string | null) => {
    const threadComments = comments.filter(
      (comment) => comment.parent_id === parentId
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
      {renderComments(null)}
      {commentToDelete && (
        <Dialog open={true} onOpenChange={() => setCommentToDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this comment? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCommentToDelete(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDeleteComment}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CommentList;