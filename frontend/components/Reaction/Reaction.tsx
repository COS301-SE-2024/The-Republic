import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/globals";

interface ReactionProps {
  issueId: number;
  initialReactions: { emoji: string; count: number }[];
  userReaction: string | null;
}

const Reaction: React.FC<ReactionProps> = ({ issueId, initialReactions, userReaction }) => {
  const [reactions, setReactions] = useState<{ [key: string]: number }>(() =>
    initialReactions.reduce(
      (acc, reaction) => {
        acc[reaction.emoji] = reaction.count;
        return acc;
      },
      {} as { [key: string]: number }
    )
  );
  const [activeReaction, setActiveReaction] = useState<string | null>(null);

  useEffect(() => {
    setActiveReaction(userReaction);
  }, [userReaction]);

  //console.log("User reaction prop:", userReaction);


  const handleReaction = async (emoji: string) => {
    const { data, error } = await supabase.auth.getSession();

    if (error || data.session == null) {
      console.error("You need to be logged in to react");
      return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reactions`, {
      method: "POST",
      body: JSON.stringify({
        issue_id: issueId,
        emoji,
      }),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${data.session!.access_token}`
      },
    });

    if (!response.ok) {
      console.error("Failed to update reaction");
      return;
    }

    const apiResponse = await response.json();
    const reactionsUpdate = apiResponse.data;

    console.log(apiResponse);

    if (reactionsUpdate.added) {
      reactions[reactionsUpdate.added] ??= 0;
      reactions[reactionsUpdate.added]++;
      setActiveReaction(reactionsUpdate.added);
    }

    if (reactionsUpdate.removed) {
      reactions[reactionsUpdate.removed]--;
      setActiveReaction(null);
    }

    setReactions({ ...reactions });
  };

  return (
    <div className="flex space-x-2">
      {["😠", "😃", "😢", "😟"].map((emoji) => (
        <button
          key={emoji}
          onClick={() => handleReaction(emoji)}
          className={`flex items-center space-x-1 p-2 rounded-full ${
            activeReaction === emoji ? "bg-green-200 text-green-600" : "bg-gray-200 text-gray-600"
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
