import request from "supertest";
import express from "express";
import reportsRouter from "@/modules/reports/routes/reportsRoutes";
import * as reportsController from "@/modules/reports/controllers/reportsController";
import { verifyAndGetUser } from "@/middleware/middleware";

jest.mock("@/middleware/middleware");
jest.mock("@/modules/reports/controllers/reportsController", () => ({
  getAllIssuesGroupedByResolutionStatus: [jest.fn()],
  getIssueCountsGroupedByResolutionStatus: [jest.fn()],
  getIssueCountsGroupedByResolutionAndCategory: [jest.fn()],
  getIssuesGroupedByCreatedAt: [jest.fn()],
  getIssuesGroupedByCategory: [jest.fn()],
  getIssuesCountGroupedByCategoryAndCreatedAt: [jest.fn()],
  groupedByPoliticalAssociation: [jest.fn()],
}));

const app = express();
app.use(express.json());
app.use("/reports", reportsRouter);

describe("Reports Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (verifyAndGetUser as jest.Mock).mockImplementation((req, res, next) => next());
  });

  it("should call getAllIssuesGroupedByResolutionStatus controller", async () => {
    (reportsController.getAllIssuesGroupedByResolutionStatus[0] as jest.Mock).mockImplementation((req, res) => res.status(200).json({}));

    const response = await request(app).post("/reports/groupedResolutionStatus");

    expect(response.status).toBe(200);
    expect(reportsController.getAllIssuesGroupedByResolutionStatus[0]).toHaveBeenCalled();
  });
});
