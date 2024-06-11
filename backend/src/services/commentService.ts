import { CommentRepository } from "../db/commentRepository";
import { Comment } from "../models/comment";

export class CommentService {
  private commentRepository = new CommentRepository();

  async getNumComments(issue_id: number): Promise<{ count: number }> {
    return await this.commentRepository.getNumComments(issue_id);
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
    return await this.commentRepository.getComments({
      issue_id,
      from,
      amount
    });
  }
}
