import React, { useState } from "react";
import { useMutation, useQueryClient, InvalidateQueryFilters } from '@tanstack/react-query';
import { useUser } from "@/lib/contexts/UserContext";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import TextareaAutosize from "react-textarea-autosize";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { checkContentAppropriateness } from "@/lib/api/checkContentAppropriateness";
import { AddComment } from "@/lib/api/AddComment";

// TODO: Update extracted type to match this and use it
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
  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error("User");
      }
      
      const isContentAppropriate = await checkContentAppropriateness(content);
      if (!isContentAppropriate) {
        throw new Error("Language");
      }
      
      return await AddComment(user, issueId, content, isAnonymous, parentCommentId);
    },
    onSuccess: (responseData) => {
      toast({
        description: "Comment posted successfully",
      });
      
      onCommentAdded(responseData);
      setContent("");
  
      queryClient.invalidateQueries([`add_comment_${user?.user_id}_${issueId}`] as InvalidateQueryFilters);
    },
    onError: (error) => {
      if (error.message === "Language") {
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
          variant: "destructive",
          description: "Failed to post comment",
        });
        
        console.error("Failed to post comment:", error);
      }
    }
  });

  return (
    <form
      onSubmit={mutation.mutate}
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
          {mutation.isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin text-white"/>}
        </Button>
      </div>
    </form>
  );
};

export default AddCommentForm;
