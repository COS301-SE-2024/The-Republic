
import React, { useEffect, useState } from "react";
import { Comment as CommentType } from "@/lib/types";
import Comment from "./Comment";
import { useUser } from "@/lib/contexts/UserContext";
import { mockComments } from "@/lib/mock";

interface CommentListProps {
  issueId: string;
}

const CommentList: React.FC<CommentListProps> = ({ issueId }) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const { user } = useUser();
  const [replyingCommentId, setReplyingCommentId] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      const filteredComments = mockComments.filter(comment => comment.issue_id === issueId);
      setComments(filteredComments);
    };

    fetchComments();
  }, [issueId]);

  const handleDeleteComment = (commentId: string) => {
    setComments((prevComments) => prevComments.filter((comment) => comment.comment_id !== commentId));
  };

  const handleReply = (parentCommentId: string, reply: CommentType) => {
    setComments((prevComments) => [...prevComments, reply]);
  };

  const getReplies = (parentCommentId: string) => {
    return comments.filter(comment => comment.parent_comment_id === parentCommentId);
  };

  return (
    <div>
      {comments.filter(comment => comment.parent_comment_id === null).map(comment => (
        <Comment
          key={comment.comment_id}
          comment={comment}
          onDelete={handleDeleteComment}
          isOwner={user?.user_id === comment.user.user_id}
          onReply={handleReply}
          replies={getReplies(comment.comment_id)}
        />
      ))}
    </div>
  );
};

export default CommentList;
