import { Request, Response } from "express";
import { sendResponse } from "@/utilities/response";
import SubscriptionsService from "@/modules/subscriptions/services/subscriptionsService";
import * as subscriptionsController from "@/modules/subscriptions/controllers/subscriptionsController";

jest.mock("@/utilities/response");
jest.mock("@/modules/subscriptions/services/subscriptionsService");
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

const mockSubscriptionsService = SubscriptionsService as jest.MockedClass<typeof SubscriptionsService>;

describe("Subscriptions Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("issueSubscriptions", () => {
    it("should send a successful response", async () => {
      const mockResponse = { success: true, code: 200, data: "Issue subscription successful" };
      mockSubscriptionsService.prototype.issueSubscriptions.mockResolvedValue(mockResponse);

      await subscriptionsController.issueSubscriptions(req as Request, res as Response);

      expect(mockSubscriptionsService.prototype.issueSubscriptions).toHaveBeenCalledWith(req.body);
      expect(sendResponse).toHaveBeenCalledWith(res, mockResponse);
    });

    it("should send an error response", async () => {
      const mockError = { success: false, error: "Issue subscription failed" };
      mockSubscriptionsService.prototype.issueSubscriptions.mockRejectedValue(mockError);

      await subscriptionsController.issueSubscriptions(req as Request, res as Response);

      expect(mockSubscriptionsService.prototype.issueSubscriptions).toHaveBeenCalledWith(req.body);
      expect(sendResponse).toHaveBeenCalledWith(res, mockError);
    });
  });

  describe("categorySubscriptions", () => {
    it("should send a successful response", async () => {
      const mockResponse = { success: true, code: 200, data: "Category subscription successful" };
      mockSubscriptionsService.prototype.categorySubscriptions.mockResolvedValue(mockResponse);

      await subscriptionsController.categorySubscriptions(req as Request, res as Response);

      expect(mockSubscriptionsService.prototype.categorySubscriptions).toHaveBeenCalledWith(req.body);
      expect(sendResponse).toHaveBeenCalledWith(res, mockResponse);
    });

    it("should send an error response", async () => {
      const mockError = { success: false, error: "Category subscription failed" };
      mockSubscriptionsService.prototype.categorySubscriptions.mockRejectedValue(mockError);

      await subscriptionsController.categorySubscriptions(req as Request, res as Response);

      expect(mockSubscriptionsService.prototype.categorySubscriptions).toHaveBeenCalledWith(req.body);
      expect(sendResponse).toHaveBeenCalledWith(res, mockError);
    });
  });

  describe("locationSubscriptions", () => {
    it("should send a successful response", async () => {
      const mockResponse = { success: true, code: 200, data: "Location subscription successful" };
      mockSubscriptionsService.prototype.locationSubscriptions.mockResolvedValue(mockResponse);

      await subscriptionsController.locationSubscriptions(req as Request, res as Response);

      expect(mockSubscriptionsService.prototype.locationSubscriptions).toHaveBeenCalledWith(req.body);
      expect(sendResponse).toHaveBeenCalledWith(res, mockResponse);
    });

    it("should send an error response", async () => {
      const mockError = { success: false, error: "Location subscription failed" };
      mockSubscriptionsService.prototype.locationSubscriptions.mockRejectedValue(mockError);

      await subscriptionsController.locationSubscriptions(req as Request, res as Response);

      expect(mockSubscriptionsService.prototype.locationSubscriptions).toHaveBeenCalledWith(req.body);
      expect(sendResponse).toHaveBeenCalledWith(res, mockError);
    });
  });

  describe("getSubscriptions", () => {
    it("should send a successful response", async () => {
      const mockResponse = {
        success: true,
        code: 200,
        data: {
          issues: [],
          categories: [],
          locations: [],
        }
      };
      mockSubscriptionsService.prototype.getSubscriptions.mockResolvedValue(mockResponse);

      await subscriptionsController.getSubscriptions(req as Request, res as Response);

      expect(mockSubscriptionsService.prototype.getSubscriptions).toHaveBeenCalledWith(req.body);
      expect(sendResponse).toHaveBeenCalledWith(res, mockResponse);
    });

    it("should send an error response", async () => {
      const mockError = { success: false, error: "Get subscriptions failed" };
      mockSubscriptionsService.prototype.getSubscriptions.mockRejectedValue(mockError);

      await subscriptionsController.getSubscriptions(req as Request, res as Response);

      expect(mockSubscriptionsService.prototype.getSubscriptions).toHaveBeenCalledWith(req.body);
      expect(sendResponse).toHaveBeenCalledWith(res, mockError);
    });
  });
});