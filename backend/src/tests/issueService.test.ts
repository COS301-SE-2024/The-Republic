import IssueService from "../services/issueService";
import IssueRepository from "../db/issueRepository";
import { Issue } from "../models/issue";
import { APIResponse } from "../types/response";

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
        location_id: null,
        category_id: 1,
        content: "Test Issue",
        resolved_at: null,
        is_anonymous: false,
        created_at: "2024-06-01",
        sentiment: "angry",
        image_url: null,
        user: {
          user_id: "1",
          email_address: "test@example.com",
          username: "testuser",
          fullname: "Test User",
          image_url: "https://example.com/image.png"
        },
        category: {
          name: "Category 1"
        },
        reactions: []
      }
    ];
    issueRepository.getIssues.mockResolvedValue(mockIssues);

    const response = await issueService.getIssues({from: 0, amount: 999});

    expect(response.data).toEqual(mockIssues);
    expect(issueRepository.getIssues).toHaveBeenCalledTimes(1);
  });

  it("should get an issue by ID", async () => {
    const mockIssue: Issue = {
      issue_id: 1,
      user_id: "1",
      location_id: null,
      category_id: 1,
      content: "Test Issue",
      resolved_at: null,
      is_anonymous: false,
      created_at: "2022-01-01",
      sentiment: "neutral",
      image_url: null,
      user: {
        user_id: "1",
        email_address: "test@example.com",
        username: "testuser",
        fullname: "Test User",
        image_url: "https://example.com/image.png"
      },
      category: {
        name: "Category 1"
      },
      reactions: []
    };
    issueRepository.getIssueById.mockResolvedValue(mockIssue);

    const response = await issueService.getIssueById({ issue_id: 1});

    expect(response.data).toEqual(mockIssue);
    expect(issueRepository.getIssueById).toHaveBeenCalledWith(1, undefined);
    expect(issueRepository.getIssueById).toHaveBeenCalledTimes(1);
  });

  describe("createIssue", () => {
    it("should create a new issue when all required fields are provided", async () => {
      const newIssue: Partial<Issue> = {
        user_id: "1",
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
        image_url: null,
        user: {
          user_id: "1",
          email_address: "test@example.com",
          username: "testuser",
          fullname: "Test User",
          image_url: "https://example.com/image.png"
        },
        category: {
          name: "Category 1"
        },
        reactions: []
      } as Issue;
      issueRepository.createIssue.mockResolvedValue(createdIssue);

      const response = await issueService.createIssue(newIssue);

      expect(response.data).toEqual(createdIssue);
      expect(issueRepository.createIssue).toHaveBeenCalledWith(newIssue);
      expect(issueRepository.createIssue).toHaveBeenCalledTimes(1);
    });

    it("should throw an error when required fields are missing", async () => {
      const newIssue: Partial<Issue> = { user_id: "1", content: "New Issue" };

      await expect((async () => {
        try {
          await issueService.createIssue(newIssue);
        } catch(error) {
          throw new Error((error as APIResponse).error);
        }
      })()).rejects.toThrow(
        "Missing required fields for creating an issue"
      );
      expect(issueRepository.createIssue).not.toHaveBeenCalled();
    });

    it("should throw an error when content exceeds the maximum length", async () => {
      const newIssue: Partial<Issue> = {
        user_id: "1",
        location_id: null,
        category_id: 1,
        content: "A".repeat(501),
        resolved_at: null,
        is_anonymous: false,
        sentiment: "neutral",
      };

      await expect((async () => {
        try {
          await issueService.createIssue(newIssue);
        } catch(error) {
          throw new Error((error as APIResponse).error);
        }
      })()).rejects.toThrow(
        "Issue content exceeds the maximum length of 500 characters"
      );
      expect(issueRepository.createIssue).not.toHaveBeenCalled();
    });
  });

  it("should update an existing issue", async () => {
    const updateData: Partial<Issue> = { content: "Updated Issue" };
    const updatedIssue: Issue = {
      issue_id: 1,
      user_id: "1",
      location_id: null,
      category_id: 1,
      content: "Updated Issue",
      resolved_at: null,
      is_anonymous: false,
      created_at: "2022-01-01",
      sentiment: "neutral",
      image_url: null,
      user: {
        user_id: "1",
        email_address: "test@example.com",
        username: "testuser",
        fullname: "Test User",
        image_url: "https://example.com/image.png"
      },
      category: {
        name: "Category 1"
      },
      reactions: []
    };
    issueRepository.updateIssue.mockResolvedValue(updatedIssue);

    const response = await issueService.updateIssue({ issue_id: 1, user_id: "1", ...updateData});

    expect(response.data).toEqual(updatedIssue);
    expect(issueRepository.updateIssue).toHaveBeenCalledWith(1, updateData, "1");
    expect(issueRepository.updateIssue).toHaveBeenCalledTimes(1);
  });

  it("should delete an issue", async () => {
    issueRepository.deleteIssue.mockResolvedValue();

    await issueService.deleteIssue({ issue_id: 1, user_id: "1" });

    expect(issueRepository.deleteIssue).toHaveBeenCalledWith(1, "1");
    expect(issueRepository.deleteIssue).toHaveBeenCalledTimes(1);
  });
});
