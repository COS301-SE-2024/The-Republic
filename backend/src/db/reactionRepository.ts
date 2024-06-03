import supabase from "../services/supabaseClient";
import { DateTime } from 'luxon';

export interface Reaction {
  reaction_id: number;
  issue_id: number;
  user_id: string;
  emoji: string;
  created_at: string;
}

export default class ReactionRepository {
  async addReaction(issueId: number, userId: string, emoji: string): Promise<Reaction> {
    const { data, error } = await supabase
      .from("reaction")
      .insert({
        issue_id: issueId,
        user_id: userId,
        emoji: emoji,
        created_at: DateTime.now().setZone('UTC+2').toISO()
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Reaction;
  }

  async getReactionsByUserAndIssue(issueId: number, userId: string): Promise<Reaction[]> {
    const { data, error } = await supabase
      .from("reaction")
      .select("*")
      .eq("issue_id", issueId)
      .eq("user_id", userId);

    if (error) throw new Error(error.message);
    return data as Reaction[];
  }

  async deleteReaction(issueId: number, userId: string, emoji: string): Promise<void> {
    const { error } = await supabase
      .from("reaction")
      .delete()
      .eq("issue_id", issueId)
      .eq("user_id", userId)
      .eq("emoji", emoji);
    if (error) throw new Error(error.message);
  }

  async getReactionCountsByIssueId(issueId: number): Promise<{ emoji: string; count: number }[]> {
    const { data, error } = await supabase
      .from("reaction")
      .select("emoji")
      .eq("issue_id", issueId);

    if (error) throw new Error(error.message);

    // Aggregate the counts manually
    const reactionCounts: { [emoji: string]: number } = {};

    data.forEach((reaction: { emoji: string }) => {
      if (!reactionCounts[reaction.emoji]) {
        reactionCounts[reaction.emoji] = 0;
      }
      reactionCounts[reaction.emoji]++;
    });

    // Convert the aggregated counts into an array
    return Object.keys(reactionCounts).map(emoji => ({
      emoji,
      count: reactionCounts[emoji]
    }));
  }
}
