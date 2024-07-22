import { Comment as CommentType } from "@/lib/types";
import Comment from "./Comment";
import { useUser } from "@/lib/contexts/UserContext";
import AddCommentForm from "./AddCommentForm";
import { LazyList } from "../LazyList/LazyList";
import { Loader2 } from "lucide-react";
import { v4 as v4uuid } from "uuid";

const FETCH_SIZE = 1;

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
      console.log(`fetched comments for ${parentCommentId}`);
      console.log(responseData.data);
      return responseData.data as CommentType[];
    } else {
      console.error("Failed to fetch comments:", responseData.error);
      return [];
    }
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

  const scrollId = `comments_scroll${v4uuid()}`;

  return (
    <div className="pt-4" id={scrollId}>
      {showAddComment && (
          <AddCommentForm
          issueId={issueId}
          parentCommentId={parentCommentId}
          onCommentAdded={() => {}}
        />
      )}
      {showComments && (
        <LazyList
          pageSize={FETCH_SIZE}
          fetcher={fetchComments}
          Item={({ data: comment }) => ( <Comment comment={comment}/>
          )}
          Loading={LoadingIndicator}
          Empty={EmptyIndicator}
          parentId={scrollId}
        />
      )}
    </div>
  );
};

export default CommentList;
