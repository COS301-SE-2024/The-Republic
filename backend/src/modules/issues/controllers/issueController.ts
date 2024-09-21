import { Request, Response } from "express";
import IssueService from "@/modules/issues/services/issueService";
import { APIResponse, APIError, APIData } from "@/types/response";
import { sendResponse } from "@/utilities/response";
import multer from "multer";
import { cacheMiddleware } from "@/middleware/cacheMiddleware";
import { clearCache, clearCachePattern } from "@/utilities/cacheUtils";

const issueService = new IssueService();
const upload = multer({ storage: multer.memoryStorage() });

const handleError = (res: Response, err: unknown) => {
  console.error(err);
  if (err instanceof Error) {
    sendResponse(
      res,
      APIError({
        code: 500,
        success: false,
        error: err.message || "An unexpected error occurred",
      }),
    );
  } else {
    sendResponse(res, err as APIResponse);
  }
};

export const getIssues = [
  cacheMiddleware(300),
  async (req: Request, res: Response) => {
    try {
      const response = await issueService.getIssues(req.body);
      sendResponse(res, response);
    } catch (err) {
      handleError(res, err);
    }
  }
];

export const getIssueById = [
  cacheMiddleware(300),
  async (req: Request, res: Response) => {
    try {
      const response = await issueService.getIssueById(req.body);
      sendResponse(res, response);
    } catch (err) {
      handleError(res, err);
    }
  }
];

export const createIssue = [
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      const file = req.file;
      const response = await issueService.createIssue(req.body, file);

      clearCachePattern('__express__/api/issues*');
      
      sendResponse(res, response);
    } catch (err) {
      handleError(res, err);
    }
  },
];

export const updateIssue = async (req: Request, res: Response) => {
  try {
    const response = await issueService.updateIssue(req.body);
    
    clearCache('/api/issues/single', { issueId: req.body.issueId });
    clearCachePattern('__express__/api/issues*');
    
    sendResponse(res, response);
  } catch (err) {
    handleError(res, err);
  }
};

export const deleteIssue = async (req: Request, res: Response) => {
  try {
    const response = await issueService.deleteIssue(req.body);
    clearCachePattern('__express__/api/issues*');
    sendResponse(res, response);
  } catch (err) {
    handleError(res, err);
  }
};

export const resolveIssue = async (req: Request, res: Response) => {
  try {
    const { issueId, userId } = req.body;
    const response = await issueService.createSelfResolution(issueId, userId, "Issue resolved by owner");
    clearCachePattern('__express__/api/issues*');
    sendResponse(res, response);
  } catch (err) {
    handleError(res, err);
  }
};

export const getUserIssues = [
  cacheMiddleware(300),
  async (req: Request, res: Response) => {
    try {
      const response = await issueService.getUserIssues(req.body);
      sendResponse(res, response);
    } catch (err) {
      handleError(res, err);
    }
  }
];

export const getUserResolvedIssues = [
  cacheMiddleware(300),
  async (req: Request, res: Response) => {
    try {
      const response = await issueService.getUserResolvedIssues(req.body);
      sendResponse(res, response);
    } catch (err) {
      handleError(res, err);
    }
  }
];

export const createSelfResolution = [
  upload.single("proofImage"),
  async (req: Request, res: Response) => {
    try {
      const { issueId, userId, resolutionText, organizationId } = req.body;
      const response = await issueService.createSelfResolution(
        parseInt(issueId), 
        userId, 
        resolutionText, 
        req.file,
        organizationId
      );
      clearCachePattern('__express__/api/issues*');
      sendResponse(res, response);
    } catch (err) {
      handleError(res, err);
    }
  },
];

export const createExternalResolution = [
  upload.single("proofImage"),
  async (req: Request, res: Response) => {
    try {
      const { issueId, userId, resolutionText, politicalAssociation, stateEntityAssociation, resolvedBy, organizationId } = req.body;
      const response = await issueService.createExternalResolution(
        parseInt(issueId),
        userId, 
        resolutionText, 
        req.file,
        politicalAssociation,
        stateEntityAssociation,
        resolvedBy,
        organizationId
      );
      clearCachePattern('__express__/api/issues*');
      sendResponse(res, response);
    } catch (err) {
      handleError(res, err);
    }
  },
];

export const getOrganizationResolutions = [
  cacheMiddleware(300),
  async (req: Request, res: Response) => {
    try {
      const { organizationId } = req.body;
      const response = await issueService.getOrganizationResolutions(organizationId);
      sendResponse(res, response);
    } catch (err) {
      handleError(res, err);
    }
  }
];

export const respondToResolution = async (req: Request, res: Response) => {
  try {
    const { resolutionId, issueId, userId, accept, satisfactionRating } = req.body;
    const response = await issueService.respondToResolution(resolutionId, issueId, userId, accept, satisfactionRating);
    clearCachePattern('__express__/api/issues*');
    sendResponse(res, response);
  } catch (err) {
    handleError(res, err);
  }
};

export const getResolutionsForIssue = [
  cacheMiddleware(300),
  async (req: Request, res: Response) => {
    try {
      const { issueId } = req.body;
      const response = await issueService.getResolutionsForIssue(parseInt(issueId));
      sendResponse(res, response);
    } catch (err) {
      handleError(res, err);
    }
  }
];

export const hasUserIssuesInCluster = [
  cacheMiddleware(300),
  async (req: Request, res: Response) => {
    try {
      const { userId, clusterId } = req.body;
      const response = await issueService.hasUserIssuesInCluster(userId, clusterId);
      sendResponse(res, response);
    } catch (err) {
      handleError(res, err);
    }
  }
];

export const getUserIssueInCluster = [
  cacheMiddleware(300),
  async (req: Request, res: Response) => {
    try {
      const { clusterId, user_id } = req.body;

      if (!user_id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const issue = await issueService.getUserIssueInCluster(user_id, clusterId);

      if (issue) {
        return res.json({ issue });
      } else {
        return res.status(404).json({ error: "User issue not found in the cluster" });
      }
    } catch (error) {
      console.error("Error fetching user's issue in cluster:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
];

export const getUserResolutions = [
  cacheMiddleware(300),
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.body;
      const resolutions = await issueService.getUserResolutions(userId);
      sendResponse(res, APIData({
        code: 200,
        success: true,
        data: resolutions,
      }));
    } catch (err) {
      handleError(res, err);
    }
  }
];

export const deleteResolution = async (req: Request, res: Response) => {
  try {
    const { resolutionId, userId } = req.body;
    await issueService.deleteResolution(resolutionId, userId);
    clearCachePattern('__express__/api/issues*');
    sendResponse(res, APIData({
      code: 200,
      success: true
    }));
  } catch (err) {
    handleError(res, err);
  }
};

export const getRelatedIssues = [
  cacheMiddleware(300),
  async (req: Request, res: Response) => {
    try {
      const { issueId } = req.body;
      const userId = req.body?.user_id;

      if (!userId) {
        return sendResponse(res, APIError({
          code: 401,
          success: false,
          error: "Unauthorized",
        }));
      }

      const response = await issueService.getRelatedIssues(parseInt(issueId), userId);
      sendResponse(res, response);
    } catch (err) {
      handleError(res, err);
    }
  }
];
