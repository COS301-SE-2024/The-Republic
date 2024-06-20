import React, { useState } from "react";
import { useUser } from "@/lib/contexts/UserContext";
import { useToast } from "@/components/ui/use-toast";
import { Comment } from "@/lib/types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import TextareaAutosize from 'react-textarea-autosize';
import { Checkbox } from "@/components/ui/checkbox";

interface AddCommentFormProps {
  issueId: string;
  parentCommentId?: string;
  onCommentAdded: (comment: Comment) => void;
}

const AddCommentForm: React.FC<AddCommentFormProps> = ({ issueId, parentCommentId = null, onCommentAdded }) => {
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
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

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/comments/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.access_token}`
        },
        body: JSON.stringify({
          issue_id: issueId,
          content,
          is_anonymous: isAnonymous,
          parent_id: parentCommentId,
        }),
      });

      const responseData = await response.json();
      if (responseData.success) {
        onCommentAdded(responseData.data);
        setContent("");
        toast({
          description: "Comment posted successfully",
        });
      } else {
        console.error("Failed to post comment:", responseData.error);
        toast({
          description: "Failed to post comment",
        });
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      toast({
        description: "Error posting comment",
      });
    }
  };

  return (
    <form onSubmit={handleCommentSubmit} className="flex flex-col space-y-4 mt-4 p-4 rounded shadow bg-card dark:bg-card">
      <div className="flex items-center space-x-3">
        {user && (
          <Avatar>
            <AvatarImage src={user.image_url} />
            <AvatarFallback>{user.fullname[0]}</AvatarFallback>
          </Avatar>
        )}
        <TextareaAutosize
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-grow p-2 border rounded resize-none bg-background text-foreground dark:bg-background dark:text-foreground"
          placeholder="Add Comment..."
          rows={1}
        />
      </div>
      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-2">
          <Checkbox checked={isAnonymous} onCheckedChange={(state) => setIsAnonymous(state as boolean)} />
          <span>Post anonymously</span>
        </label>
        <Button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded" disabled={!content.trim()}>
          Send
        </Button>
      </div>
    </form>
  );
};

export default AddCommentForm;
