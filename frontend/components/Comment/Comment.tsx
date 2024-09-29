import React, { useState } from "react";
import { Comment as CommentType } from "@/lib/types";
import UserAvatarWithScore from '@/components/UserAvatarWithScore/UserAvatarWithScore';
import { Button } from "@/components/ui/button";
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
import CommentList from "@/components/Comment/CommentList";
import { Loader2 } from "lucide-react";
import { deleteComment } from "@/lib/api/deleteComment";

interface CommentProps {
  comment: CommentType;
  onCommentDeleted: (comment: CommentType) => void;
  itemType: 'issue' | 'post';
}

const Comment: React.FC<CommentProps> = ({ comment, onCommentDeleted, itemType }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  const handleDelete = async () => {
    if (!user) {
      toast({
        title: "Something Went Wrong",
        description: "You need to be logged in to delete a comment",
      });
      return;
    }

    try {
      setIsLoading(true);
      await deleteComment(user, comment.comment_id.toString());
      onCommentDeleted(comment);
      toast({
        title: "Success",
        description: "Comment deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast({
        title: "Something Went Wrong",
        variant: "destructive",
        description: "Failed to delete comment",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const userAvatar = comment.user?.image_url;
  const userFullname = comment.user?.fullname || "Anonymous";
  const userScore = comment.user?.user_score ?? 0;
  const isOwner = comment.user_id === user?.user_id;
  const isAnonymous = !comment.user || comment.user.username === "Anonymous";
  const isReply = comment.parent_id !== null;

  const highlightMentions = (text: string) => {
    return text.replace(/@(\w+)/g, '<span class="text-primary font-semibold">@$1</span>');
  };

  return (
    <>
      <div className="flex items-start space-x-4 space-y-4 mb-4" data-testid="comment">
        <div className="relative space-y-6">
          <UserAvatarWithScore
            imageUrl={userAvatar}
            username={userFullname}
            score={userScore}
            className="w-12 h-12"
            isAnonymous={isAnonymous}
          />
        </div>
        <div className="flex-1">
          <div className="bg-card text-card-foreground p-4 rounded-lg shadow">
            <div className="font-bold">{userFullname}</div>
            <div dangerouslySetInnerHTML={{ __html: highlightMentions(comment.content) }} />
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
                {showReplies ? "Hide replies" : "Show replies"}
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
              itemId={itemType === 'issue' ? comment.issue_id?.toString() ?? '' : comment?.post_id?.toString() ?? ''}
              itemType={itemType}
              parentCommentId={comment.comment_id.toString()}
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
              data-testid="confirm-delete-button"
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