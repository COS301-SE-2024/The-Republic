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
import { Loader2 } from "lucide-react";
import Image from "next/image";

interface CommentProps {
  comment: CommentType;
  onCommentDeleted: (comment: CommentType) => void;
}

const Comment: React.FC<CommentProps> = ({ comment, onCommentDeleted }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
      setIsLoading(true);

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

        onCommentDeleted(comment);
      } else {
        const responseData = await response.json();
        console.error("Failed to delete comment:", responseData.error);
        toast({
          variant: "destructive",
          description: "Failed to delete comment",
        });
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast({
        description: "Error deleting comment",
      });
    }
  };

  const userAvatar = comment.user?.image_url;
  const userFullname = comment.user?.fullname || "Anonymous";
  const isOwner = comment.user_id === user?.user_id;
  const isReply = comment.parent_id !== null;

  return (
    <>
      <div className="flex items-start space-x-4 space-y-4 mb-4">
        <div className="relative space-y-6">
          <Avatar>
            <AvatarImage asChild/>
              {userAvatar && (
                <Image
                  src={userAvatar}
                  alt="User avatar"
                  fill
                />
              )}
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
            {!isReply && (
              <Button
                variant="ghost"
                className="text-green-600 dark:text-green-400"
                onClick={() => setShowReplies(!showReplies)}
              >
                {showReplies
                  ? "Hide replies"
                  : "Show replies" // TODO: Get reply count from comment
                }
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
            {isLoading && <Loader2 className="h-4 w-4 animate-spin text-green-500"/>}
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
