import { Comment } from "@/modules/shared/models/comment";
import supabase from "@/modules/shared/services/supabaseClient";
import { GetCommentsParams } from "@/types/comment";
import { APIError } from "@/types/response";

export class CommentRepository {
  async getNumComments(
    itemId: string,
    itemType: "issue" | "post",
    parent_id?: number,
  ) {
    let query = supabase
      .from("comment")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq(itemType === "issue" ? "issue_id" : "post_id", itemId);

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

  async getComments({
    itemId,
    itemType,
    user_id,
    from,
    amount,
    parent_id,
  }: GetCommentsParams) {
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
          image_url,
          user_score
        )
      `,
      )
      .eq(itemType === "issue" ? "issue_id" : "post_id", itemId)
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

  async getCommentCountByUser(userId: string, startDate: Date, endDate: Date): Promise<number> {
    const { count, error } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    if (error) {
      console.error('Error getting comment count:', error);
      throw APIError({
        code: 500,
        success: false,
        error: 'An error occurred while getting comment count.',
      });
    }

    return count || 0;
  }
}
