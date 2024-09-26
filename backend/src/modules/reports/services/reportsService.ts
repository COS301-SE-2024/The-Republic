import ReportsRepository from "@/modules/reports/repositories/reportsRepository";
import { OrganizationRepository } from "@/modules/organizations/repositories/organizationRepository";
import { ResolutionRepository } from "@/modules/resolutions/repositories/resolutionRepository";
import IssueRepository  from "@/modules/issues/repositories/issueRepository";
import UserRepository from "@/modules/users/repositories/userRepository";
import { CommentRepository } from "@/modules/comments/repositories/commentRepository";
import { ResolutionResponseRepository } from "@/modules/resolutions/repositories/resolutionResponseRepository";
import { APIResponse, APIError, APIData } from "@/types/response";
import { Issue } from "@/modules/shared/models/issue";
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

interface LocationCategoryPerformance {
  location: string;
  category: string;
  totalIssues: number;
  resolvedIssues: number;
  resolutionRate: number;
  avgResolutionTime: number;
  avgSatisfactionRating: number;
  orgResolutionRate: number;
  orgAvgSatisfactionRating: number;
}
interface CategoryInfo {
  category_id: number;
  name: string;
}

const categories: CategoryInfo[] = [
  { category_id: 1, name: "Healthcare Services" },
  { category_id: 2, name: "Public Safety" },
  { category_id: 3, name: "Water" },
  { category_id: 4, name: "Transportation" },
  { category_id: 5, name: "Electricity" },
  { category_id: 6, name: "Sanitation" },
  { category_id: 7, name: "Social Services" },
  { category_id: 8, name: "Administrative Services" },
];

export default class ReportsService {
  private ReportsRepository: ReportsRepository;
  private OrganizationRepository: OrganizationRepository;
  private ResolutionRepository: ResolutionRepository;
  private IssueRepository: IssueRepository;
  private UserRepository: UserRepository;
  private CommentRepository: CommentRepository;
  private ResolutionResponseRepository: ResolutionResponseRepository;

  constructor() {
    this.ReportsRepository = new ReportsRepository();
    this.OrganizationRepository = new OrganizationRepository();
    this.ResolutionRepository = new ResolutionRepository();
    this.IssueRepository = new IssueRepository();
    this.UserRepository = new UserRepository();
    this.CommentRepository = new CommentRepository();
    this.ResolutionResponseRepository = new ResolutionResponseRepository();
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
      const reportBuffer = await this.generateReport(organizationId, startDate, endDate);

      await sendEmail(email, 'Your Requested Report', '<strong>Please find the attached report for the last 30 days.</strong>', [
        {
          filename: 'report.xlsx',
          content: reportBuffer.toString('base64'),
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

  async generateReport(organizationId: string, startDate: Date, endDate: Date): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();

    await this.generateOverviewSheet(workbook, organizationId, startDate, endDate);
    await this.generateMemberActivitySheet(workbook, organizationId, startDate, endDate);
    await this.generateGeographicalActivitySheet(workbook, organizationId, startDate, endDate);
    await this.generateNewMembersSheet(workbook, organizationId, startDate, endDate);

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  private async generateOverviewSheet(workbook: ExcelJS.Workbook, organizationId: string, startDate: Date, endDate: Date) {
    const worksheet = workbook.addWorksheet('Overview');
    
    const organization = await this.OrganizationRepository.getOrganizationById(organizationId);
    const memberCount = await this.OrganizationRepository.getOrganizationMemberCount(organizationId);
    const issueCount = await this.IssueRepository.getIssueCount({ startDate, endDate });
    const resolutionCount = await this.ResolutionRepository.getResolutionCount({ organizationId, startDate, endDate });

    worksheet.columns = [
      { header: 'Metric', key: 'metric', width: 30 },
      { header: 'Value', key: 'value', width: 20 },
    ];

    worksheet.addRows([
      { metric: 'Organization Name', value: organization.name },
      { metric: 'Total Members', value: memberCount },
      { metric: 'Total Issues', value: issueCount },
      { metric: 'Total Resolutions', value: resolutionCount },
      { metric: 'Average Satisfaction Rating', value: organization.averageSatisfactionRating?.toFixed(2) ?? 'N/A' },
    ]);
  }

  private async generateMemberActivitySheet(workbook: ExcelJS.Workbook, organizationId: string, startDate: Date, endDate: Date) {
    const worksheet = workbook.addWorksheet('Member Activity');
  
    worksheet.columns = [
      { header: 'Member Name', key: 'memberName', width: 30 },
      { header: 'Issues Created', key: 'issuesCreated', width: 15 },
      { header: 'Self Resolutions', key: 'selfResolutions', width: 15 },
      { header: 'External Resolutions', key: 'externalResolutions', width: 20 },
      { header: 'External Resolution Success Rate', key: 'externalResolutionSuccessRate', width: 30 },
      { header: 'Avg. Satisfaction Rating', key: 'avgSatisfactionRating', width: 25 },
      { header: 'Comments Made', key: 'commentsMade', width: 15 },
    ];
  
    const { data: members } = await this.OrganizationRepository.getOrganizationMembers(organizationId, { offset: 0, limit: 1000 });
  
    for (const member of members) {
      const userId = member.user_id;

      const user = await this.UserRepository.getUserById(userId);
      if (!user) {
        console.error(`User not found for user_id: ${userId}`);
        continue;
      }
  
      const issuesCreated = await this.IssueRepository.getIssueCountByUser(userId, startDate, endDate);
  
      const resolutions = await this.ResolutionRepository.getUserResolutionsInDateRange(userId, organizationId, startDate, endDate);
      const selfResolutions = resolutions.filter(r => r.resolution_source === 'self').length;
      const externalResolutions = resolutions.filter(r => r.resolution_source !== 'self').length;

      const successfulExternalResolutions = resolutions.filter(r => r.resolution_source !== 'self' && r.status === 'accepted').length;
      const externalResolutionSuccessRate = externalResolutions > 0 ? (successfulExternalResolutions / externalResolutions) * 100 : 0;
  
      const avgSatisfactionRating = await this.ResolutionResponseRepository.getAverageSatisfactionRatingForUser(userId, organizationId, startDate, endDate);

      const commentsMade = await this.CommentRepository.getCommentCountByUser(userId, startDate, endDate);
  
      worksheet.addRow({
        memberName: user.fullname || user.username,
        issuesCreated,
        selfResolutions,
        externalResolutions,
        externalResolutionSuccessRate: `${externalResolutionSuccessRate.toFixed(2)}%`,
        avgSatisfactionRating: avgSatisfactionRating ? avgSatisfactionRating.toFixed(2) : 'N/A',
        commentsMade,
      });
    }
  
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
  }

  async generateGeographicalActivitySheet(
    workbook: ExcelJS.Workbook,
    organizationId: string,
    startDate: Date,
    endDate: Date
  ): Promise<void> {
    const worksheet = workbook.addWorksheet('Geographical Activity');
    
    const issuesByLocation = await this.IssueRepository.getIssuesByLocationInDateRange(organizationId, startDate, endDate);
  
    const orgPerformance = await this.getOrganizationPerformance(organizationId, startDate, endDate);
  
    worksheet.columns = [
      { header: 'Location', key: 'location', width: 30 },
      { header: 'Category', key: 'category', width: 25 },
      { header: 'Total Issues', key: 'totalIssues', width: 15 },
      { header: 'Resolved Issues', key: 'resolvedIssues', width: 20 },
      { header: 'Resolution Rate', key: 'resolutionRate', width: 20 },
      { header: 'Avg. Resolution Time (days)', key: 'avgResolutionTime', width: 30 },
      { header: 'Avg. Satisfaction Rating', key: 'avgSatisfactionRating', width: 25 },
      { header: 'Org Resolution Rate', key: 'orgResolutionRate', width: 25 },
      { header: 'Org Avg Satisfaction Rating', key: 'orgAvgSatisfactionRating', width: 30 },
    ];
  
    worksheet.autoFilter = {
      from: { row: 1, column: 2 },
      to: { row: 1, column: 2 },
    };
  
    for (const { issues } of issuesByLocation) {
      for (const category of categories) {
        const categoryIssues = issues.filter(issue => issue.category_id === category.category_id);
        if (categoryIssues.length === 0) continue;
  
        const performance = await this.calculateLocationCategoryPerformance(categoryIssues, category.name);
        
        worksheet.addRow({
          location: performance.location,
          category: performance.category,
          totalIssues: performance.totalIssues,
          resolvedIssues: performance.resolvedIssues,
          resolutionRate: `${performance.resolutionRate.toFixed(2)}%`,
          avgResolutionTime: performance.avgResolutionTime.toFixed(2),
          avgSatisfactionRating: performance.avgSatisfactionRating.toFixed(2),
          orgResolutionRate: `${orgPerformance.resolutionRate.toFixed(2)}%`,
          orgAvgSatisfactionRating: orgPerformance.avgSatisfactionRating.toFixed(2),
        });
      }
    }
  
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
  }

  async getOverallPerformance(
    startDate: Date,
    endDate: Date
  ): Promise<{ resolutionRate: number; avgSatisfactionRating: number }> {
    const totalIssues = await this.IssueRepository.getIssueCount({ startDate, endDate });
    const resolvedIssues = await this.IssueRepository.getResolvedIssueCount({ startDate, endDate });
    const resolutionRate = totalIssues > 0 ? (resolvedIssues / totalIssues) * 100 : 0;
  
    const avgSatisfactionRating = await this.ResolutionResponseRepository.getOverallAverageSatisfactionRating(startDate, endDate);
  
    return { resolutionRate, avgSatisfactionRating };
  }
  
  async getOrganizationPerformance(
    organizationId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{ resolutionCount: number; resolutionRate: number; avgSatisfactionRating: number }> {
    const totalResolutions = await this.ResolutionRepository.getResolutionCount({ organizationId, startDate, endDate });
  
    const acceptedResolutions = await this.ResolutionRepository.getAcceptedResolutionCount({ organizationId, startDate, endDate });
  
    const resolutionRate = totalResolutions > 0 ? (acceptedResolutions / totalResolutions) * 100 : 0;
  
    const avgSatisfactionRating = await this.ResolutionResponseRepository.getOrganizationAverageSatisfactionRating(organizationId, startDate, endDate);
  
    return { 
      resolutionCount: totalResolutions,
      resolutionRate, 
      avgSatisfactionRating 
    };
  }

  async calculateLocationCategoryPerformance(
    issues: Issue[],
    categoryName: string
  ): Promise<LocationCategoryPerformance> {
    const totalIssues = issues.length;
    const resolvedIssues = issues.filter(issue => issue.resolved_at !== null).length;
    const resolutionRate = totalIssues > 0 ? (resolvedIssues / totalIssues) * 100 : 0;
  
    let totalResolutionTime = 0;
    let totalSatisfactionRating = 0;
    let satisfactionRatingCount = 0;
  
    for (const issue of issues) {
      const resolutions = await this.ResolutionRepository.getResolutionsByIssueId(issue.issue_id);
      if (resolutions.length > 0) {
        const firstResolution = resolutions[0];
        totalResolutionTime += this.calculateResolutionTime(issue.created_at, firstResolution.created_at);
  
        const avgSatisfactionRating = await this.ResolutionResponseRepository.getAverageSatisfactionRating(firstResolution.resolution_id);
        if (avgSatisfactionRating !== null) {
          totalSatisfactionRating += avgSatisfactionRating;
          satisfactionRatingCount++;
        }
      }
    }
  
    const avgResolutionTime = resolvedIssues > 0 ? totalResolutionTime / resolvedIssues : 0;
    const avgSatisfactionRating = satisfactionRatingCount > 0 ? totalSatisfactionRating / satisfactionRatingCount : 0;
  
    return {
      location: issues[0]?.location?.suburb ?? 'Unknown',
      category: categoryName,
      totalIssues,
      resolvedIssues,
      resolutionRate,
      avgResolutionTime,
      avgSatisfactionRating,
      orgResolutionRate: 0, // TODO
      orgAvgSatisfactionRating: 0, // TODO
    };
  }

  private async generateNewMembersSheet(workbook: ExcelJS.Workbook, organizationId: string, startDate: Date, endDate: Date) {
    const worksheet = workbook.addWorksheet('New Members');
    
    worksheet.columns = [
      { header: 'Member Name', key: 'memberName', width: 30 },
      { header: 'Email Address', key: 'emailAddress', width: 40 },
      { header: 'Join Date', key: 'joinDate', width: 20 },
    ];
  
    const newMembersData = await this.OrganizationRepository.getNewMembers(organizationId, startDate, endDate);
  
    for (const memberData of newMembersData) {
      const user = await this.UserRepository.getUserById(memberData.user_id);
      if (user) {
        worksheet.addRow({
          memberName: user.fullname || user.username,
          emailAddress: user.email_address,
          joinDate: new Date(memberData.joined_at).toLocaleDateString(),
        });
      }
    }
  
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
  }
  
  private calculateResolutionTime(issueCreatedAt: string, resolutionCreatedAt: string): number {
    const issueDate = new Date(issueCreatedAt);
    const resolutionDate = new Date(resolutionCreatedAt);
    const diffTime = Math.abs(resolutionDate.getTime() - issueDate.getTime());
    return diffTime / (1000 * 60 * 60 * 24);
  }
}
