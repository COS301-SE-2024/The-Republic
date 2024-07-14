import request from "supertest";
import express from "express";
import reactionRouter from "../../routes/reactionRoutes";
import reactionController from "../../controllers/reactionController";
import { verifyAndGetUser } from "../../middleware/middleware";

jest.mock("../../middleware/middleware");
jest.mock("../../controllers/reactionController");

const app = express();
app.use(express.json());
app.use("/reactions", reactionRouter);

describe("Reaction Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /reactions/", () => {
    it("should call addOrRemoveReaction controller", async () => {
      (verifyAndGetUser as jest.Mock).mockImplementation((req, res, next) =>
        next(),
      );
      (reactionController.addOrRemoveReaction as jest.Mock).mockImplementation(
        (req, res) => res.status(200).json({}),
      );

      const response = await request(app).post("/reactions/").send();

      expect(response.status).toBe(200);
      expect(reactionController.addOrRemoveReaction).toHaveBeenCalled();
    });
  });
});
