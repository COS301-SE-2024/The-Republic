import request from "supertest";
import express from "express";
import reportsRouter from "../../routes/reportsRoutes";
import * as reportsController from "../../controllers/reportsController";
import { verifyAndGetUser } from "../../middleware/middleware";

jest.mock("../../middleware/middleware");
jest.mock("../../controllers/reportsController");

const app = express();
app.use(express.json());
app.use("/reports", reportsRouter);

describe("Reports Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /reports/groupedResolutionStatus", () => {
    it("should call getAllIssuesGroupedByResolutionStatus controller", async () => {
      (verifyAndGetUser as jest.Mock).mockImplementation((req, res, next) =>
        next(),
      );
      (
        reportsController.getAllIssuesGroupedByResolutionStatus as jest.Mock
      ).mockImplementation((req, res) => res.status(200).json({}));

      const response = await request(app)
        .post("/reports/groupedResolutionStatus")
        .send();

      expect(response.status).toBe(200);
      expect(
        reportsController.getAllIssuesGroupedByResolutionStatus,
      ).toHaveBeenCalled();
    });
  });
});
