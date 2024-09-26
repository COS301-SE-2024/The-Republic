import { Request, Response } from "express";
import { LocationService } from "@/modules/locations/services/locationService";
import { sendResponse } from "@/utilities/response";
import { APIResponse } from "@/types/response";
import { cacheMiddleware } from "@/middleware/cacheMiddleware";

const locationService = new LocationService();

export const getAllLocations = [
  cacheMiddleware(300),
  async (req: Request, res: Response) => {
    try {
      const response = await locationService.getAllLocations();
      sendResponse(res, response);
    } catch (err) {
      sendResponse(res, err as APIResponse);
    }
  },
];

export const getLocationById = [
  cacheMiddleware(300),
  async (req: Request, res: Response) => {
    try {
      const locationId = parseInt(req.params.id);
      const response = await locationService.getLocationById(locationId);
      sendResponse(res, response);
    } catch (err) {
      sendResponse(res, err as APIResponse);
    }
  },
];
