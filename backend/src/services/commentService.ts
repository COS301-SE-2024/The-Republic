import { CommentRepository } from "../db/commentRepository";
import { Comment } from "../models/comment";
import { GetCommentsParams } from "../types/comment";
import { APIError } from "../types/response";

export class CommentService {
  private commentRepository = new CommentRepository();

  async getNumComments({ issue_id, parent_id }: Partial<GetCommentsParams>) {
    if (!issue_id) {
      throw APIError({
        code: 400,
        success: false,
        error: "Missing required fields for getting number of comments"
      });
    }

    return this.commentRepository.getNumComments(issue_id, parent_id);
  }

  async getComments(params: GetCommentsParams) {
    if (
      !params.issue_id ||
      !params.amount ||
      params.from === undefined
    ) {
      throw APIError({
        code: 400,
        success: false,
        error: "Missing required fields for getting comments"
      });
    }

    return this.commentRepository.getComments(params);
  }

  async addComment(comment: Partial<Comment>) {
    if (!comment.user_id) {
      throw APIError({
        code: 401,
        success: false,
        error: "You need to be signed in to create a comment"
      });
    }

    if (
      !comment.issue_id ||
      !comment.content ||
      comment.is_anonymous === undefined
    ) {
      throw APIError({
        code: 400,
        success: false,
        error: "Missing required fields for creating a comment"
      });
    }

    comment.parent_id ??= null;
    delete comment.comment_id;

    return this.commentRepository.addComment(comment);
  }

  async deleteComment({ comment_id, user_id }: Partial<Comment>) {
    if (!user_id) {
      throw APIError({
        code: 401,
        success: false,
        error: "You need to be signed in to delete a comment"
      });
    }

    if (!comment_id) {
      throw APIError({
        code: 400,
        success: false,
        error: "Missing required fields for deleting a comment"
      });
    }

    return this.commentRepository.deleteComment(comment_id, user_id);
  }
}
