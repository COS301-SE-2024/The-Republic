import IssueRepository from "../db/issueRepository";
import Issue from "../models/issue";

export default class IssueService {
  private issueRepository: IssueRepository;

  constructor() {
    this.issueRepository = new IssueRepository();
  }

  async getAllIssues(): Promise<Issue[]> {
    return this.issueRepository.getAllIssues();
  }

  async getIssueById(issueId: number): Promise<Issue | null> {
    return this.issueRepository.getIssueById(issueId);
  }

  async createIssue(issue: Partial<Issue>): Promise<Issue> {
    if (!issue.user_id || !issue.category_id || !issue.content) {
      throw new Error("Missing required fields for creating an issue");
    }

    if (issue.content.length > 500) {
      throw new Error(
        "Issue content exceeds the maximum length of 500 characters",
      );
    }

    return this.issueRepository.createIssue(issue);
  }

  async updateIssue(issueId: number, issue: Partial<Issue>): Promise<Issue> {
    return this.issueRepository.updateIssue(issueId, issue);
  }

  async deleteIssue(issueId: number): Promise<void> {
    return this.issueRepository.deleteIssue(issueId);
  }

  setIssueRepository(issueRepository: IssueRepository): void {
    this.issueRepository = issueRepository;
  }
}