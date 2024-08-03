import express from "express";
import request from "supertest";
import subscriptionsRouter from "@/modules/subscriptions/routes/subscriptionsRoutes";
import * as subscriptionsController from "@/modules/subscriptions/controllers/subscriptionsController";
import { verifyAndGetUser } from "@/middleware/middleware";

const app = express();
app.use(express.json());
app.use("/subscriptions", subscriptionsRouter);

jest.mock("@/middleware/middleware");
jest.mock("@/modules/subscriptions/controllers/subscriptionsController");

describe("Subscription Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /subscriptions/issue", () => {
    it("should call issueSubscriptions controller", async () => {
      (verifyAndGetUser as jest.Mock).mockImplementation((req, res, next) => next());
      (subscriptionsController.issueSubscriptions as jest.Mock).mockImplementation((req, res) =>
        res.status(200).json({ message: "Issue subscription successful" }),
      );

      const response = await request(app).post("/subscriptions/issue").send();

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Issue subscription successful");
      expect(subscriptionsController.issueSubscriptions).toHaveBeenCalled();
    });
  });

  describe("POST /subscriptions/category", () => {
    it("should call categorySubscriptions controller", async () => {
      (verifyAndGetUser as jest.Mock).mockImplementation((req, res, next) => next());
      (subscriptionsController.categorySubscriptions as jest.Mock).mockImplementation((req, res) =>
        res.status(200).json({ message: "Category subscription successful" }),
      );

      const response = await request(app).post("/subscriptions/category").send();

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Category subscription successful");
      expect(subscriptionsController.categorySubscriptions).toHaveBeenCalled();
    });
  });

  describe("POST /subscriptions/location", () => {
    it("should call locationSubscriptions controller", async () => {
      (verifyAndGetUser as jest.Mock).mockImplementation((req, res, next) => next());
      (subscriptionsController.locationSubscriptions as jest.Mock).mockImplementation((req, res) =>
        res.status(200).json({ message: "Location subscription successful" }),
      );

      const response = await request(app).post("/subscriptions/location").send();

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Location subscription successful");
      expect(subscriptionsController.locationSubscriptions).toHaveBeenCalled();
    });
  });

  describe("POST /subscriptions/subscriptions", () => {
    it("should call getSubscriptions controller", async () => {
      (verifyAndGetUser as jest.Mock).mockImplementation((req, res, next) => next());
      (subscriptionsController.getSubscriptions as jest.Mock).mockImplementation((req, res) =>
        res.status(200).json({ message: "Get subscriptions successful" }),
      );

      const response = await request(app).post("/subscriptions/subscriptions").send();

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Get subscriptions successful");
      expect(subscriptionsController.getSubscriptions).toHaveBeenCalled();
    });
  });
});