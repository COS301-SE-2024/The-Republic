import request from "supertest";
import express from "express";
import commentsRouter from "../../routes/commentRoutes";
import * as commentController from "../../controllers/commentController";
import { verifyAndGetUser } from "../../middleware/middleware";

jest.mock("../../middleware/middleware");
jest.mock("../../controllers/commentController");

const app = express();
app.use(express.json());
app.use("/comments", commentsRouter);

describe("Comments Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /comments/", () => {
    it("should call getComments controller", async () => {
      (verifyAndGetUser as jest.Mock).mockImplementation((req, res, next) =>
        next(),
      );
      (commentController.getComments as jest.Mock).mockImplementation(
        (req, res) => res.status(200).json({}),
      );

      const response = await request(app).post("/comments/").send();

      expect(response.status).toBe(200);
      expect(commentController.getComments).toHaveBeenCalled();
    });
  });

  describe("POST /comments/count", () => {
    it("should call getNumComments controller", async () => {
      (verifyAndGetUser as jest.Mock).mockImplementation((req, res, next) =>
        next(),
      );
      (commentController.getNumComments as jest.Mock).mockImplementation(
        (req, res) => res.status(200).json({}),
      );

      const response = await request(app).post("/comments/count").send();

      expect(response.status).toBe(200);
      expect(commentController.getNumComments).toHaveBeenCalled();
    });
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
