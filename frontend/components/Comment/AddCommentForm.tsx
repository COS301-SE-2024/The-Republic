import React, { useState } from "react";
import { useUser } from "@/lib/contexts/UserContext";
import { useToast } from "@/components/ui/use-toast";
import { Comment } from "@/lib/types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import TextareaAutosize from "react-textarea-autosize";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { checkContentAppropriateness } from "@/lib/api/checkContentAppropriateness";

interface AddCommentFormProps {
  issueId: number;
  parentCommentId: number | null;
  onCommentAdded: (comment: Comment) => void;
}

const AddCommentForm: React.FC<AddCommentFormProps> = ({
  issueId,
  parentCommentId = null,
  onCommentAdded,
}) => {
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const { toast } = useToast();

  // This is how I think this would work before reading the docs,
  // but it seems cause a full page reload.
  /* const mutation = useMutation({
    mutationFn: async () => {
      const isContentAppropriate = await checkContentAppropriateness(content);
      if (!isContentAppropriate) {
        throw new Error("Content");
      }

      if (!user) {
        throw new Error("User");
      }

      return await AddComment(
        user,
        issueId,
        content,
        isAnonymous,
        parentCommentId,
      );
    },
    onSuccess: (responseData) => {
      setContent("");
      setIsAnonymous(false);

      toast({
        description: "Comment posted successfully",
      });

      onCommentAdded(responseData);

      queryClient.invalidateQueries([
        `add_comment_${user?.user_id}_${issueId}`,
      ] as InvalidateQueryFilters);
    },
    onError: (error) => {
      if (error.message === "Content") {
        toast({
          variant: "destructive",
          description: "Please use appropriate language.",
        });
      } else if (error.message === "User") {
        toast({
          description: "You need to be logged in to comment",
        });
      } else {
        toast({
          description: "Failed to post comment",
        });

        console.error("Failed to post comment:", error);
      }
    },
  }); */

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        description: "You need to be logged in to comment",
      });
      return;
    }

    setIsLoading(true);

    const isContentAppropriate = await checkContentAppropriateness(content);
    if (!isContentAppropriate) {
      setIsLoading(false);
      toast({
        variant: "destructive",
        description: "Please use appropriate language.",
      });
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/comments/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.access_token}`,
          },
          body: JSON.stringify({
            issue_id: issueId,
            content,
            is_anonymous: isAnonymous,
            parent_id: parentCommentId,
          }),
        },
      );

      const responseData = await response.json();
      if (responseData.success) {
        setContent("");
        toast({
          description: "Comment posted successfully",
        });

        onCommentAdded(responseData.data);
      } else {
        console.error("Failed to post comment:", responseData.error);
        toast({
          variant: "destructive",
          description: "Failed to post comment",
        });
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      toast({
        description: "Error posting comment",
      });
    }

    setIsLoading(false);
  };

  return (
    <form
      onSubmit={handleCommentSubmit}
      className="flex flex-col space-y-4 mb-4 p-4 rounded shadow bg-card dark:bg-card"
    >
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
          <Checkbox
            checked={isAnonymous}
            onCheckedChange={(state) => setIsAnonymous(state as boolean)}
          />
          <span>Post anonymously</span>
        </label>
        <Button
          type="submit"
          className="bg-primary text-primary-foreground px-4 py-2 rounded"
          disabled={!content.trim()}
        >
          Send
          {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin text-white"/>}
        </Button>
      </div>
    </form>
  );
};

export default AddCommentForm;
