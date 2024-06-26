import { Request, Response } from "express";
import { VisualizationService } from "../services/visualizationService";
import { APIResponse } from "../types/response";
import { sendResponse } from "../utils/response";

const visualizationService = new VisualizationService();

export async function getVizData(req: Request, res: Response) {
  try {
    const response = await visualizationService.getVizData();
    console.log(response);
    sendResponse(res, response);
  } catch(error) {
    sendResponse(res, (error as APIResponse));
  }
}
