import { CommentService } from "../services/commentService";
import { CommentRepository } from "../db/commentRepository";
import { Comment } from "../models/comment";
import { GetCommentsParams } from "../types/comment";
import { APIError } from "../types/response";

jest.mock("../db/commentRepository");

describe("CommentService", () => {
  let commentService: CommentService;
  let commentRepository: jest.Mocked<CommentRepository>;

  beforeEach(() => {
    commentRepository = new CommentRepository() as jest.Mocked<CommentRepository>;
    commentService = new CommentService();
    commentService.setCommentRepository(commentRepository);
  });

  describe("getNumComments", () => {
    it("should return the number of comments for an issue", async () => {
      const params: Partial<GetCommentsParams> = {
        issue_id: 1,
      };
      commentRepository.getNumComments.mockResolvedValue(10);

      const response = await commentService.getNumComments(params);

      expect(response.data).toBe(10);
      expect(commentRepository.getNumComments).toHaveBeenCalledWith(1, undefined);
      expect(commentRepository.getNumComments).toHaveBeenCalledTimes(1);
    });

    it("should throw an error when issue_id is missing", async () => {
      const params: Partial<GetCommentsParams> = {};

      await expect(commentService.getNumComments(params)).rejects.toEqual(
        APIError({
          code: 400,
          success: false,
          error: "Missing required fields for getting number of comments",
        })
      );
      expect(commentRepository.getNumComments).not.toHaveBeenCalled();
    });
  });

  describe("getComments", () => {
    it("should return comments for an issue", async () => {
      const params: GetCommentsParams = {
        issue_id: 1,
        from: 0,
        amount: 10,
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
        issue_id: 1,
      };

      await expect(commentService.getComments(params as GetCommentsParams)).rejects.toEqual(
        APIError({
          code: 400,
          success: false,
          error: "Missing required fields for getting comments",
        })
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
        },
        is_owner: true,
      };
      commentRepository.addComment.mockResolvedValue(addedComment);

      const response = await commentService.addComment(newComment as Comment);

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

      await expect(commentService.addComment(newComment as Comment)).rejects.toEqual(
        APIError({
          code: 401,
          success: false,
          error: "You need to be signed in to create a comment",
        })
      );
      expect(commentRepository.addComment).not.toHaveBeenCalled();
    });

    it("should throw an error when required fields are missing", async () => {
      const newComment: Partial<Comment> = {
        user_id: "1",
      };

      await expect(commentService.addComment(newComment as Comment)).rejects.toEqual(
        APIError({
          code: 400,
          success: false,
          error: "Missing required fields for creating a comment",
        })
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

      await expect(commentService.deleteComment(deleteParams as Comment)).rejects.toEqual(
        APIError({
          code: 401,
          success: false,
          error: "You need to be signed in to delete a comment",
        })
      );
      expect(commentRepository.deleteComment).not.toHaveBeenCalled();
    });

    it("should throw an error when comment_id is missing", async () => {
      const deleteParams: Partial<Comment> = {
        user_id: "1",
      };

      await expect(commentService.deleteComment(deleteParams as Comment)).rejects.toEqual(
        APIError({
          code: 400,
          success: false,
          error: "Missing required fields for deleting a comment",
        })
      );
      expect(commentRepository.deleteComment).not.toHaveBeenCalled();
    });
  });
});
