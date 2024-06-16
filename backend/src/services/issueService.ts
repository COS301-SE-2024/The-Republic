import IssueRepository from "../db/issueRepository";
import { Issue } from "../models/issue";
import { GetIssuesParams } from "../types/issue";
import { APIError } from "../types/response";

export default class IssueService {
  private issueRepository: IssueRepository;

  constructor() {
    this.issueRepository = new IssueRepository();
  }

  async getIssues(params: GetIssuesParams) {
    // `from` can be 0
    if (params.from === undefined || !params.amount) {
      throw APIError({
        code: 400,
        success: false,
        error: "Missing required fields for getting issues"
      });
    }

    return this.issueRepository.getIssues(params);
  }

  async getIssueById(issue: Partial<Issue>) {
    const issue_id = issue.issue_id;
    if (!issue_id) {
      throw APIError({
        code: 400,
        success: false,
        error: "Missing required fields for getting an issue"
      });
    }

    return this.issueRepository.getIssueById(issue_id, issue.user_id);
  }

  async createIssue(issue: Partial<Issue>) {
    if (!issue.user_id) {
      throw APIError({
        code: 401,
        success: false,
        error: "You need to be signed in to create an issue"
      });
    }

    if (!issue.category_id || !issue.content) {
      throw APIError({
        code: 400,
        success: false,
        error: "Missing required fields for creating an issue"
      });
    }

    if (issue.content.length > 500) {
      throw APIError({
        code: 413,
        success: false,
        error: "Issue content exceeds the maximum length of 500 characters"
      });
    }

    delete issue.issue_id;

    return this.issueRepository.createIssue(issue);
  }

  async updateIssue(issue: Partial<Issue>) {
    const user_id = issue.user_id;
    if (!user_id) {
      throw APIError({
        code: 401,
        success: false,
        error: "You need to be signed in to update an issue"
      });
    }

    const issue_id = issue.issue_id;
    if (!issue_id) {
      throw APIError({
        code: 400,
        success: false,
        error: "Missing required fields for updating an issue"
      });
    }

    if (issue.created_at || issue.resolved_at) {
      throw APIError({
        code: 400,
        success: false,
        error: "Cannot change the time an issue was created or resolved"
      });
    }

    delete issue.issue_id;

    return this.issueRepository.updateIssue(issue_id, issue, user_id);
  }

  async deleteIssue(issue: Partial<Issue>) {
    const user_id = issue.user_id;
    if (!user_id) {
      throw APIError({
        code: 401,
        success: false,
        error: "You need to be signed in to delete an issue"
      });
    }

    const issue_id = issue.issue_id;
    if (!issue_id) {
      throw APIError({
        code: 400,
        success: false,
        error: "Missing required fields for deleting an issue"
      });
    }

    return this.issueRepository.deleteIssue(issue_id, user_id);
  }

  setIssueRepository(issueRepository: IssueRepository): void {
    this.issueRepository = issueRepository;
  }

  async resolveIssue(issue: Partial<Issue>) {
    const user_id = issue.user_id;
    if (!user_id) {
      throw APIError({
        code: 401,
        success: false,
        error: "You need to be signed in to resolve an issue"
      });
    }

    const issue_id = issue.issue_id;
    if (!issue_id) {
      throw APIError({
        code: 400,
        success: false,
        error: "Missing required fields for resolving an issue"
      });
    }

    return this.issueRepository.resolveIssue(issue_id, user_id);
  }
}
