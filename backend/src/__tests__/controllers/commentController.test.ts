import { Request, Response } from "express";
import { CommentService } from "@/modules/comments/services/commentService";
import { sendResponse } from "@/utilities/response";
import * as commentController from "@/modules/comments/controllers/commentController";

jest.mock("@/modules/comments/services/commentService");
jest.mock("@/utilities/response");

describe("Comment Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockCommentService: jest.Mocked<CommentService>;

  beforeEach(() => {
    mockRequest = { body: {} };
    mockResponse = { json: jest.fn() } as Partial<Response>;
    mockCommentService = {
      getNumComments: jest.fn(),
      getComments: jest.fn(),
      addComment: jest.fn(),
      deleteComment: jest.fn(),
    } as unknown as jest.Mocked<CommentService>;
    (
      CommentService as jest.MockedClass<typeof CommentService>
    ).mockImplementation(() => mockCommentService);
  });

  const testCases = [
    { name: "getNumComments", method: commentController.getNumComments },
    { name: "getComments", method: commentController.getComments },
    { name: "addComment", method: commentController.addComment },
    { name: "deleteComment", method: commentController.deleteComment },
  ];

  testCases.forEach(({ name, method }) => {
    it(`should call sendResponse for ${name}`, async () => {
      await method(mockRequest as Request, mockResponse as Response);
      expect(sendResponse).toHaveBeenCalled();
    });
  });
});
