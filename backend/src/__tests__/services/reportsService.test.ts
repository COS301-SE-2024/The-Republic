import ReportsService from "../../services/reportsService";
import ReportsRepository from "../../db/reportsRepository";
import {
  CatCounts,
  GroupedIssuesResponse,
  ResolutionStatusCounts,
  IssuesGroupedByDate,
  IssuesGroupedByCategory,
  CategoryAndDateCount,
} from "../../models/reports";
import { GetIssuesParams } from "../../types/issue";

jest.mock("../../db/reportsRepository");

describe("ReportsService", () => {
  let reportsService: ReportsService;
  let reportsRepository: jest.Mocked<ReportsRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    reportsRepository =
      new ReportsRepository() as jest.Mocked<ReportsRepository>;
    reportsService = new ReportsService();
    reportsService.setReportsRepository(reportsRepository);
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  describe("getAllIssuesGroupedByResolutionStatus", () => {
    it("should return all issues grouped by resolution status", async () => {
      const params: Partial<GetIssuesParams> = {};
      const mockData: GroupedIssuesResponse = {
        resolved: [
          {
            id: 1,
            category: {
              name: "Category for 2024-06-20",
            },
            location: {
              suburb: "Suburb for 2024-06-20",
              city: "City for 2024-06-20",
              province: "Province for 2024-06-20",
            },
          },
        ],
        unresolved: [
          {
            id: 2,
            category: {
              name: "Category for 2024-06-19",
            },
            location: {
              suburb: "Suburb for 2024-06-19",
              city: "City for 2024-06-19",
              province: "Province for 2024-06-19",
            },
          },
        ],
      };
      reportsRepository.getAllIssuesGroupedByResolutionStatus.mockResolvedValue(
        mockData,
      );

      const response =
        await reportsService.getAllIssuesGroupedByResolutionStatus(params);

      expect(response.data).toEqual(mockData);
      expect(
        reportsRepository.getAllIssuesGroupedByResolutionStatus,
      ).toHaveBeenCalledWith(params);
      expect(
        reportsRepository.getAllIssuesGroupedByResolutionStatus,
      ).toHaveBeenCalledTimes(1);
    });

    it("should throw an error when something goes wrong", async () => {
      const params: Partial<GetIssuesParams> = {};
      reportsRepository.getAllIssuesGroupedByResolutionStatus.mockRejectedValue(
        new Error("Something went wrong"),
      );

      await expect(
        reportsService.getAllIssuesGroupedByResolutionStatus(params),
      ).rejects.toEqual(
        expect.objectContaining({
          code: 404,
          success: false,
          error: "GroupedByResolutionStatus: Something Went wrong",
        }),
      );
      expect(
        reportsRepository.getAllIssuesGroupedByResolutionStatus,
      ).toHaveBeenCalledWith(params);
      expect(
        reportsRepository.getAllIssuesGroupedByResolutionStatus,
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe("getIssueCountsGroupedByResolutionStatus", () => {
    it("should return issue counts grouped by resolution status", async () => {
      const params: Partial<GetIssuesParams> = {};
      const mockData: ResolutionStatusCounts = { resolved: 5, unresolved: 10 };
      reportsRepository.getIssueCountsGroupedByResolutionStatus.mockResolvedValue(
        mockData,
      );

      const response =
        await reportsService.getIssueCountsGroupedByResolutionStatus(params);

      expect(response.data).toEqual(mockData);
      expect(
        reportsRepository.getIssueCountsGroupedByResolutionStatus,
      ).toHaveBeenCalledWith(params);
      expect(
        reportsRepository.getIssueCountsGroupedByResolutionStatus,
      ).toHaveBeenCalledTimes(1);
    });

    it("should throw an error when something goes wrong", async () => {
      const params: Partial<GetIssuesParams> = {};
      reportsRepository.getIssueCountsGroupedByResolutionStatus.mockRejectedValue(
        new Error("Something went wrong"),
      );

      await expect(
        reportsService.getIssueCountsGroupedByResolutionStatus(params),
      ).rejects.toEqual(
        expect.objectContaining({
          code: 404,
          success: false,
          error: "CountsGroupedByResolutionStatus: Something Went wrong",
        }),
      );
      expect(
        reportsRepository.getIssueCountsGroupedByResolutionStatus,
      ).toHaveBeenCalledWith(params);
      expect(
        reportsRepository.getIssueCountsGroupedByResolutionStatus,
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe("getIssueCountsGroupedByResolutionAndCategory", () => {
    it("should return issue counts grouped by resolution and category", async () => {
      const params: Partial<GetIssuesParams> = {};
      const mockData: CatCounts = {
        resolved: { "Public Safety": 2, "Healthcare Services": 1 },
        unresolved: { Water: 5, Electricity: 1 },
      };
      reportsRepository.getIssueCountsGroupedByResolutionAndCategory.mockResolvedValue(
        mockData,
      );

      const response =
        await reportsService.getIssueCountsGroupedByResolutionAndCategory(
          params,
        );

      expect(response.data).toEqual(mockData);
      expect(
        reportsRepository.getIssueCountsGroupedByResolutionAndCategory,
      ).toHaveBeenCalledWith(params);
      expect(
        reportsRepository.getIssueCountsGroupedByResolutionAndCategory,
      ).toHaveBeenCalledTimes(1);
    });

    it("should throw an error when something goes wrong", async () => {
      const params: Partial<GetIssuesParams> = {};
      reportsRepository.getIssueCountsGroupedByResolutionAndCategory.mockRejectedValue(
        new Error("Something went wrong"),
      );

      await expect(
        reportsService.getIssueCountsGroupedByResolutionAndCategory(params),
      ).rejects.toEqual(
        expect.objectContaining({
          code: 404,
          success: false,
          error: "CountsGroupedByResolutionAndCategory: Something Went wrong",
        }),
      );
      expect(
        reportsRepository.getIssueCountsGroupedByResolutionAndCategory,
      ).toHaveBeenCalledWith(params);
      expect(
        reportsRepository.getIssueCountsGroupedByResolutionAndCategory,
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe("getIssuesGroupedByCreatedAt", () => {
    it("should return issues grouped by creation date", async () => {
      const params: Partial<GetIssuesParams> = {};
      const mockData: IssuesGroupedByDate = {
        "2024-06-20": [
          {
            id: 1,
            category: {
              name: "Category for 2024-06-20",
            },
            location: {
              suburb: "Suburb for 2024-06-20",
              city: "City for 2024-06-20",
              province: "Province for 2024-06-20",
            },
          },
        ],
        "2024-06-19": [
          {
            id: 2,
            category: {
              name: "Category for 2024-06-19",
            },
            location: {
              suburb: "Suburb for 2024-06-19",
              city: "City for 2024-06-19",
              province: "Province for 2024-06-19",
            },
          },
        ],
      };
      reportsRepository.getIssuesGroupedByCreatedAt.mockResolvedValue(mockData);

      const response = await reportsService.getIssuesGroupedByCreatedAt(params);

      expect(response.data).toEqual(mockData);
      expect(
        reportsRepository.getIssuesGroupedByCreatedAt,
      ).toHaveBeenCalledWith(params);
      expect(
        reportsRepository.getIssuesGroupedByCreatedAt,
      ).toHaveBeenCalledTimes(1);
    });

    it("should throw an error when something goes wrong", async () => {
      const params: Partial<GetIssuesParams> = {};
      reportsRepository.getIssuesGroupedByCreatedAt.mockRejectedValue(
        new Error("Something went wrong"),
      );

      await expect(
        reportsService.getIssuesGroupedByCreatedAt(params),
      ).rejects.toEqual(
        expect.objectContaining({
          code: 404,
          success: false,
          error: "GroupedByCreatedAt: Something Went wrong",
        }),
      );
      expect(
        reportsRepository.getIssuesGroupedByCreatedAt,
      ).toHaveBeenCalledWith(params);
      expect(
        reportsRepository.getIssuesGroupedByCreatedAt,
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe("getIssuesGroupedByCategory", () => {
    it("should return issues grouped by category", async () => {
      const params: Partial<GetIssuesParams> = {};
      const mockData: IssuesGroupedByCategory = {
        "Public Safety": [
          {
            id: 1,
            category: {
              name: "Public Safety",
            },
            location: {
              suburb: "Suburb for 2024-06-20",
              city: "City for 2024-06-20",
              province: "Province for 2024-06-20",
            },
          },
        ],
        Water: [
          {
            id: 1,
            category: {
              name: "Water",
            },
            location: {
              suburb: "Suburb for 2024-06-20",
              city: "City for 2024-06-20",
              province: "Province for 2024-06-20",
            },
          },
        ],
      };
      reportsRepository.getIssuesGroupedByCategory.mockResolvedValue(mockData);

      const response = await reportsService.getIssuesGroupedByCategory(params);

      expect(response.data).toEqual(mockData);
      expect(reportsRepository.getIssuesGroupedByCategory).toHaveBeenCalledWith(
        params,
      );
      expect(
        reportsRepository.getIssuesGroupedByCategory,
      ).toHaveBeenCalledTimes(1);
    });

    it("should throw an error when something goes wrong", async () => {
      const params: Partial<GetIssuesParams> = {};
      reportsRepository.getIssuesGroupedByCategory.mockRejectedValue(
        new Error("Something went wrong"),
      );

      await expect(
        reportsService.getIssuesGroupedByCategory(params),
      ).rejects.toEqual(
        expect.objectContaining({
          code: 404,
          success: false,
          error: "GroupedByCategory: Something Went wrong",
        }),
      );
      expect(reportsRepository.getIssuesGroupedByCategory).toHaveBeenCalledWith(
        params,
      );
      expect(
        reportsRepository.getIssuesGroupedByCategory,
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe("getIssuesCountGroupedByCategoryAndCreatedAt", () => {
    it("should return issue counts grouped by category and creation date", async () => {
      const params: Partial<GetIssuesParams> = {};
      const mockData: CategoryAndDateCount = {
        "Public Safety": { "2024-06-20": 2, "2024-06-19": 1 },
        Water: { "2024-06-20": 0, "2024-06-19": 2 },
      };
      reportsRepository.getIssuesCountGroupedByCategoryAndCreatedAt.mockResolvedValue(
        mockData,
      );

      const response =
        await reportsService.getIssuesCountGroupedByCategoryAndCreatedAt(
          params,
        );

      expect(response.data).toEqual(mockData);
      expect(
        reportsRepository.getIssuesCountGroupedByCategoryAndCreatedAt,
      ).toHaveBeenCalledWith(params);
      expect(
        reportsRepository.getIssuesCountGroupedByCategoryAndCreatedAt,
      ).toHaveBeenCalledTimes(1);
    });

    it("should throw an error when something goes wrong", async () => {
      const params: Partial<GetIssuesParams> = {};
      reportsRepository.getIssuesCountGroupedByCategoryAndCreatedAt.mockRejectedValue(
        new Error("Something went wrong"),
      );

      await expect(
        reportsService.getIssuesCountGroupedByCategoryAndCreatedAt(params),
      ).rejects.toEqual(
        expect.objectContaining({
          code: 404,
          success: false,
          error: "CountGroupedByCategoryAndCreatedAt: Something Went wrong",
        }),
      );
      expect(
        reportsRepository.getIssuesCountGroupedByCategoryAndCreatedAt,
      ).toHaveBeenCalledWith(params);
      expect(
        reportsRepository.getIssuesCountGroupedByCategoryAndCreatedAt,
      ).toHaveBeenCalledTimes(1);
    });
  });
});
