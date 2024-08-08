import request from "supertest";
import express from "express";
import visualizationRouter from "@/modules/visualizations/routes/visualizationRoutes";
import * as visualizationController from "@/modules/visualizations/controllers/visualizationController";

jest.mock("@/modules/visualizations/controllers/visualizationController");

const app = express();
app.use(express.json());
app.use("/visualizations", visualizationRouter);

describe("Visualization Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /visualizations/", () => {
    it("should call getVizData controller", async () => {
      (visualizationController.getVizData as jest.Mock).mockImplementation(
        (req, res) => res.status(200).json({}),
      );

      const response = await request(app).post("/visualizations/").send();

      expect(response.status).toBe(200);
      expect(visualizationController.getVizData).toHaveBeenCalled();
    });
  });
});
