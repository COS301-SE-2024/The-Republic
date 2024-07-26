import { Request, Response } from "express";
import * as issueController from "@/modules/issues/controllers/issueController";
import IssueService from "@/modules/issues/services/issueService";
import { sendResponse } from "@/utilities/response";

jest.mock("@/modules/issues/services/issueService");
jest.mock("@/utilities/response");

describe("Issue Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockIssueService: jest.Mocked<IssueService>;

  beforeEach(() => {
    mockRequest = { body: {}, query: {} };
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
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
  });

  const testControllerMethod = async (
    methodName: keyof typeof issueController,
  ) => {
    const controllerMethod = issueController[methodName] as (
      req: Request,
      res: Response,
    ) => Promise<void>;
    await controllerMethod(mockRequest as Request, mockResponse as Response);
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
    const createIssueHandler = issueController.createIssue[1] as (
      req: Request,
      res: Response,
    ) => Promise<void>;
    await createIssueHandler(mockRequest as Request, mockResponse as Response);
    expect(sendResponse).toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    mockIssueService.getIssues.mockRejectedValue(new Error("Test error"));
    await issueController.getIssues(
      mockRequest as Request,
      mockResponse as Response,
    );
    expect(sendResponse).toHaveBeenCalled();
  });
});
