import SubscriptionsService from "@/modules/subscriptions/services/subscriptionsService";
import SubscriptionsRepository from "@/modules/subscriptions/repositories/subscriptionsRepository";
import { APIError } from "@/types/response";

jest.mock("@/modules/subscriptions/repositories/subscriptionsRepository");

const mockSubscriptionsRepository = SubscriptionsRepository as jest.MockedClass<
  typeof SubscriptionsRepository
>;

describe("SubscriptionsService", () => {
  let subscriptionsService: SubscriptionsService;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    subscriptionsService = new SubscriptionsService();
    subscriptionsService.setSubscriptionsRepository(
      new mockSubscriptionsRepository(),
    );
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  describe("issueSubscriptions", () => {
    it("should return a successful response", async () => {
      const mockResponse = "Subscription successfully created!";
      mockSubscriptionsRepository.prototype.issueSubscriptions.mockResolvedValue(
        mockResponse,
      );

      const result = await subscriptionsService.issueSubscriptions({});

      expect(
        mockSubscriptionsRepository.prototype.issueSubscriptions,
      ).toHaveBeenCalledWith({});
      expect(result).toEqual({ code: 200, success: true, data: mockResponse });
    });

    it("should throw an APIError on failure", async () => {
      mockSubscriptionsRepository.prototype.issueSubscriptions.mockRejectedValue(
        new Error("Issue subscription failed"),
      );

      await expect(subscriptionsService.issueSubscriptions({})).rejects.toEqual(
        APIError({
          code: 404,
          success: false,
          error: "Issue: Something Went wrong",
        }),
      );
    });
  });

  describe("categorySubscriptions", () => {
    it("should return a successful response", async () => {
      const mockResponse = "Subscription successfully created!";
      mockSubscriptionsRepository.prototype.categorySubscriptions.mockResolvedValue(
        mockResponse,
      );

      const result = await subscriptionsService.categorySubscriptions({});

      expect(
        mockSubscriptionsRepository.prototype.categorySubscriptions,
      ).toHaveBeenCalledWith({});
      expect(result).toEqual({ code: 200, success: true, data: mockResponse });
    });

    it("should throw an APIError on failure", async () => {
      mockSubscriptionsRepository.prototype.categorySubscriptions.mockRejectedValue(
        new Error("Category subscription failed"),
      );

      await expect(
        subscriptionsService.categorySubscriptions({}),
      ).rejects.toEqual(
        APIError({
          code: 404,
          success: false,
          error: "Category: Something Went wrong",
        }),
      );
    });
  });

  describe("locationSubscriptions", () => {
    it("should return a successful response", async () => {
      const mockResponse = "Subscription successfully created!";
      mockSubscriptionsRepository.prototype.locationSubscriptions.mockResolvedValue(
        mockResponse,
      );

      const result = await subscriptionsService.locationSubscriptions({});

      expect(
        mockSubscriptionsRepository.prototype.locationSubscriptions,
      ).toHaveBeenCalledWith({});
      expect(result).toEqual({ code: 200, success: true, data: mockResponse });
    });

    it("should throw an APIError on failure", async () => {
      mockSubscriptionsRepository.prototype.locationSubscriptions.mockRejectedValue(
        new Error("Location subscription failed"),
      );

      await expect(
        subscriptionsService.locationSubscriptions({}),
      ).rejects.toEqual(
        APIError({
          code: 404,
          success: false,
          error: "Location: Something Went wrong",
        }),
      );
    });
  });

  describe("getSubscriptions", () => {
    it("should return a successful response", async () => {
      const mockResponse = {
        issues: [],
        categories: [],
        locations: [],
      };
      mockSubscriptionsRepository.prototype.getSubscriptions.mockResolvedValue(
        mockResponse,
      );

      const result = await subscriptionsService.getSubscriptions({});

      expect(
        mockSubscriptionsRepository.prototype.getSubscriptions,
      ).toHaveBeenCalledWith({});
      expect(result).toEqual({ code: 200, success: true, data: mockResponse });
    });

    it("should throw an APIError on failure", async () => {
      mockSubscriptionsRepository.prototype.getSubscriptions.mockRejectedValue(
        new Error("Get subscriptions failed"),
      );

      await expect(subscriptionsService.getSubscriptions({})).rejects.toEqual(
        APIError({
          code: 404,
          success: false,
          error: "Notifications: Something Went wrong",
        }),
      );
    });
  });
});
