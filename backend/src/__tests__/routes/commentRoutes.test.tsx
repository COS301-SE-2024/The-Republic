import request from "supertest";
import express from "express";
import commentsRouter from "@/modules/comments/routes/commentRoutes";
import * as commentController from "@/modules/comments/controllers/commentController";
import { verifyAndGetUser } from "@/middleware/middleware";

jest.mock("@/middleware/middleware");
jest.mock("@/modules/comments/controllers/commentController");
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
app.use("/comments", commentsRouter);

describe("Comments Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /comments/add", () => {
    it("should call addComment controller", async () => {
      (verifyAndGetUser as jest.Mock).mockImplementation((req, res, next) =>
        next(),
      );
      (commentController.addComment as jest.Mock).mockImplementation(
        (req, res) => res.status(200).json({}),
      );

      const response = await request(app).post("/comments/add").send();

      expect(response.status).toBe(200);
      expect(commentController.addComment).toHaveBeenCalled();
    });
  });

  describe("DELETE /comments/delete", () => {
    it("should call deleteComment controller", async () => {
      (verifyAndGetUser as jest.Mock).mockImplementation((req, res, next) =>
        next(),
      );
      (commentController.deleteComment as jest.Mock).mockImplementation(
        (req, res) => res.status(200).json({}),
      );

      const response = await request(app).delete("/comments/delete").send();

      expect(response.status).toBe(200);
      expect(commentController.deleteComment).toHaveBeenCalled();
    });
  });
});
