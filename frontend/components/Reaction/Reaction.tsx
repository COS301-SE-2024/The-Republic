import React, { useState, useEffect } from "react";
import { ReactionProps } from "@/lib/types";
import { useUser } from "@/lib/contexts/UserContext";
import { useMutation } from '@tanstack/react-query';

import { handleReaction } from "@/lib/api/handleReaction";

const Reaction: React.FC<ReactionProps> = ({
  issueId,
  initialReactions,
  userReaction,
}) => {
  const { user } = useUser();
  const [activeReaction, setActiveReaction] = useState<string | null>(userReaction);
  const [reactions, setReactions] = useState<{ [key: string]: number }>(() =>
    initialReactions.reduce(
      (acc, reaction) => {
        acc[reaction.emoji] = reaction.count;
        return acc;
      },
      {} as { [key: string]: number },
    ),
  );

  const mutation = useMutation({
    mutationFn: async (emoji: string) => {
      if (user) {
        return await handleReaction(user, issueId, emoji);
      } else {
        console.error("You need to be logged in to react");
      }
    },
    onSuccess: (reactionsUpdate) => {
      if (reactionsUpdate) {
        if (reactionsUpdate.added) {
          reactions[reactionsUpdate.added] ??= 0;
          reactions[reactionsUpdate.added]++;
          setActiveReaction(String(reactionsUpdate.added));
        }
    
        if (reactionsUpdate.removed) {
          reactions[reactionsUpdate.removed]--;
          setActiveReaction(null);
        }
      }
  
      setReactions({ ...reactions });
    },
    onError: (error) => {
      console.error("Failed to update reaction: ", error);
    }
  });

  const reactNow = async (emoji: string) => {
    mutation.mutate(emoji);
  };

  useEffect(() => {
    setActiveReaction(userReaction);
  }, [userReaction]);

  return (
    <div className="flex space-x-2">
      {["😠", "😃", "😢", "😟"].map((emoji) => (
        <button
          key={emoji}
          onClick={() => reactNow(emoji)}
          className={`flex items-center space-x-1 p-2 rounded-full ${
            activeReaction === emoji
              ? "bg-green-200 text-green-600"
              : "text-gray-600 dark:text-white"
          }`}
        >
          <span>{emoji}</span>
          <span>{reactions[emoji] || 0}</span>
        </button>
      ))}
    </div>
  );
};

export default Reaction;
