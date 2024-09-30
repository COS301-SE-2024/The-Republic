import { Request, Response } from "express";
import { VisualizationService } from "@/modules/visualizations/services/visualizationService";
import { APIResponse } from "@/types/response";
import { sendResponse } from "@/utilities/response";
import { cacheMiddleware } from "@/middleware/cacheMiddleware";

const visualizationService = new VisualizationService();

export const getVizData = [
  cacheMiddleware(100),
  async (req: Request, res: Response) => {
    try {
      const response = await visualizationService.getVizData();
      sendResponse(res, response);
    } catch (error) {
      sendResponse(res, error as APIResponse);
    }
  },
];
