import request from "supertest";
import express from "express";
import reactionRouter from "@/modules/reactions/routes/reactionRoutes";
import reactionController from "@/modules/reactions/controllers/reactionController";
import { verifyAndGetUser } from "@/middleware/middleware";

jest.mock("@/middleware/middleware");
jest.mock("@/modules/reactions/controllers/reactionController");
jest.mock("@/middleware/cacheMiddleware");
jest.mock("@/utilities/cacheUtils");

jest.mock("@/modules/shared/services/redisClient", () => ({
  __esModule: true,
  default: {
    on: jest.fn(),
    get: jest.fn(),
    setex: jest.fn(),
    del: jest.fn(),
    keys: jest.fn().mockResolvedValue([]),
  },
}));

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
