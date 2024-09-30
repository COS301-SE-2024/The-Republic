import request from "supertest";
import express, { Request, Response, NextFunction } from "express";
import visualizationRouter from "@/modules/visualizations/routes/visualizationRoutes";

jest.mock("@/middleware/cacheMiddleware", () => ({
  cacheMiddleware: jest.fn().mockImplementation(() => (req: Request, res: Response, next: NextFunction) => next()),
}));
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

jest.mock("@/modules/visualizations/controllers/visualizationController", () => ({
  getVizData: jest.fn().mockImplementation((req: Request, res: Response) => {
    return res.status(200).json({});
  }),
}));

const app = express();
app.use(express.json());
app.use("/visualizations", visualizationRouter);


describe("Visualization Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /visualizations", () => {
    it("should call getVizData controller", async () => {
      const response = await request(app).post("/visualizations").send();

      expect(response.status).toBe(200);
      expect(require("@/modules/visualizations/controllers/visualizationController").getVizData).toHaveBeenCalled();
    });
  });
});
