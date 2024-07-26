import { Reaction } from "@/modules/reactions/models/reaction";
import supabase from "@/utils/supabaseClient";
import { APIError } from "@/types/response";

export default class ReactionRepository {
  async addReaction(reaction: Partial<Reaction>) {
    reaction.created_at = new Date().toISOString();
    const { data, error } = await supabase
      .from("reaction")
      .insert(reaction)
      .select()
      .single();

    if (error) {
      console.error(error);

      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      });
    }

    return data as Reaction;
  }

  async deleteReaction(issueId: number, userId: string) {
    const { data, error } = await supabase
      .from("reaction")
      .delete()
      .eq("issue_id", issueId)
      .eq("user_id", userId)
      .select()
      .maybeSingle();

    if (error) {
      console.error(error);

      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      });
    }

    if (!data) {
      throw APIError({
        code: 404,
        success: false,
        error: "Reaction does not exist",
      });
    }

    return data as Reaction;
  }

  async getReactionByUserAndIssue(issueId: number, userId: string) {
    const { data, error } = await supabase
      .from("reaction")
      .select("*")
      .eq("issue_id", issueId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error(error);

      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      });
    }

    return data as Reaction | null;
  }

  async getReactionCountsByIssueId(issueId: number) {
    const { data, error } = await supabase
      .from("reaction")
      .select("emoji")
      .eq("issue_id", issueId);

    if (error) {
      console.error(error);

      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      });
    }

    // Aggregate the counts manually
    const reactionCounts: { [emoji: string]: number } = {};

    data.forEach((reaction: { emoji: string }) => {
      if (!reactionCounts[reaction.emoji]) {
        reactionCounts[reaction.emoji] = 0;
      }
      reactionCounts[reaction.emoji]++;
    });

    // Convert the aggregated counts into an array
    return Object.keys(reactionCounts).map((emoji) => ({
      emoji,
      count: reactionCounts[emoji],
    }));
  }
}
