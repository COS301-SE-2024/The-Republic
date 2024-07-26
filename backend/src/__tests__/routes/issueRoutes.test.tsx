import request from "supertest";
import express from "express";
import issuesRouter from "@/modules/issues/routes/issueRoutes";
import * as issueController from "@/modules/issues/controllers/issueController";
import { verifyAndGetUser } from "@/infrastructure/middleware/middleware";

jest.mock("@/infrastructure/middleware/middleware");
jest.mock("@/modules/issues/controllers/issueController");

const app = express();
app.use(express.json());
app.use("/issues", issuesRouter);

describe("Issue Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /issues/", () => {
    it("should call getIssues controller", async () => {
      (verifyAndGetUser as jest.Mock).mockImplementation((req, res, next) =>
        next(),
      );
      (issueController.getIssues as jest.Mock).mockImplementation((req, res) =>
        res.status(200).json({}),
      );

      const response = await request(app).post("/issues/").send();

      expect(response.status).toBe(200);
      expect(issueController.getIssues).toHaveBeenCalled();
    });
  });
});
