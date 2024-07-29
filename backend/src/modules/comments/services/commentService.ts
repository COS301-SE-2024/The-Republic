import { CommentRepository } from "@/modules/comments/repositories/commentRepository";
import { Comment } from "@/modules/shared/models/comment";
import { GetCommentsParams } from "@/types/comment";
import { APIData, APIError } from "@/types/response";
import { PointsService } from "@/modules/points/services/pointsService";

export class CommentService {
  private commentRepository = new CommentRepository();
  private pointsService = new PointsService();

  setCommentRepository(commentRepository: CommentRepository): void {
    this.commentRepository = commentRepository;
  }

  async getNumComments({ issue_id, parent_id }: Partial<GetCommentsParams>) {
    if (!issue_id) {
      throw APIError({
        code: 400,
        success: false,
        error: "Missing required fields for getting number of comments",
      });
    }

    const count = await this.commentRepository.getNumComments(
      issue_id,
      parent_id,
    );

    return APIData({
      code: 200,
      success: true,
      data: count!,
    });
  }

  async getComments(params: GetCommentsParams) {
    if (!params.issue_id || !params.amount || params.from === undefined) {
      throw APIError({
        code: 400,
        success: false,
        error: "Missing required fields for getting comments",
      });
    }

    const comments = await this.commentRepository.getComments(params);

    const commentsWithUserInfo = comments.map((comment) => {
      const isOwner = comment.user_id === params.user_id;

      if (comment.is_anonymous) {
        comment.user = {
          user_id: null,
          email_address: null,
          username: "Anonymous",
          fullname: "Anonymous",
          image_url: null,
          is_owner: isOwner,
          total_issues: null,
          resolved_issues: null,
        };
      } else {
        comment.user.is_owner = isOwner;
      }

      return {
        ...comment,
        is_owner: isOwner,
      };
    });

    return APIData({
      code: 200,
      success: true,
      data: commentsWithUserInfo,
    });
  }

  async addComment(comment: Partial<Comment>) {
    if (!comment.user_id) {
      throw APIError({
        code: 401,
        success: false,
        error: "You need to be signed in to create a comment",
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
        error: "Missing required fields for creating a comment",
      });
    }

    comment.parent_id ??= null;
    delete comment.comment_id;

    const addedComment = await this.commentRepository.addComment(comment);

    // Award points for adding a comment, but only if it's a top-level comment
    if (!comment.parent_id) {
      await this.pointsService.awardPoints(comment.user_id, 10, "Left a comment on an open issue");
    }

    return APIData({
      code: 201,
      success: true,
      data: addedComment,
    });
  }

  async deleteComment({ comment_id, user_id }: Partial<Comment>) {
    if (!user_id) {
      throw APIError({
        code: 401,
        success: false,
        error: "You need to be signed in to delete a comment",
      });
    }

    if (!comment_id) {
      throw APIError({
        code: 400,
        success: false,
        error: "Missing required fields for deleting a comment",
      });
    }

    await this.commentRepository.deleteComment(comment_id, user_id);

    return APIData({
      code: 204,
      success: true,
    });
  }
}
