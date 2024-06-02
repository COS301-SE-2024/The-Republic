import React, { useState } from "react";
import { supabase } from "@/lib/globals";

interface ReactionProps {
  issueId: number;
  initialReactions: { emoji: string; count: number }[];
}

const Reaction: React.FC<ReactionProps> = ({ issueId, initialReactions }) => {
  const [reactions, setReactions] = useState<{ emoji: string; count: number }[]>(initialReactions);

  const handleReaction = async (emoji: string) => {
    const { data, error } = await supabase.auth.getSession();

    if (error || data.session == null) {
      console.error("You need to be logged in to react");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/reactions", {
        method: "POST",
        body: JSON.stringify({
          issue_id: issueId,
          user_id: data.session.user.id,
          emoji,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.message === "Reaction removed") {
          setReactions((prevReactions) => {
            const reactionIndex = prevReactions.findIndex((r) => r.emoji === emoji);
            if (reactionIndex > -1) {
              const newReactions = [...prevReactions];
              newReactions[reactionIndex].count -= 1;
              if (newReactions[reactionIndex].count <= 0) {
                newReactions.splice(reactionIndex, 1);
              }
              return newReactions;
            }
            return prevReactions;
          });
        } else {
          setReactions((prevReactions) => {
            const existingReaction = prevReactions.find((r) => r.emoji === emoji);
            if (existingReaction) {
              return prevReactions.map((r) =>
                r.emoji === emoji ? { ...r, count: r.count + 1 } : r
              );
            } else {
              return [...prevReactions, { emoji, count: 1 }];
            }
          });
        }
      } else {
        console.error("Failed to add reaction");
      }
    } catch (error) {
      console.error("Error adding reaction:", error);
    }
  };

  const reactionCounts = reactions.reduce((acc, reaction) => {
    acc[reaction.emoji] = reaction.count;
    return acc;
  }, {} as { [key: string]: number });

  return (
    <div className="flex space-x-2">
      {["😠", "😃", "😢", "😟"].map((emoji) => (
        <button key={emoji} onClick={() => handleReaction(emoji)}>
          {emoji} {reactionCounts[emoji] || 0}
        </button>
      ))}
    </div>
  );
};

export default Reaction;
