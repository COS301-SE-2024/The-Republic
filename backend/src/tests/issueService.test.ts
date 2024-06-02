import IssueService from "../services/issueService";
import IssueRepository from "../db/issueRepository";
import Issue from "../models/issue";

jest.mock("../db/issueRepository");

describe("IssueService", () => {
  let issueService: IssueService;
  let issueRepository: jest.Mocked<IssueRepository>;

  beforeEach(() => {
    issueRepository = new IssueRepository() as jest.Mocked<IssueRepository>;
    issueService = new IssueService();
    issueService.setIssueRepository(issueRepository);
  });

  it("should get all issues", async () => {
    const mockIssues: Issue[] = [
      {
        issue_id: 1,
        user_id: "1",
        department_id: 1,
        location_id: null,
        category_id: 1,
        content: "Test Issue",
        resolved_at: null,
        is_anonymous: false,
        created_at: "2024-06-01",
        sentiment: "angry",
      },
    ];
    issueRepository.getAllIssues.mockResolvedValue(mockIssues);

    const issues = await issueService.getAllIssues();

    expect(issues).toEqual(mockIssues);
    expect(issueRepository.getAllIssues).toHaveBeenCalledTimes(1);
  });

  it("should get an issue by ID", async () => {
    const mockIssue: Issue = {
      issue_id: 1,
      user_id: "1",
      department_id: 1,
      location_id: null,
      category_id: 1,
      content: "Test Issue",
      resolved_at: null,
      is_anonymous: false,
      created_at: "2022-01-01",
      sentiment: "neutral",
    };
    issueRepository.getIssueById.mockResolvedValue(mockIssue);

    const issue = await issueService.getIssueById(1);

    expect(issue).toEqual(mockIssue);
    expect(issueRepository.getIssueById).toHaveBeenCalledWith(1);
    expect(issueRepository.getIssueById).toHaveBeenCalledTimes(1);
  });

  describe("createIssue", () => {
    it("should create a new issue when all required fields are provided", async () => {
      const newIssue: Partial<Issue> = {
        user_id: "1",
        department_id: 1,
        location_id: null,
        category_id: 1,
        content: "New Issue",
        resolved_at: null,
        is_anonymous: false,
        sentiment: "neutral",
      };
      const createdIssue: Issue = {
        ...newIssue,
        issue_id: 1,
        created_at: "2022-01-01",
      } as Issue;
      issueRepository.createIssue.mockResolvedValue(createdIssue);

      const issue = await issueService.createIssue(newIssue);

      expect(issue).toEqual(createdIssue);
      expect(issueRepository.createIssue).toHaveBeenCalledWith(newIssue);
      expect(issueRepository.createIssue).toHaveBeenCalledTimes(1);
    });

    it("should throw an error when required fields are missing", async () => {
      const newIssue: Partial<Issue> = { user_id: "1", content: "New Issue" };

      await expect(issueService.createIssue(newIssue)).rejects.toThrowError(
        "Missing required fields for creating an issue",
      );
      expect(issueRepository.createIssue).not.toHaveBeenCalled();
    });

    it("should throw an error when content exceeds the maximum length", async () => {
      const newIssue: Partial<Issue> = {
        user_id: "1",
        department_id: 1,
        location_id: null,
        category_id: 1,
        content: "A".repeat(501),
        resolved_at: null,
        is_anonymous: false,
        sentiment: "neutral",
      };

      await expect(issueService.createIssue(newIssue)).rejects.toThrowError(
        "Issue content exceeds the maximum length of 500 characters",
      );
      expect(issueRepository.createIssue).not.toHaveBeenCalled();
    });
  });

  it("should update an existing issue", async () => {
    const updateData: Partial<Issue> = { content: "Updated Issue" };
    const updatedIssue: Issue = {
      issue_id: 1,
      user_id: "1",
      department_id: 1,
      location_id: null,
      category_id: 1,
      content: "Updated Issue",
      resolved_at: null,
      is_anonymous: false,
      created_at: "2022-01-01",
      sentiment: "neutral",
    };
    issueRepository.updateIssue.mockResolvedValue(updatedIssue);

    const issue = await issueService.updateIssue(1, updateData);

    expect(issue).toEqual(updatedIssue);
    expect(issueRepository.updateIssue).toHaveBeenCalledWith(1, updateData);
    expect(issueRepository.updateIssue).toHaveBeenCalledTimes(1);
  });

  it("should delete an issue", async () => {
    issueRepository.deleteIssue.mockResolvedValue();

    await issueService.deleteIssue(1);

    expect(issueRepository.deleteIssue).toHaveBeenCalledWith(1);
    expect(issueRepository.deleteIssue).toHaveBeenCalledTimes(1);
  });
});
