import { Request, Response } from "express";
import { PointsService } from "@/modules/points/services/pointsService";
import { LocationService } from "@/modules/locations/services/locationService";
import { sendResponse } from "@/utilities/response";
import { APIResponse, APIError } from "@/types/response";
import { cacheMiddleware } from "@/middleware/cacheMiddleware";

export class PointsController {
  private pointsService: PointsService;
  private locationService: LocationService;

  constructor() {
    this.pointsService = new PointsService();
    this.locationService = new LocationService();
  }

  getLeaderboard = [
    cacheMiddleware(300),
    async (req: Request, res: Response) => {
      try {
        const { userId, province, city, suburb } = req.body;

        if (!userId) {
          throw APIError({
            code: 400,
            success: false,
            error: "User ID is required",
          });
        }

        const leaderboard = await this.pointsService.getLeaderboard({
          province,
          city,
          suburb,
        });
        const userPosition = await this.pointsService.getUserPosition(userId, {
          province,
          city,
          suburb,
        });

        const response = {
          code: 200,
          success: true,
          data: {
            userPosition,
            leaderboard,
          },
        };

        sendResponse(res, response);
      } catch (err) {
        sendResponse(res, err as APIResponse);
      }
    },
  ];
}
