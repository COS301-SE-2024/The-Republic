import { Request, Response } from "express";
import reactionController from "@/modules/reactions/controllers/reactionController";
import ReactionService from "@/modules/reactions/services/reactionService";
import { sendResponse } from "@/utilities/response";

jest.mock("@/modules/reactions/services/reactionService");
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

describe("Reaction Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockReactionService: jest.Mocked<ReactionService>;

  beforeEach(() => {
    mockRequest = { body: {} };
    mockResponse = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    mockReactionService = new ReactionService() as jest.Mocked<ReactionService>;
    (ReactionService as jest.Mock).mockImplementation(
      () => mockReactionService,
    );
  });

  it("should handle addOrRemoveReaction", async () => {
    await reactionController.addOrRemoveReaction(
      mockRequest as Request,
      mockResponse as Response,
    );
    expect(sendResponse).toHaveBeenCalled();
  });

  it("should handle errors in addOrRemoveReaction", async () => {
    mockReactionService.addOrRemoveReaction.mockRejectedValue(
      new Error("Test error"),
    );
    await reactionController.addOrRemoveReaction(
      mockRequest as Request,
      mockResponse as Response,
    );
    expect(sendResponse).toHaveBeenCalled();
  });
});
