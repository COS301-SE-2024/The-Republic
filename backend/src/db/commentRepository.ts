import { Comment } from "../models/comment";
import supabase from "../services/supabaseClient";
import { GetCommentsParams } from "../types/comment";
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
        error: "An unexpected error occurred. Please try again later.",
      });
    }

    return count!;
  }

  async getComments({ issue_id, user_id, from, amount, parent_id }: GetCommentsParams) {
    let query = supabase
      .from("comment")
      .select(
        `
        *,
        user: user_id (
          user_id,
          email_address,
          username,
          fullname,
          image_url
        )
      `,
      )
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
        error: "An unexpected error occurred. Please try again later.",
      });
    }

    const comments = data.map((comment: Comment) => {
      const isOwner = comment.is_anonymous
        ? comment.user_id === user_id
        : comment.user_id === user_id;

      return {
        ...comment,
        is_owner: isOwner,
        user: comment.is_anonymous
          ? {
              user_id: null,
              email_address: null,
              username: "Anonymous",
              fullname: "Anonymous",
              image_url: null,
            }
          : comment.user,
      };
    });

    return comments as Comment[];
  }

  async addComment(comment: Partial<Comment>) {
    comment.created_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("comment")
      .insert(comment)
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
      .single();

    if (error) {
      console.error(error);

      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      });
    }

    return {
      ...data,
      is_owner: true,
      user: data.is_anonymous
        ? {
            user_id: null,
            email_address: null,
            username: "Anonymous",
            fullname: "Anonymous",
            image_url: null,
          }
        : data.user,
    } as Comment;
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
        error: "An unexpected error occurred. Please try again later.",
      });
    }

    if (!data) {
      throw APIError({
        code: 404,
        success: false,
        error: "Comment does not exist",
      });
    }
  }
}
