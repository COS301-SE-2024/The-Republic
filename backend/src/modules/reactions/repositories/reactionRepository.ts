import { Reaction } from "@/modules/shared/models/reaction";
import supabase from "@/modules/shared/services/supabaseClient";
import { APIError } from "@/types/response";

export default class ReactionRepository {
  async addReaction(reaction: Partial<Reaction> & { itemType: 'issue' | 'post' }) {
    const reactionData = reaction;
    reactionData.created_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("reaction")
      .insert(reactionData)
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

  async deleteReaction(itemId: string, itemType: 'issue' | 'post', userId: string) {
    const { data, error } = await supabase
      .from("reaction")
      .delete()
      .eq(itemType === 'issue' ? "issue_id" : "post_id", itemId)
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

  async getReactionByUserAndItem(itemId: string, itemType: 'issue' | 'post', userId: string) {
    const { data, error } = await supabase
      .from("reaction")
      .select("*")
      .eq(itemType === 'issue' ? "issue_id" : "post_id", itemId)
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

  async getReactionCountsByItemId(itemId: string, itemType: 'issue' | 'post') {
    const { data, error } = await supabase
      .from("reaction")
      .select("emoji")
      .eq(itemType === 'issue' ? "issue_id" : "post_id", itemId);

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