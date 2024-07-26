import { Request, Response } from "express";
import { VisualizationService } from "@/modules/visualizations/services/visualizationService";
import { APIResponse } from "@/types/response";
import { sendResponse } from "@/modules/infrastructure/utilities/response";

const visualizationService = new VisualizationService();

export async function getVizData(req: Request, res: Response) {
  try {
    const response = await visualizationService.getVizData();
    sendResponse(res, response);
  } catch (error) {
    sendResponse(res, error as APIResponse);
  }
}
