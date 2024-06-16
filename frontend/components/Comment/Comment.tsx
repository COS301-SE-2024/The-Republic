import React, { useState } from "react";
import { Comment as CommentType } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/contexts/UserContext";
import AddCommentForm from "./AddCommentForm";

interface CommentProps {
  comment: CommentType;
  onDelete: (commentId: string) => void;
  isOwner: boolean;
  onReply: (parentCommentId: string, comment: CommentType) => void;
  replies: CommentType[];
}

const Comment: React.FC<CommentProps> = ({
  comment,
  onDelete,
  isOwner,
  onReply,
  replies,
}) => {
  const { user } = useUser();
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const handleReplySubmit = (reply: CommentType) => {
    onReply(comment.comment_id, reply);
    setIsReplying(false);
    setShowReplies(true);
  };

  return (
    <div className="flex items-start space-x-4 space-y-4 mb-4">
      <div className="relative space-y-6">
        <Avatar>
          <AvatarImage src={comment.user.image_url} />
          <AvatarFallback>{comment.user.fullname[0]}</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex-1">
        <div className="bg-card text-card-foreground p-4 rounded-lg shadow">
          <div className="font-bold">{comment.user.fullname}</div>
          <div>{comment.content}</div>
        </div>
        <div className="flex items-center space-x-2 mt-2">
          {user && !comment.parent_comment_id && (
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
              onClick={() => onDelete(comment.comment_id)}
            >
              Delete
            </Button>
          )}
          {replies.length > 0 && (
            <button
              className="text-green-600 dark:text-green-400"
              onClick={() => setShowReplies(!showReplies)}
            >
              {showReplies ? "Hide replies" : `Show replies (${replies.length})`}
            </button>
          )}
        </div>
        {isReplying && (
          <AddCommentForm
            issueId={comment.issue_id}
            parentCommentId={comment.comment_id}
            onCommentAdded={handleReplySubmit}
          />
        )}
        {showReplies && (
          <div className="ml-8">
            {replies.map((reply) => (
              <Comment
                key={reply.comment_id}
                comment={reply}
                onDelete={onDelete}
                isOwner={user?.user_id === reply.user.user_id}
                onReply={onReply}
                replies={[]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
