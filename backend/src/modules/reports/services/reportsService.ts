import ReportsRepository from "@/modules/reports/repositories/reportsRepository";
import { OrganizationRepository } from "@/modules/organizations/repositories/organizationRepository";
import { ResolutionRepository } from "@/modules/resolutions/repositories/resolutionRepository";
import IssueRepository  from "@/modules/issues/repositories/issueRepository";
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
import { sendEmail } from "@/modules/shared/services/emailService";
import ExcelJS from 'exceljs';
import { subDays } from 'date-fns';

export default class ReportsService {
  private ReportsRepository: ReportsRepository;
  private OrganizationRepository: OrganizationRepository;
  private ResolutionRepository: ResolutionRepository;
  private IssueRepository: IssueRepository;

  constructor() {
    this.ReportsRepository = new ReportsRepository();
    this.OrganizationRepository = new OrganizationRepository();
    this.ResolutionRepository = new ResolutionRepository();
    this.IssueRepository = new IssueRepository();
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

  async generateAndSendReport(organizationId: string, email: string): Promise<APIResponse<null>> {
    // Send immediate success response
    const successResponse = APIData({
      code: 202,
      success: true,
      data: null,
    });

    this.generateReportAsync(organizationId, email).catch(error => {
      console.error("Error generating report:", error);
    });
  
    return successResponse;
  }

  async generateReportAsync(organizationId: string, email: string): Promise<APIResponse<null>> {
    try {
      const endDate = new Date();
      const startDate = subDays(endDate, 30);
      const reportBuffer = await this.generateOverviewReport(organizationId, startDate, endDate);
      const orgReportBuffer = await this.generateOrginzationReport(organizationId);
      const orgMembersBuffer = await this.generateOrginzationMembersReport(organizationId);

      await sendEmail(email, 'Your Requested Report', '<strong>Please find the attached report for your organization</strong>', [
        {
          filename: 'overview.xlsx',
          content: reportBuffer.toString('base64'),
          encoding: 'base64',
          contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
        {
          filename: 'organization.xlsx',
          content: orgReportBuffer.toString('base64'),
          encoding: 'base64',
          contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
        {
          filename: 'organization-members.xlsx',
          content: orgMembersBuffer.toString('base64'),
          encoding: 'base64',
          contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      ]);

      return APIData({
        code: 200,
        success: true,
        data: null,
      });
    } catch (error) {
      console.error("Error: ", error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while generating and sending the report.",
      });
    }
  }

  async generateOverviewReport(organizationId: string, startDate: Date, endDate: Date): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();

    await this.generateOverviewSheet(workbook, organizationId, startDate, endDate);

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  private async generateOverviewSheet(workbook: ExcelJS.Workbook, organizationId: string, startDate: Date, endDate: Date) {
    const worksheet = workbook.addWorksheet('Overview');
    
    const organization = await this.OrganizationRepository.getOrganizationById(organizationId);
    const memberCount = await this.OrganizationRepository.getOrganizationMemberCount(organizationId);
    const issueCount = await this.IssueRepository.getIssueCount(organizationId);
    const resolutionCount = await this.ResolutionRepository.getResolutionCount({ organizationId, startDate, endDate });

    worksheet.columns = [
      {
        header: 'Overview',
        width: 20,
      }, 
      {
        width: 30,
      },
    ];

    worksheet.mergeCells('A1:B1');
    worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.addRows([
      [ 'Organization Name', organization.name],
      [ 'Total Members', memberCount],
      [ 'Total Issues', issueCount],
      [ 'Total Resolutions', resolutionCount],
      [ 'Average Satisfaction Rating', organization.averageSatisfactionRating?.toFixed(2) ?? 'N/A' ],
    ]);
  }

  async generateOrginzationReport(organizatoinId: string) {
    const workbook = new ExcelJS.Workbook();

    const report = await this.ReportsRepository.getOrganizationReport(organizatoinId);

    for (const category in report) {
      const worksheet = workbook.addWorksheet(category);

      worksheet.columns = [
        { 
          header: 'Suburb', 
          key: 'suburb',  
          width: 15
        },
        {
          header: 'Issues Created',
          key: 'our_issues',
          width: 20
        },
        {
          header: 'Issues Created That Have Been Resolved',
          key: 'our_issues_resolved',
          width: 30
        },
        {
          header: 'Total Resolutions Made By Us',
          key: 'issues_resolved_by_us',
          width: 25
        }
      ];

      worksheet.addRows(report[category]);
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  async generateOrginzationMembersReport(organizatoinId: string) {
    const workbook = new ExcelJS.Workbook();

    const report = await this.ReportsRepository.getOrganizationMembersReport(organizatoinId);

    for (const category in report) {
      const worksheet = workbook.addWorksheet(category);

      worksheet.columns = [
        { 
          header: 'Fullname', 
          key: 'fullname',  
          width: 30
        },
        {
          header: 'Username',
          key: 'username',
          width: 20
        },
        {
          header: 'Email',
          key: 'email',
          width: 20
        },
        {
          header: 'Joined',
          key: 'joined_at',
          width: 20
        },
        {
          header: 'Issues Created',
          key: 'my_issues',
          width: 20
        },
        {
          header: 'Issues Created That Have Been Resolved',
          key: 'my_issues_resolved',
          width: 30
        },
        {
          header: 'Total Resolutions Made',
          key: 'issues_resolved_by_me',
          width: 25
        }
      ];

      worksheet.addRows(report[category]);
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
