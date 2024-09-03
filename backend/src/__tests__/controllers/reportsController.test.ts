import { Request, Response, NextFunction } from "express";
import * as reportsController from "@/modules/reports/controllers/reportsController";
import ReportsService from "@/modules/reports/services/reportsService";
import { sendResponse } from "@/utilities/response";
import { cacheMiddleware } from "@/middleware/cacheMiddleware";

jest.mock("@/modules/reports/services/reportsService");
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

describe("Reports Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let mockReportsService: jest.Mocked<ReportsService>;

  beforeEach(() => {
    mockRequest = { body: {}, query: {} };
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    mockReportsService = {
      getAllIssuesGroupedByResolutionStatus: jest.fn(),
      getIssueCountsGroupedByResolutionStatus: jest.fn(),
      getIssueCountsGroupedByResolutionAndCategory: jest.fn(),
      getIssuesGroupedByCreatedAt: jest.fn(),
      getIssuesGroupedByCategory: jest.fn(),
      getIssuesCountGroupedByCategoryAndCreatedAt: jest.fn(),
      groupedByPoliticalAssociation: jest.fn(),
    } as unknown as jest.Mocked<ReportsService>;
    (ReportsService as jest.Mock).mockImplementation(() => mockReportsService);
    (cacheMiddleware as jest.Mock).mockImplementation(() => (req: Request, res: Response, next: NextFunction) => next());
  });

  const testControllerMethod = async (
    methodName: keyof typeof reportsController,
  ) => {
    const controllerMethod = reportsController[methodName];
    if (Array.isArray(controllerMethod)) {
      for (const middleware of controllerMethod) {
        if (typeof middleware === 'function') {
          await middleware(mockRequest as Request, mockResponse as Response, mockNext);
        }
      }
    } else if (typeof controllerMethod === 'function') {
      await (controllerMethod as (req: Request, res: Response, next: NextFunction) => Promise<void>)(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
    } else {
      throw new Error(`Controller method ${methodName} not found or not a function`);
    }
    expect(sendResponse).toHaveBeenCalled();
  };

  it("should handle getAllIssuesGroupedByResolutionStatus", () =>
    testControllerMethod("getAllIssuesGroupedByResolutionStatus"));
  it("should handle getIssueCountsGroupedByResolutionStatus", () =>
    testControllerMethod("getIssueCountsGroupedByResolutionStatus"));
  it("should handle getIssueCountsGroupedByResolutionAndCategory", () =>
    testControllerMethod("getIssueCountsGroupedByResolutionAndCategory"));
  it("should handle getIssuesGroupedByCreatedAt", () =>
    testControllerMethod("getIssuesGroupedByCreatedAt"));
  it("should handle getIssuesGroupedByCategory", () =>
    testControllerMethod("getIssuesGroupedByCategory"));
  it("should handle getIssuesCountGroupedByCategoryAndCreatedAt", () =>
    testControllerMethod("getIssuesCountGroupedByCategoryAndCreatedAt"));
  it("should handle groupedByPoliticalAssociation", () =>
    testControllerMethod("groupedByPoliticalAssociation"));

  it("should handle errors", async () => {
    mockReportsService.getAllIssuesGroupedByResolutionStatus.mockRejectedValue(
      new Error("Test error"),
    );
    await testControllerMethod("getAllIssuesGroupedByResolutionStatus");
    expect(sendResponse).toHaveBeenCalled();
  });
});
