import ReportsRepository from "@/modules/reports/repositories/reportsRepository";
import { APIResponse, APIError, APIData } from "@/types/response";
import {
  CatCounts,
  GroupedIssuesResponse,
  ResolutionStatusCounts,
  IssuesGroupedByDate,
  IssuesGroupedByCategory,
  CategoryAndDateCount,
  NameValue,
} from "@/modules/shared/models/reports";
import { GetIssuesParams } from "@/types/issue";

export default class ReportsService {
  private ReportsRepository: ReportsRepository;

  constructor() {
    this.ReportsRepository = new ReportsRepository();
  }

  setReportsRepository(ReportsRepository: ReportsRepository) {
    this.ReportsRepository = ReportsRepository;
  }

  async getAllIssuesGroupedByResolutionStatus(
    params: Partial<GetIssuesParams>,
  ): Promise<APIResponse<GroupedIssuesResponse>> {
    try {
      const data =
        await this.ReportsRepository.getAllIssuesGroupedByResolutionStatus(
          params,
        );
      return { code: 200, success: true, data };
    } catch (error) {
      console.error("Error: ", error);
      throw APIError({
        code: 404,
        success: false,
        error: "GroupedByResolutionStatus: Something Went wrong",
      });
    }
  }

  async getIssueCountsGroupedByResolutionStatus(
    params: Partial<GetIssuesParams>,
  ): Promise<APIResponse<ResolutionStatusCounts>> {
    try {
      const data =
        await this.ReportsRepository.getIssueCountsGroupedByResolutionStatus(
          params,
        );
      return { code: 200, success: true, data };
    } catch (error) {
      console.error("Error: ", error);
      throw APIError({
        code: 404,
        success: false,
        error: "CountsGroupedByResolutionStatus: Something Went wrong",
      });
    }
  }

  async getIssueCountsGroupedByResolutionAndCategory(
    params: Partial<GetIssuesParams>,
  ): Promise<APIResponse<CatCounts>> {
    try {
      const data =
        await this.ReportsRepository.getIssueCountsGroupedByResolutionAndCategory(
          params,
        );
      return { code: 200, success: true, data };
    } catch (error) {
      console.error("Error: ", error);
      throw APIError({
        code: 404,
        success: false,
        error: "CountsGroupedByResolutionAndCategory: Something Went wrong",
      });
    }
  }

  async getIssuesGroupedByCreatedAt(
    params: Partial<GetIssuesParams>,
  ): Promise<APIResponse<IssuesGroupedByDate>> {
    try {
      const data =
        await this.ReportsRepository.getIssuesGroupedByCreatedAt(params);
      return { code: 200, success: true, data };
    } catch (error) {
      console.error("Error: ", error);
      throw APIError({
        code: 404,
        success: false,
        error: "GroupedByCreatedAt: Something Went wrong",
      });
    }
  }

  async getIssuesGroupedByCategory(
    params: Partial<GetIssuesParams>,
  ): Promise<APIResponse<IssuesGroupedByCategory>> {
    try {
      const data =
        await this.ReportsRepository.getIssuesGroupedByCategory(params);
      return { code: 200, success: true, data };
    } catch (error) {
      console.error("Error: ", error);
      throw APIError({
        code: 404,
        success: false,
        error: "GroupedByCategory: Something Went wrong",
      });
    }
  }

  async getIssuesCountGroupedByCategoryAndCreatedAt(
    params: Partial<GetIssuesParams>,
  ): Promise<APIResponse<CategoryAndDateCount>> {
    try {
      const data =
        await this.ReportsRepository.getIssuesCountGroupedByCategoryAndCreatedAt(
          params,
        );
      return { code: 200, success: true, data };
    } catch (error) {
      console.error("Error: ", error);
      throw APIError({
        code: 404,
        success: false,
        error: "CountGroupedByCategoryAndCreatedAt: Something Went wrong",
      });
    }
  }

  async groupedByPoliticalAssociation(): Promise<APIResponse<NameValue[]>> {
    const data = await this.ReportsRepository.groupedByPoliticalAssociation();

    return APIData({
      code: 200,
      success: true,
      data,
    });
  }
}
