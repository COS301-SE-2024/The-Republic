import request from "supertest";
import express from "express";
import userRouter from "../../routes/userRoutes";
import {
  getUserById,
  updateUserProfile,
} from "../../controllers/userController";
import { verifyAndGetUser } from "../../middleware/middleware";

jest.mock("../../middleware/middleware");
jest.mock("../../controllers/userController");

const app = express();
app.use(express.json());
app.use("/users", userRouter);

describe("User Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /users/:id", () => {
    it("should call getUserById controller", async () => {
      (verifyAndGetUser as jest.Mock).mockImplementation((req, res, next) =>
        next(),
      );
      (getUserById as jest.Mock).mockImplementation((req, res) =>
        res.status(200).json({}),
      );

      const response = await request(app).get("/users/1").send();

      expect(response.status).toBe(200);
      expect(getUserById).toHaveBeenCalled();
    });
  });

  describe("PUT /users/:id", () => {
    it("should call updateUserProfile controller", async () => {
      (verifyAndGetUser as jest.Mock).mockImplementation((req, res, next) =>
        next(),
      );
      (updateUserProfile as jest.Mock).mockImplementation((req, res) =>
        res.status(200).json({}),
      );

      const response = await request(app).put("/users/1").send();

      expect(response.status).toBe(200);
      expect(updateUserProfile).toHaveBeenCalled();
    });
  });
});
