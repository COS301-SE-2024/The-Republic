import request from "supertest";
import express from "express";
import issueRouter from "@/modules/issues/routes/issueRoutes";
import * as issueController from "@/modules/issues/controllers/issueController";
import { verifyAndGetUser } from "@/middleware/middleware";

jest.mock("@/middleware/middleware");
jest.mock("@/modules/issues/controllers/issueController", () => ({
  getIssues: [jest.fn()],
  getIssueById: [jest.fn()],
  createIssue: [jest.fn()],
  updateIssue: [jest.fn()],
  deleteIssue: [jest.fn()],
  getUserIssues: [jest.fn()],
  getUserResolvedIssues: [jest.fn()],
  createSelfResolution: [jest.fn()],
  createExternalResolution: [jest.fn()],
  respondToResolution: [jest.fn()],
  getUserResolutions: [jest.fn()],
  deleteResolution: [jest.fn()],
  getOrganizationResolutions: [jest.fn()],
}));

const app = express();
app.use(express.json());
app.use("/issues", issueRouter);

describe("Issue Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (verifyAndGetUser as jest.Mock).mockImplementation((req, res, next) =>
      next(),
    );
  });

  it("should call getIssues controller", async () => {
    (issueController.getIssues[0] as jest.Mock).mockImplementation((req, res) =>
      res.status(200).json({}),
    );

    const response = await request(app).post("/issues");

    expect(response.status).toBe(200);
    expect(issueController.getIssues[0]).toHaveBeenCalled();
  });
});
