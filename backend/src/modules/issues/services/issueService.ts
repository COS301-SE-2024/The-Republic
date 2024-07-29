import IssueRepository from "@/modules/issues/repositories/issueRepository";
import { Issue } from "@/modules/shared/models/issue";
import { GetIssuesParams } from "@/types/issue";
import { APIData, APIError } from "@/types/response";
import { LocationRepository } from "@/modules/locations/repositories/locationRepository";
import supabase from "@/modules/shared/services/supabaseClient";
import { PointsService } from "@/modules/points/services/pointsService";

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

export default class IssueService {
  private issueRepository: IssueRepository;
  private locationRepository: LocationRepository;
  private pointsService: PointsService;

  constructor() {
    this.issueRepository = new IssueRepository();
    this.locationRepository = new LocationRepository();
    this.pointsService = new PointsService();
  }

  setIssueRepository(issueRepository: IssueRepository): void {
    this.issueRepository = issueRepository;
  }

  setLocationRepository(locationRepository: LocationRepository): void {
    this.locationRepository = locationRepository;
  }

  async getIssues(params: Partial<GetIssuesParams>) {
    if (params.from === undefined || !params.amount) {
      throw APIError({
        code: 400,
        success: false,
        error: "Missing required fields for getting issues",
      });
    }

    const issues = await this.issueRepository.getIssues(params);

    const issuesWithUserInfo = issues.map((issue) => {
      const isOwner = issue.user_id === params.user_id;

      if (issue.is_anonymous) {
        issue.user = {
          user_id: null,
          email_address: null,
          username: "Anonymous",
          fullname: "Anonymous",
          image_url: null,
          is_owner: false,
          total_issues: null,
          resolved_issues: null,
        };
      }

      return {
        ...issue,
        is_owner: isOwner,
      };
    });

    return APIData({
      code: 200,
      success: true,
      data: issuesWithUserInfo,
    });
  }

  async getIssueById(issue: Partial<Issue>) {
    const issue_id = issue.issue_id;
    if (!issue_id) {
      throw APIError({
        code: 400,
        success: false,
        error: "Missing required fields for getting an issue",
      });
    }

    const resIssue = await this.issueRepository.getIssueById(
      issue_id,
      issue.user_id,
    );

    const isOwner = resIssue.user_id === issue.user_id;

    if (resIssue.is_anonymous) {
      resIssue.user = {
        user_id: null,
        email_address: null,
        username: "Anonymous",
        fullname: "Anonymous",
        image_url: null,
        is_owner: false,
        total_issues: null,
        resolved_issues: null,
      };
    }

    return APIData({
      code: 200,
      success: true,
      data: {
        ...resIssue,
        is_owner: isOwner,
      },
    });
  }

  async createIssue(issue: Partial<Issue>, image?: MulterFile) {
    if (!issue.user_id) {
      throw APIError({
        code: 401,
        success: false,
        error: "You need to be signed in to create an issue",
      });
    }

    if (!issue.category_id || !issue.content) {
      throw APIError({
        code: 400,
        success: false,
        error: "Missing required fields for creating an issue",
      });
    }

    if (issue.content.length > 500) {
      throw APIError({
        code: 413,
        success: false,
        error: "Issue content exceeds the maximum length of 500 characters",
      });
    }

    let imageUrl: string | null = null;

    if (image) {
      const fileName = `${issue.user_id}_${Date.now()}-${image.originalname}`;
      const { error } = await supabase.storage
        .from("issues")
        .upload(fileName, image.buffer);

      if (error) {
        console.error(error);
        throw APIError({
          code: 500,
          success: false,
          error:
            "An error occurred while uploading the image. Please try again.",
        });
      }

      const { data: urlData } = supabase.storage
        .from("issues")
        .getPublicUrl(fileName);

      imageUrl = urlData.publicUrl;
    }

    delete issue.issue_id;

    // console.log(issue);

    const createdIssue = await this.issueRepository.createIssue({
      ...issue,
      image_url: imageUrl,
    });

    const isFirstIssue = await this.pointsService.getFirstTimeAction(issue.user_id!, "Created first issue");
    const points = isFirstIssue ? 50 : 20;
    await this.pointsService.awardPoints(issue.user_id!, points, isFirstIssue ? "Created first issue" : "Created an issue");

    return await this.getIssueById({
      issue_id: createdIssue.issue_id,
      user_id: issue.user_id
    });
  }

  async updateIssue(issue: Partial<Issue>) {
    const user_id = issue.user_id;
    if (!user_id) {
      throw APIError({
        code: 401,
        success: false,
        error: "You need to be signed in to update an issue",
      });
    }

    const issue_id = issue.issue_id;
    if (!issue_id) {
      throw APIError({
        code: 400,
        success: false,
        error: "Missing required fields for updating an issue",
      });
    }

    if (issue.created_at || issue.resolved_at) {
      throw APIError({
        code: 400,
        success: false,
        error: "Cannot change the time an issue was created or resolved",
      });
    }

    delete issue.user_id;
    delete issue.issue_id;

    const updatedIssue = await this.issueRepository.updateIssue(
      issue_id,
      issue,
      user_id,
    );

    return APIData({
      code: 200,
      success: true,
      data: updatedIssue,
    });
  }

  async deleteIssue(issue: Partial<Issue>) {
    const user_id = issue.user_id;
    if (!user_id) {
      throw APIError({
        code: 401,
        success: false,
        error: "You need to be signed in to delete an issue",
      });
    }

    const issue_id = issue.issue_id;
    if (!issue_id) {
      throw APIError({
        code: 400,
        success: false,
        error: "Missing required fields for deleting an issue",
      });
    }

    const issueToDelete = await this.issueRepository.getIssueById(
      issue_id,
      user_id,
    );

    if (issueToDelete.image_url) {
      const imageName = issueToDelete.image_url.split("/").slice(-1)[0];
      const { error } = await supabase.storage
        .from("issues")
        .remove([imageName]);

      if (error) {
        console.error("Failed to delete image from storage:", error);
        throw APIError({
          code: 500,
          success: false,
          error:
            "An error occurred while deleting the image. Please try again.",
        });
      }
    }

    await this.issueRepository.deleteIssue(issue_id, user_id);

    return APIData({
      code: 204,
      success: true,
    });
  }

  async resolveIssue(issue: Partial<Issue>) {
    const user_id = issue.user_id;
    if (!user_id) {
      throw APIError({
        code: 401,
        success: false,
        error: "You need to be signed in to resolve an issue",
      });
    }

    const issue_id = issue.issue_id;
    if (!issue_id) {
      throw APIError({
        code: 400,
        success: false,
        error: "Missing required fields for resolving an issue",
      });
    }

    const resolvedIssue = await this.issueRepository.resolveIssue(
      issue_id,
      user_id,
    );

    if (resolvedIssue.user_id === user_id) {
      const isFirstResolution = await this.pointsService.getFirstTimeAction(user_id, "Resolved first issue");
      const points = isFirstResolution ? 100 : 50;
      await this.pointsService.awardPoints(user_id, points, isFirstResolution ? "Resolved first issue" : "Resolved an issue");
    }

    //TODO: False resolution penalty

    return await this.getIssueById({
      issue_id,
      user_id
    });
  }

  async getUserIssues(issue: Partial<Issue>) {
    const userId = issue.profile_user_id;
    if (!userId) {
      throw APIError({
        code: 401,
        success: false,
        error: "Missing profile user ID",
      });
    }

    const issues = await this.issueRepository.getUserIssues(userId);

    const issuesWithUserInfo = issues.map((issue) => {
      const isOwner = issue.user_id === userId;

      if (issue.is_anonymous) {
        issue.user = {
          user_id: null,
          email_address: null,
          username: "Anonymous",
          fullname: "Anonymous",
          image_url: null,
          is_owner: false,
          total_issues: null,
          resolved_issues: null,
        };
      }

      return {
        ...issue,
        is_owner: isOwner,
      };
    });

    return APIData({
      code: 200,
      success: true,
      data: issuesWithUserInfo,
    });
  }

  async getUserResolvedIssues(issue: Partial<Issue>) {
    const userId = issue.profile_user_id;
    if (!userId) {
      throw APIError({
        code: 401,
        success: false,
        error: "Missing profile user ID",
      });
    }

    const resolvedIssues =
      await this.issueRepository.getUserResolvedIssues(userId);

    const issuesWithUserInfo = resolvedIssues.map((issue) => {
      const isOwner = issue.user_id === userId;

      if (issue.is_anonymous) {
        issue.user = {
          user_id: null,
          email_address: null,
          username: "Anonymous",
          fullname: "Anonymous",
          image_url: null,
          is_owner: false,
          total_issues: null,
          resolved_issues: null,
        };
      }

      return {
        ...issue,
        is_owner: isOwner,
      };
    });

    return APIData({
      code: 200,
      success: true,
      data: issuesWithUserInfo,
    });
  }
}
