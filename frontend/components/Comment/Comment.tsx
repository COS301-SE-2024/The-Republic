import React from "react";
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
  onReplyClick: (commentId: string) => void;
  isReplying: boolean;
  hasReplies: boolean;
  isLastComment: boolean;
}

const Comment: React.FC<CommentProps> = ({
  comment,
  onDelete,
  isOwner,
  onReply,
  onReplyClick,
  isReplying,
  hasReplies,
  isLastComment,
}) => {
  const { user } = useUser();

  const handleReplySubmit = (reply: CommentType) => {
    onReply(comment.comment_id, reply);
    onReplyClick("");
  };

  return (
    <div className="flex items-start space-x-4 mb-4">
      <div className="relative">
        <Avatar>
          <AvatarImage src={comment.user.image_url} />
          <AvatarFallback>{comment.user.fullname[0]}</AvatarFallback>
        </Avatar>
        {hasReplies && !isLastComment && (
          <div
            className={`absolute top-10 left-1/2 w-px bg-gray-300 h-full transform -translate-x-1/2`}
          ></div>
        )}
      </div>
      <div>
        <div className="bg-gray-100 p-2 rounded-lg">
          <div className="font-bold">{comment.user.fullname}</div>
          <div>{comment.content}</div>
        </div>
        <div className="flex items-center space-x-2 mt-2">
          {user && (
            <Button variant="ghost" size="sm" onClick={() => onReplyClick(comment.comment_id)}>
              Reply
            </Button>
          )}
          {isOwner && (
            <Button variant="ghost" size="sm" onClick={() => onDelete(comment.comment_id)}>
              Delete
            </Button>
          )}
        </div>
        {isReplying && (
          <AddCommentForm
            issueId={comment.issue_id}
            parentCommentId={comment.comment_id}
            onCommentAdded={handleReplySubmit}
          />
        )}
      </div>
    </div>
  );
};

export default Comment;
