import { Request, Response, NextFunction } from "express";
import * as issueController from "@/modules/issues/controllers/issueController";
import IssueService from "@/modules/issues/services/issueService";
import { sendResponse } from "@/utilities/response";
import { cacheMiddleware } from "@/middleware/cacheMiddleware";

jest.mock("@/modules/issues/services/issueService");
jest.mock("@/utilities/response");
jest.mock("@/middleware/cacheMiddleware");
jest.mock("@/utilities/cacheUtils");

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

describe("Issue Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let mockIssueService: jest.Mocked<IssueService>;

  beforeEach(() => {
    mockRequest = { body: {}, query: {} };
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    mockIssueService = {
      getIssues: jest.fn(),
      getIssueById: jest.fn(),
      createIssue: jest.fn(),
      updateIssue: jest.fn(),
      deleteIssue: jest.fn(),
      resolveIssue: jest.fn(),
      getUserIssues: jest.fn(),
      getUserResolvedIssues: jest.fn(),
    } as unknown as jest.Mocked<IssueService>;
    (IssueService as jest.Mock).mockImplementation(() => mockIssueService);
    (cacheMiddleware as jest.Mock).mockImplementation(
      () => (req: Request, res: Response, next: NextFunction) => next(),
    );
  });

  const testControllerMethod = async (
    methodName: keyof typeof issueController,
  ) => {
    const controllerMethod = issueController[methodName];
    if (Array.isArray(controllerMethod)) {
      // If it's an array of middleware, call the last function (actual controller)
      const lastMiddleware = controllerMethod[controllerMethod.length - 1];
      if (typeof lastMiddleware === "function") {
        await lastMiddleware(
          mockRequest as Request,
          mockResponse as Response,
          mockNext,
        );
      }
    } else if (typeof controllerMethod === "function") {
      await controllerMethod(mockRequest as Request, mockResponse as Response);
    }
    expect(sendResponse).toHaveBeenCalled();
  };

  it("should handle getIssues", () => testControllerMethod("getIssues"));
  it("should handle getIssueById", () => testControllerMethod("getIssueById"));
  it("should handle updateIssue", () => testControllerMethod("updateIssue"));
  it("should handle deleteIssue", () => testControllerMethod("deleteIssue"));
  it("should handle resolveIssue", () => testControllerMethod("resolveIssue"));
  it("should handle getUserIssues", () =>
    testControllerMethod("getUserIssues"));
  it("should handle getUserResolvedIssues", () =>
    testControllerMethod("getUserResolvedIssues"));

  it("should handle createIssue", async () => {
    mockRequest.file = {} as Express.Multer.File;
    await testControllerMethod("createIssue");
  });

  it("should handle errors", async () => {
    mockIssueService.getIssues.mockRejectedValue(new Error("Test error"));
    await testControllerMethod("getIssues");
    expect(sendResponse).toHaveBeenCalled();
  });
});
