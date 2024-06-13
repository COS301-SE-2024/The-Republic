import { CommentRepository } from "../db/commentRepository";
import { Comment } from "../models/comment";
import { GetCommentsParams, GetNumCommentsParams } from "../types/comment";
import { Count } from "../types/shared";

export class CommentService {
  private commentRepository = new CommentRepository();

  async getNumComments({
    issue_id,
    parent_id
  }: GetNumCommentsParams): Promise<Count> {
    return await this.commentRepository.getNumComments({
      issue_id,
      parent_id
    });
  }

  async getComments({
    issue_id,
    parent_id,
    from,
    amount
  }: GetCommentsParams): Promise<Comment[]> {
    return await this.commentRepository.getComments({
      issue_id,
      parent_id,
      from,
      amount
    });
  }

  async addComment({
    user_id,
    issue_id,
    parent_id,
    content,
    is_anonymous,
  }: Partial<Comment>) {
    if (
      !user_id ||
      !issue_id ||
      !content ||
      is_anonymous === undefined
    ) {
      throw 400;
    }

    return await this.commentRepository.addComment({
      user_id,
      issue_id,
      parent_id,
      content,
      is_anonymous,
    });
  }

  async deleteComment({
    comment_id,
    user_id,
  }: Partial<Comment>) {
    return await this.commentRepository.deleteComment({
      comment_id,
      user_id,
    });
  }
}
