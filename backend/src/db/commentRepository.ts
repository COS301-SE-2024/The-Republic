import { Comment } from "../models/comment";
import supabase from "../services/supabaseClient";
import { GetCommentsParams, } from "../types/comment";
import { APIError } from "../types/response";

export class CommentRepository {
  async getNumComments(issue_id: number, parent_id?: number) {
    let query = supabase
      .from("comment")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("issue_id", issue_id);

    query = !parent_id
      ? query.is("parent_id", null)
      : query.eq("parent_id", parent_id);

    const { count, error } = await query;

    if (error) {
      console.error(error);

      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred. Please try again later."
      });
    }

    return count!;
  }

  async getComments({
    issue_id,
    parent_id,
    user_id,
    from,
    amount
  }: GetCommentsParams) {
    let query = supabase
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

    query = !parent_id
      ? query.is("parent_id", null)
      : query.eq("parent_id", parent_id);

    const { data, error } = await query;

    if (error) {
      console.error(error);

      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred. Please try again later."
      });
    }

    const comments = data.map((comment: Comment) => {
      return {
        ...comment,
        is_owner: comment.user_id === user_id
      };
    });

    return comments as Comment[];
  }

  async addComment(comment: Partial<Comment>) {
    comment.created_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("comment")
      .insert(comment)
      .select()
      .single();

    if (error) {
      console.error(error);

      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred. Please try again later."
      });
    }

    return data as Comment;
  }

  async deleteComment(comment_id: number, user_id: string) {
    const { data, error } = await supabase
      .from("comment")
      .delete()
      .eq("comment_id", comment_id)
      .eq("user_id", user_id)
      .select()
      .maybeSingle();

    if (error) {
      console.error(error);

      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred. Please try again later."
      });
    }

    if (!data) {
      throw APIError({
        code: 404,
        success: false,
        error: "Comment does not exist"
      });
    }
  }
}
