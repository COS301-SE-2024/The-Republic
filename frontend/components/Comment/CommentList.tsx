import { Comment as CommentType, CommentListProps2 } from "@/lib/types";
import Comment from "./Comment";
import { useUser } from "@/lib/contexts/UserContext";
import AddCommentForm from "./AddCommentForm";
import { LazyList, LazyListRef } from "../LazyList/LazyList";
import { Loader2 } from "lucide-react";
import { v4 as v4uuid } from "uuid";
import { useRef } from "react";
import { fetchMoreComments } from "@/lib/api/fetchMoreComments";

const FETCH_SIZE = 2;

const CommentList: React.FC<CommentListProps2> = ({
  issueId,
  parentCommentId,
  showAddComment = true,
  showComments = true,
}) => {
  const { user } = useUser();
  const lazyRef = useRef<LazyListRef<CommentType>>(null);

  const fetchComments = async (from: number, amount: number) => {
    if (!user) {
      return [];
    }
    
    return fetchMoreComments(user, from, amount, issueId, parentCommentId);
  };

  const handleCommentAdded = (comment: CommentType) => {
    lazyRef.current?.add(comment);
  };

  const handleCommentDeleted = (comment: CommentType) => {
    lazyRef.current?.remove(comment);
  };

  const LoadingIndicator = () => (
    <div className="flex justify-center items-center h-32">
      <Loader2 className="h-6 w-6 animate-spin text-green-400" />
    </div>
  );

  const EmptyIndicator = () => (
    <div className="flex justify-center items-center h-32">
      <h3 className="text-lg">No comments</h3>
    </div>
  );

  const FailedIndicator = () => (
    <div className="flex justify-center items-center h-32">
      <h3 className="text-muted-foreground">Failed to fetch comments</h3>
    </div>
  );

  const scrollId = `comments_scroll${v4uuid()}`;

  return (
    <div className="pt-4" id={scrollId}>
      {showAddComment && (
          <AddCommentForm
          issueId={issueId}
          parentCommentId={parentCommentId}
          onCommentAdded={handleCommentAdded}
        />
      )}
      {showComments && (
        <LazyList
          pageSize={FETCH_SIZE}
          fetcher={fetchComments}
          fetchKey={[
            "fetch-comments",
            user,
            issueId,
            parentCommentId
          ]}
          Item={({ data: comment }) => (
            <Comment
              comment={comment}
              onCommentDeleted={handleCommentDeleted}
            />
          )}
          Failed={FailedIndicator}
          Loading={LoadingIndicator}
          Empty={EmptyIndicator}
          controlRef={lazyRef}
          parentId={scrollId}
        />
      )}
    </div>
  );
};

export default CommentList;