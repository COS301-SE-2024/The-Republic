import request from "supertest";
import express from "express";
import locationRouter from "@/modules/locations/routes/locationRoutes";
import * as locationController from "@/modules/locations/controllers/locationController";

jest.mock("@/modules/locations/controllers/locationController", () => ({
  getAllLocations: [jest.fn()],
  getLocationById: [jest.fn()],
}));

const app = express();
app.use(express.json());
app.use("/locations", locationRouter);

describe("Location Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /locations/", () => {
    it("should call getAllLocations controller", async () => {
      (locationController.getAllLocations[0] as jest.Mock).mockImplementation(
        (req, res) => res.status(200).json({}),
      );

      const response = await request(app).post("/locations/");

      expect(response.status).toBe(200);
      expect(locationController.getAllLocations[0]).toHaveBeenCalled();
    });
  });
});
