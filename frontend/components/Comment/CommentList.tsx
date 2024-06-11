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
  const [expandedThreads, setExpandedThreads] = useState<string[]>([]);

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

  const handleReplyClick = (commentId: string) => {
    setReplyingCommentId(commentId);
  };

  const toggleThreadExpansion = (commentId: string) => {
    setExpandedThreads((prevExpandedThreads) =>
      prevExpandedThreads.includes(commentId)
        ? prevExpandedThreads.filter((id) => id !== commentId)
        : [...prevExpandedThreads, commentId]
    );
  };

  const renderComments = (parentId: string | null, level: number = 0) => {
    const threadComments = comments.filter((comment) => comment.parent_comment_id === parentId);

    if (parentId === null) {
      // Top-level comments
      return (
        <>
          {threadComments.map((comment) => (
            <div key={comment.comment_id} style={{ marginLeft: `${level * 20}px` }} className="relative">
              <Comment
                comment={comment}
                onDelete={handleDeleteComment}
                isOwner={user?.user_id === comment.user.user_id}
                onReply={handleReply}
                onReplyClick={handleReplyClick}
                isReplying={replyingCommentId === comment.comment_id}
                hasReplies={comments.some(c => c.parent_comment_id === comment.comment_id)}
                isLastComment={false}
              />
              {comments.some(c => c.parent_comment_id === comment.comment_id) && (
                <button onClick={() => toggleThreadExpansion(comment.comment_id)} className="text-blue-500 ml-6">
                  {expandedThreads.includes(comment.comment_id) ? "Hide replies" : "Show replies"}
                </button>
              )}
              {expandedThreads.includes(comment.comment_id) && renderComments(comment.comment_id, level + 1)}
            </div>
          ))}
        </>
      );
    } else {
      // Nested comments (replies)
      return (
        <>
          {threadComments.map((comment, index) => (
            <div key={comment.comment_id} style={{ marginLeft: `${level * 20}px` }} className="relative">
              <Comment
                comment={comment}
                onDelete={handleDeleteComment}
                isOwner={user?.user_id === comment.user.user_id}
                onReply={handleReply}
                onReplyClick={handleReplyClick}
                isReplying={replyingCommentId === comment.comment_id}
                hasReplies={comments.some(c => c.parent_comment_id === comment.comment_id)}
                isLastComment={index === threadComments.length - 1}
              />
              {renderComments(comment.comment_id, level + 1)}
            </div>
          ))}
        </>
      );
    }
  };

  return <div>{renderComments(null)}</div>;
};

export default CommentList;
