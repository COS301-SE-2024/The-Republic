import request from "supertest";
import express from "express";
import locationRouter from "../../routes/locationRoutes";
import * as locationController from "../../controllers/locationController";

jest.mock("../../controllers/locationController");

const app = express();
app.use(express.json());
app.use("/locations", locationRouter);

describe("Location Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /locations/", () => {
    it("should call getAllLocations controller", async () => {
      (locationController.getAllLocations as jest.Mock).mockImplementation((req, res) =>
        res.status(200).json({}),
      );

      const response = await request(app).post("/locations/");

      expect(response.status).toBe(200);
      expect(locationController.getAllLocations).toHaveBeenCalled();
    });
  });
});