import React, { useState } from "react";
import { supabase } from "@/lib/globals";

interface ReactionProps {
  issueId: number;
  initialReactions: { emoji: string; count: number }[];
}

const Reaction: React.FC<ReactionProps> = ({ issueId, initialReactions }) => {
  const [reactions, setReactions] = useState(() =>
    initialReactions.reduce(
      (acc, reaction) => {
        acc[reaction.emoji] = reaction.count;
        return acc;
      },
      {} as { [key: string]: number }
    )
  );

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

    if (reactionsUpdate.added) {
      reactions[reactionsUpdate.added] ??= 0;
      reactions[reactionsUpdate.added]++;
    }

    if (reactionsUpdate.removed) {
      reactions[reactionsUpdate.removed]--;
    }

    setReactions({...reactions});
  };

  return (
    <div className="flex space-x-2">
      {["😠", "😃", "😢", "😟"].map((emoji) => (
        <button
          key={emoji}
          onClick={() => handleReaction(emoji)}
          className={`flex items-center space-x-1 p-2 rounded-full ${
            reactions[emoji] ? "bg-green-200 text-green-600" : "bg-gray-200 text-gray-600"
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