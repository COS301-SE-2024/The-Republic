import { Request, Response } from "express";
import { ClusterService } from "../services/clusterService";
import { sendResponse } from "@/utilities/response";
import { APIResponse, APIError } from "@/types/response";
import { cacheMiddleware } from "@/middleware/cacheMiddleware";
import { clearCachePattern } from "@/utilities/cacheUtils";

export class ClusterController {
  private clusterService: ClusterService;

  constructor() {
    this.clusterService = new ClusterService();
  }

  getClusters = [
    cacheMiddleware(300),
    async (req: Request, res: Response) => {
      try {
        const { categoryId, suburb, fromDate, toDate } = req.query;

        if (!categoryId || !suburb) {
          throw APIError({
            code: 400,
            success: false,
            error: "Category ID and Suburb are required",
          });
        }

        const clusters = await this.clusterService.getClusters({
          categoryId: Number(categoryId),
          suburb: String(suburb),
          fromDate: fromDate ? new Date(fromDate as string) : undefined,
          toDate: toDate ? new Date(toDate as string) : undefined,
        });

        const response = {
          code: 200,
          success: true,
          data: clusters,
        };

        sendResponse(res, response);
      } catch (err) {
        sendResponse(res, err as APIResponse);
      }
    }
  ];

  getClusterById = [
    cacheMiddleware(300),
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;

        if (!id) {
          throw APIError({
            code: 400,
            success: false,
            error: "Cluster ID is required",
          });
        }

        const cluster = await this.clusterService.getClusterById(id);

        const response = {
          code: 200,
          success: true,
          data: cluster,
        };

        sendResponse(res, response);
      } catch (err) {
        sendResponse(res, err as APIResponse);
      }
    }
  ];

  assignCluster = async (req: Request, res: Response) => {
    try {
      const { issueId } = req.body;

      if (!issueId) {
        throw APIError({
          code: 400,
          success: false,
          error: "Issue ID is required",
        });
      }

      const clusterId = await this.clusterService.assignClusterToIssue(issueId);

      clearCachePattern('__express__/api/clusters*');

      const response = {
        code: 200,
        success: true,
        data: { clusterId },
      };

      sendResponse(res, response);
    } catch (err) {
      sendResponse(res, err as APIResponse);
    }
  };
}