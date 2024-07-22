import React, { useState } from "react";
import { Comment as CommentType } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/contexts/UserContext";
import { useToast } from "../ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import CommentList from "./CommentList";

interface CommentProps {
  comment: CommentType;
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  const handleDelete = async () => {
    if (!user) {
      toast({
        description: "You need to be logged in to delete a comment",
      });
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/comments/delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.access_token}`,
          },
          body: JSON.stringify({ comment_id: comment.comment_id }),
        },
      );

      if (response.ok) {
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

  const userAvatar = comment.user?.image_url || "";
  const userFullname = comment.user?.fullname || "Anonymous";
  const isOwner = comment.user_id === user?.user_id;
  const isReply = comment.parent_id !== null;

  return (
    <>
      <div className="flex items-start space-x-4 space-y-4 mb-4">
        <div className="relative space-y-6">
          <Avatar>
            <AvatarImage src={userAvatar} />
            <AvatarFallback>{userFullname[0]}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1">
          <div className="bg-card text-card-foreground p-4 rounded-lg shadow">
            <div className="font-bold">{userFullname}</div>
            <div>{comment.content}</div>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            {user && !isReply && (
              <Button
                variant="ghost"
                size="sm"
                className="text-green-600 dark:text-green-400"
                onClick={() => setIsReplying(!isReplying)}
              >
                {isReplying ? "Cancel" : "Reply"}
              </Button>
            )}
            {isOwner && (
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 dark:text-red-400"
                onClick={() => setConfirmDelete(true)}
              >
                Delete
              </Button>
            )}
            {!isReply && (
              <button
                className="text-green-600 dark:text-green-400"
                onClick={() => setShowReplies(!showReplies)}
              >
                {showReplies
                  ? "Hide replies"
                  : "Show replies" // TODO: Get reply count from comment
                }
              </button>
            )}
          </div>
          {(isReplying || showReplies) && (
            <CommentList
              issueId={comment.issue_id}
              parentCommentId={comment.comment_id}
              showAddComment={isReplying}
              showComments={showReplies}
            />
          )}
        </div>
      </div>
      <Dialog open={confirmDelete}>
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
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setConfirmDelete(false);
                handleDelete();
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Comment;
