import { Comment as CommentType } from "@/lib/types";
import Comment from "./Comment";
import { useUser } from "@/lib/contexts/UserContext";
import AddCommentForm from "./AddCommentForm";
import { LazyList, LazyListRef } from "../LazyList/LazyList";
import { Loader2 } from "lucide-react";
import { v4 as v4uuid } from "uuid";
import { useRef } from "react";

const FETCH_SIZE = 2;

// TODO: Update extracted type to match this and use it
interface CommentListProps {
  issueId: number;
  parentCommentId: number | null;
  showAddComment?: boolean;
  showComments?: boolean;
}

const CommentList: React.FC<CommentListProps> = ({
  issueId,
  parentCommentId,
  showAddComment = true,
  showComments = true,
}) => {
  const { user } = useUser();
  const lazyRef = useRef<LazyListRef<CommentType>>(null);

  // Move to @/lib/api/
  const fetchComments = async (from: number, amount: number) => {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (user) {
      headers.Authorization = `Bearer ${user.access_token}`;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/comments`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          from,
          amount,
          issue_id: issueId,
          parent_id: parentCommentId
        }),
      },
    );

    const responseData = await response.json();

    if (responseData.success) {
      return responseData.data as CommentType[];
    } else {
      throw new Error(responseData.error);
    }
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
