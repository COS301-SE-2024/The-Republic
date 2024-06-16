import React, { useState } from "react";
import { useUser } from "@/lib/contexts/UserContext";
import { useToast } from "@/components/ui/use-toast";
import { mockComments } from "@/lib/mock";
import { Comment } from "@/lib/types";

interface AddCommentFormProps {
  issueId: string;
  parentCommentId?: string;
  onCommentAdded: (comment: Comment) => void;
}

const AddCommentForm: React.FC<AddCommentFormProps> = ({ issueId, parentCommentId = null, onCommentAdded }) => {
  const [content, setContent] = useState("");
  const { user } = useUser();
  const { toast } = useToast();

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        description: "You need to be logged in to comment",
      });
      return;
    }

    const newComment: Comment = {
      comment_id: (mockComments.length + 1).toString(),
      issue_id: issueId,
      user_id: user.user_id,
      parent_comment_id: parentCommentId,
      content,
      created_at: new Date().toISOString(),
      user: {
        user_id: user.user_id,
        fullname: user.fullname,
        image_url: user.image_url,
        username: "mock",
        email_address: "mock@example.com",
      },
    };

    mockComments.push(newComment);
    onCommentAdded(newComment);
    setContent("");
    toast({
      description: "Comment posted successfully",
    });
  };

  return (
    <form onSubmit={handleCommentSubmit} className="flex items-center space-x-2 mt-4 bg-card dark:bg-card p-4 rounded shadow">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-grow p-2 border rounded resize-none bg-background text-foreground dark:bg-background dark:text-foreground"
        placeholder="Add Comment..."
        rows={1}
      />
      <button
        type="submit"
        className="bg-primary text-primary-foreground px-4 py-2 rounded"
        disabled={!content.trim()}
      >
        Send
      </button>
    </form>
  );
};

export default AddCommentForm;
