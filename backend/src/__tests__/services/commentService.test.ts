import { CommentService } from "@/modules/comments/services/commentService";
import { CommentRepository } from "@/modules/comments/repositories/commentRepository";
import { Comment } from "@/modules/shared/models/comment";
import { GetCommentsParams } from "@/types/comment";
import { APIError } from "@/types/response";
import { PointsService } from "@/modules/points/services/pointsService";

jest.mock("@/modules/comments/repositories/commentRepository");
jest.mock("@/modules/points/services/pointsService");

describe("CommentService", () => {
  let commentService: CommentService;
  let commentRepository: jest.Mocked<CommentRepository>;
  let mockPointsService: jest.Mocked<PointsService>;

  beforeEach(() => {
    commentRepository =
      new CommentRepository() as jest.Mocked<CommentRepository>;
    mockPointsService = {
      awardPoints: jest.fn().mockResolvedValue(100),
    } as unknown as jest.Mocked<PointsService>;

    commentService = new CommentService();
    commentService.setCommentRepository(commentRepository);
    commentService.setPointsService(mockPointsService);
  });

  describe("getNumComments", () => {
    it("should return the number of comments for an item", async () => {
      const params: Partial<GetCommentsParams> = {
        itemId: "1",
        itemType: "issue",
        user_id: "user1",
      };
      commentRepository.getNumComments.mockResolvedValue(10);

      const response = await commentService.getNumComments(params);

      expect(response.data).toBe(10);
      expect(commentRepository.getNumComments).toHaveBeenCalledWith(
        "1",
        "issue",
        undefined,
      );
      expect(commentRepository.getNumComments).toHaveBeenCalledTimes(1);
    });

    it("should throw an error when itemId is missing", async () => {
      const params: Partial<GetCommentsParams> = {
        itemType: "issue",
        user_id: "user1",
      };

      await expect(commentService.getNumComments(params)).rejects.toEqual(
        APIError({
          code: 400,
          success: false,
          error: "Missing required fields for getting number of comments",
        }),
      );
      expect(commentRepository.getNumComments).not.toHaveBeenCalled();
    });
  });

  describe("getComments", () => {
    it("should return comments for an item", async () => {
      const params: GetCommentsParams = {
        itemId: "1",
        itemType: "issue",
        from: 0,
        amount: 10,
        user_id: "user1",
      };
      const mockComments: Comment[] = [
        {
          comment_id: 1,
          issue_id: 1,
          user_id: "1",
          parent_id: null,
          content: "Comment 1",
          is_anonymous: false,
          created_at: "2022-01-01",
          user: {
            user_id: "1",
            email_address: "test@example.com",
            username: "testuser",
            fullname: "Test User",
            image_url: "https://example.com/image.png",
            is_owner: false,
            total_issues: 10,
            resolved_issues: 5,
            user_score: 0,
            location_id: null,
            location: null,
          },
          is_owner: false,
        },
      ];
      commentRepository.getComments.mockResolvedValue(mockComments);

      const response = await commentService.getComments(params);

      expect(response.data).toEqual(mockComments);
      expect(commentRepository.getComments).toHaveBeenCalledWith(params);
      expect(commentRepository.getComments).toHaveBeenCalledTimes(1);
    });

    it("should throw an error when required fields are missing", async () => {
      const params: Partial<GetCommentsParams> = {
        itemId: "1",
        itemType: "issue",
        user_id: "user1",
      };

      await expect(
        commentService.getComments(params as GetCommentsParams),
      ).rejects.toEqual(
        APIError({
          code: 400,
          success: false,
          error: "Missing required fields for getting comments",
        }),
      );
      expect(commentRepository.getComments).not.toHaveBeenCalled();
    });
  });

  describe("addComment", () => {
    it("should add a new comment", async () => {
      const newComment: Partial<Comment> = {
        issue_id: 1,
        user_id: "1",
        content: "New Comment",
        is_anonymous: false,
      };
      const addedComment: Comment = {
        comment_id: 1,
        issue_id: 1,
        user_id: "1",
        parent_id: null,
        content: "New Comment",
        is_anonymous: false,
        created_at: "2022-01-01",
        user: {
          user_id: "1",
          email_address: "test@example.com",
          username: "testuser",
          fullname: "Test User",
          image_url: "https://example.com/image.png",
          is_owner: true,
          total_issues: 10,
          resolved_issues: 5,
          user_score: 0,
          location_id: null,
          location: null,
        },
        is_owner: true,
      };
      commentRepository.addComment.mockResolvedValue(addedComment);

      const response = await commentService.addComment(newComment as Comment);

      expect(mockPointsService.awardPoints).toHaveBeenCalledWith(
        "1",
        10,
        "Left a comment",
      );
      expect(response.data).toEqual(addedComment);
      expect(commentRepository.addComment).toHaveBeenCalledWith(newComment);
      expect(commentRepository.addComment).toHaveBeenCalledTimes(1);
    });

    it("should throw an error when user_id is missing", async () => {
      const newComment: Partial<Comment> = {
        issue_id: 1,
        content: "New Comment",
        is_anonymous: false,
      };

      await expect(
        commentService.addComment(newComment as Comment),
      ).rejects.toEqual(
        APIError({
          code: 401,
          success: false,
          error: "You need to be signed in to create a comment",
        }),
      );
      expect(commentRepository.addComment).not.toHaveBeenCalled();
    });

    it("should throw an error when required fields are missing", async () => {
      const newComment: Partial<Comment> = {
        user_id: "1",
      };

      await expect(
        commentService.addComment(newComment as Comment),
      ).rejects.toEqual(
        APIError({
          code: 400,
          success: false,
          error: "Missing required fields for creating a comment",
        }),
      );
      expect(commentRepository.addComment).not.toHaveBeenCalled();
    });
  });

  describe("deleteComment", () => {
    it("should delete a comment", async () => {
      const deleteParams: Partial<Comment> = {
        comment_id: 1,
        user_id: "1",
      };
      commentRepository.deleteComment.mockResolvedValue();

      await commentService.deleteComment(deleteParams as Comment);

      expect(commentRepository.deleteComment).toHaveBeenCalledWith(1, "1");
      expect(commentRepository.deleteComment).toHaveBeenCalledTimes(1);
    });

    it("should throw an error when user_id is missing", async () => {
      const deleteParams: Partial<Comment> = {
        comment_id: 1,
      };

      await expect(
        commentService.deleteComment(deleteParams as Comment),
      ).rejects.toEqual(
        APIError({
          code: 401,
          success: false,
          error: "You need to be signed in to delete a comment",
        }),
      );
      expect(commentRepository.deleteComment).not.toHaveBeenCalled();
    });

    it("should throw an error when comment_id is missing", async () => {
      const deleteParams: Partial<Comment> = {
        user_id: "1",
      };

      await expect(
        commentService.deleteComment(deleteParams as Comment),
      ).rejects.toEqual(
        APIError({
          code: 400,
          success: false,
          error: "Missing required fields for deleting a comment",
        }),
      );
      expect(commentRepository.deleteComment).not.toHaveBeenCalled();
    });
  });
});
