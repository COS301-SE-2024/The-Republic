import { Comment } from "../models/comment";
import supabase from "../services/supabaseClient";

export class CommentRepository {
  async getNumComments(issue_id: number): Promise<{ count: number }> {
    const { count, error } = await supabase
      .from("comment")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("issue_id", issue_id);

    if (error) throw error;

    return { count: count! };
  }

  async getComments({
    issue_id,
    from,
    amount
  }: {
    issue_id: number,
    from: number,
    amount: number
  }): Promise<Comment[]> {
    const { data, error } = await supabase
      .from("comment")
      .select(`
        *,
        user: user_id (
          user_id,
          email_address,
          username,
          fullname,
          image_url
        )
      `)
      .eq("issue_id", issue_id)
      .order("created_at", { ascending: false })
      .range(from, from + amount - 1);

    if (error) throw error;

    return data as Comment[];
  }

  async addComment({
    user_id,
    issue_id,
    content,
    is_anonymous,
  }: Partial<Comment>) {
    const { error } = await supabase
      .from("comment")
      .insert({
        user_id,
        issue_id,
        content,
        is_anonymous,
        created_at: new Date().toISOString(),
      });

    if (error) throw error;
  }

  async deleteComment({
    comment_id,
    user_id,
  }: Partial<Comment>) {
    if (!comment_id || !user_id) {
      throw 400;
    }

    const { error } = await supabase
      .from("comment")
      .delete()
      .eq("comment_id", comment_id)
      .eq("user_id", user_id);

    if (error) throw error;
  }
}
