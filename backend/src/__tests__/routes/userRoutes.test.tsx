import request from "supertest";
import express from "express";
import { verifyAndGetUser } from "@/middleware/middleware";
import * as userController from "@/modules/users/controllers/userController";
import userRouter from "@/modules/users/routes/userRoutes";

// Mock the middleware and controllers
jest.mock("@/middleware/middleware");
jest.mock("@/modules/users/controllers/userController", () => ({
  getUserById: [jest.fn()],
  updateUserProfile: jest.fn(),
  updateUsername: jest.fn(), 
  changePassword: jest.fn(), 
  searchForUser: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use("/users", userRouter);

describe("User Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (verifyAndGetUser as jest.Mock).mockImplementation((req, res, next) => next());
  });

  describe("GET /users/:id", () => {
    it("should call getUserById controller", async () => {
      (verifyAndGetUser as jest.Mock).mockImplementation((req, res, next) =>
        next(),
      );
      (userController.getUserById[0] as jest.Mock).mockImplementation((req, res) =>
        res.status(200).json({}),
      );

      const response = await request(app).post("/users/1").send();

      expect(response.status).toBe(200);
      expect(userController.getUserById[0]).toHaveBeenCalled();
    });
  });

  describe("PUT /users/:id", () => {
    it("should call updateUserProfile controller", async () => {
      (verifyAndGetUser as jest.Mock).mockImplementation((req, res, next) =>
        next(),
      );
      (userController.updateUserProfile as jest.Mock).mockImplementation((req, res) =>
        res.status(200).json({}),
      );

      const response = await request(app).put("/users/1").send();

      expect(response.status).toBe(200);
      expect(userController.updateUserProfile).toHaveBeenCalled();
    });
  });

  describe("PUT /users/:id/username", () => {
    it("should call updateUsername controller", async () => {
      (verifyAndGetUser as jest.Mock).mockImplementation((req, res, next) =>
        next(),
      );
      (userController.updateUsername as jest.Mock).mockImplementation((req, res) =>
        res.status(200).json({}),
      );

      const response = await request(app).put("/users/1/username").send({ username: "newUsername" });

      expect(response.status).toBe(200);
      expect(userController.updateUsername).toHaveBeenCalled();
    });
  });

  describe("PUT /users/:id/password", () => {
    it("should call changePassword controller", async () => {
      (verifyAndGetUser as jest.Mock).mockImplementation((req, res, next) =>
        next(),
      );
      (userController.changePassword as jest.Mock).mockImplementation((req, res) =>
        res.status(200).json({}),
      );

      const response = await request(app).put("/users/1/password").send({ password: "newPassword" });

      expect(response.status).toBe(200);
      expect(userController.changePassword).toHaveBeenCalled();
    });
  });

  // describe("POST /username/exists", () => {
  //   it("should call usernameExists controller", async () => {
  //     (verifyAndGetUser as jest.Mock).mockImplementation((req, res, next) =>
  //       next(),
  //     );
  //     (userController.usernameExists as jest.Mock).mockImplementation((req, res) =>
  //       res.status(200).json({}),
  //     );

  //     const response = await request(app).post("/username/exists").send({ username: "user" });

  //     expect(response.status).toBe(200);
  //     expect(userController.usernameExists).toHaveBeenCalled();
  //   });
  // });
});
