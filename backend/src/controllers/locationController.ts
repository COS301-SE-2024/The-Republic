import { Request, Response } from "express";
import { LocationService } from "../services/locationService";
import { sendResponse } from "../utils/response";
import { APIResponse } from "../types/response";

const locationService = new LocationService();

export const getAllLocations = async (req: Request, res: Response) => {
  try {
    const response = await locationService.getAllLocations();
    sendResponse(res, response);
  } catch (err) {
    sendResponse(res, err as APIResponse);
  }
};