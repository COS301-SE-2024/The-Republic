import { Request, Response, NextFunction } from "express";
import { CommentService } from "@/modules/comments/services/commentService";
import { sendResponse } from "@/utilities/response";
import * as commentController from "@/modules/comments/controllers/commentController";

jest.mock("@/modules/comments/services/commentService");
jest.mock("@/utilities/response");
jest.mock("@/modules/shared/services/redisClient", () => ({
  __esModule: true,
  default: {
    on: jest.fn(),
    get: jest.fn(),
    setex: jest.fn(),
    del: jest.fn(),
    keys: jest.fn().mockResolvedValue([]),
  },
}));

describe("Comment Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let mockCommentService: jest.Mocked<CommentService>;

  beforeEach(() => {
    mockRequest = { body: {} };
    mockResponse = { json: jest.fn() } as Partial<Response>;
    mockNext = jest.fn();
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
      if (Array.isArray(method)) {
        // If the method is an array (middleware + controller), call each function in the array
        for (const fn of method) {
          await fn(mockRequest as Request, mockResponse as Response, mockNext);
        }
      } else {
        // If it's a regular function, call it directly
        await method(mockRequest as Request, mockResponse as Response);
      }
      expect(sendResponse).toHaveBeenCalled();
    });
  });
});
