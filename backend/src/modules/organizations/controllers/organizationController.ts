import { Request, Response } from "express";
import { OrganizationService } from "../services/organizationService";
import { sendResponse } from "@/utilities/response";
import { APIData, APIError } from "@/types/response";
import { PaginationParams } from "@/types/pagination";
import multer from "multer";
import { cacheMiddleware } from "@/middleware/cacheMiddleware";
import { clearCachePattern } from "@/utilities/cacheUtils";

const organizationService = new OrganizationService();
const upload = multer({ storage: multer.memoryStorage() });

export const createOrganization = async (req: Request, res: Response) => {
  try {
    const userId = req.body.user_id;
    if (!userId) {
      return sendResponse(res, APIError({
        code: 401,
        success: false,
        error: "Unauthorized: User ID is missing",
      }));
    }

    const response = await organizationService.createOrganization(req.body, userId);
    clearCachePattern('__express__/api/organizations*');
    sendResponse(res, response);
  } catch (err) {
    handleError(res, err);
  }
};

export const updateOrganization = [
    upload.single("profilePhoto"),
    async (req: Request, res: Response) => {
      try {
        const userId = req.body.user_id;
        const organizationId = req.params.id;
        if (!userId) {
          return sendResponse(res, APIError({
            code: 401,
            success: false,
            error: "Unauthorized: User ID is missing",
          }));
        }
  
        const response = await organizationService.updateOrganization(organizationId, req.body, userId, req.file);
        clearCachePattern(`__express__/api/organizations/${organizationId}`);
        sendResponse(res, response);
      } catch (err) {
        handleError(res, err);
      }
    }
  ];

export const deleteOrganization = async (req: Request, res: Response) => {
  try {
    const userId = req.body.user_id;
    const organizationId = req.params.id;
    if (!userId) {
      return sendResponse(res, APIError({
        code: 401,
        success: false,
        error: "Unauthorized: User ID is missing",
      }));
    }

    const response = await organizationService.deleteOrganization(organizationId, userId);
    clearCachePattern(`__express__/api/organizations/${organizationId}`);
    sendResponse(res, response);
  } catch (err) {
    handleError(res, err);
  }
};

export const joinOrganization = async (req: Request, res: Response) => {
    try {
      const userId = req.body.user_id;
      const organizationId = req.params.id;
      if (!userId) {
        return sendResponse(res, APIError({
          code: 401,
          success: false,
          error: "Unauthorized: User ID is missing",
        }));
      }
  
      const response = await organizationService.joinOrganization(organizationId, userId);
      clearCachePattern(`__express__/api/organizations/${organizationId}/join-requests`);
      sendResponse(res, response);
    } catch (err) {
      console.error("Error in joinOrganization controller:", err);
      handleError(res, err);
    }
  };

export const setJoinPolicy = async (req: Request, res: Response) => {
  try {
    const userId = req.body.user_id;
    const organizationId = req.params.id;
    const { joinPolicy } = req.body;
    if (!userId) {
      return sendResponse(res, APIError({
        code: 401,
        success: false,
        error: "Unauthorized: User ID is missing",
      }));
    }

    const response = await organizationService.setJoinPolicy(organizationId, joinPolicy, userId);
    clearCachePattern(`__express__/api/organizations/${organizationId}`);
    sendResponse(res, response);
  } catch (err) {
    handleError(res, err);
  }
};

export const getJoinRequests = [
    cacheMiddleware(300),
    async (req: Request, res: Response) => {
      try {
        const userId = req.body.user_id;
        const organizationId = req.params.id;
        const { offset, limit } = req.query;
        if (!userId) {
          return sendResponse(res, APIError({
            code: 401,
            success: false,
            error: "Unauthorized: User ID is missing",
          }));
        }
  
        const paginationParams: PaginationParams = {
          offset: Number(offset) || 0,
          limit: Number(limit) || 10
        };
  
        const response = await organizationService.getJoinRequests(organizationId, userId, paginationParams);
        sendResponse(res, response);
      } catch (err) {
        handleError(res, err);
      }
    }
  ];

  export const handleJoinRequest = async (req: Request, res: Response) => {
    try {
      const userId = req.body.user_id;
      const organizationId = req.params.id;
      const requestId = parseInt(req.params.requestId, 10);
      const { accept } = req.body;
  
      if (!userId) {
        return sendResponse(res, APIError({
          code: 401,
          success: false,
          error: "Unauthorized: User ID is missing",
        }));
      }
  
      if (isNaN(requestId)) {
        return sendResponse(res, APIError({
          code: 400,
          success: false,
          error: "Invalid request ID",
        }));
      }
  
      if (typeof accept !== 'boolean') {
        return sendResponse(res, APIError({
          code: 400,
          success: false,
          error: "Accept must be a boolean value",
        }));
      }
  
      const response = await organizationService.handleJoinRequest(organizationId, requestId, accept, userId);
      clearCachePattern(`__express__/api/organizations/${organizationId}/join-requests`);
      sendResponse(res, response);
    } catch (err) {
      handleError(res, err);
    }
  };

export const removeMember = async (req: Request, res: Response) => {
  try {
    const adminId = req.body.user_id;
    const organizationId = req.params.id;
    const memberUserId = req.params.userId;
    if (!adminId) {
      return sendResponse(res, APIError({
        code: 401,
        success: false,
        error: "Unauthorized: User ID is missing",
      }));
    }

    const response = await organizationService.removeMember(organizationId, memberUserId, adminId);
    clearCachePattern(`__express__/api/organizations/${organizationId}`);
    sendResponse(res, response);
  } catch (err) {
    handleError(res, err);
  }
};

export const getOrganizations = [
    cacheMiddleware(300),
    async (req: Request, res: Response) => {
      try {
        const { offset, limit } = req.query;
        const paginationParams: PaginationParams = {
          offset: Number(offset) || 0,
          limit: Number(limit) || 10
        };
  
        const response = await organizationService.getOrganizations(paginationParams);
        sendResponse(res, response);
      } catch (err) {
        handleError(res, err);
      }
    }
  ];

export const getOrganizationById = [
    cacheMiddleware(300),
    async (req: Request, res: Response) => {
      try {
        const organizationId = req.params.id;
        const response = await organizationService.getOrganizationById(organizationId);
        sendResponse(res, response);
      } catch (err) {
        handleError(res, err);
      }
    }
  ];

export const generateReport = async (req: Request, res: Response) => {
  try {
    const userId = req.body.user_id;
    const organizationId = req.params.id;
    if (!userId) {
      return sendResponse(res, APIError({
        code: 401,
        success: false,
        error: "Unauthorized: User ID is missing",
      }));
    }

    const response = await organizationService.generateReport(organizationId, userId);
    sendResponse(res, response);
  } catch (err) {
    handleError(res, err);
  }
};

export const getUserOrganizations = [
    cacheMiddleware(300),
    async (req: Request, res: Response) => {
      try {
        const userId = req.body.user_id;
        if (!userId) {
          return sendResponse(res, APIError({
            code: 401,
            success: false,
            error: "Unauthorized: User ID is missing",
          }));
        }
  
        const response = await organizationService.getUserOrganizations(userId);
        sendResponse(res, response);
      } catch (err) {
        handleError(res, err);
      }
    }
  ];
  
  export const leaveOrganization = async (req: Request, res: Response) => {
    try {
      const userId = req.body.user_id;
      const organizationId = req.params.id;
      if (!userId) {
        return sendResponse(res, APIError({
          code: 401,
          success: false,
          error: "Unauthorized: User ID is missing",
        }));
      }
  
      const response = await organizationService.leaveOrganization(organizationId, userId);
      clearCachePattern(`__express__/api/organizations/${organizationId}`);
      sendResponse(res, response);
    } catch (err) {
      handleError(res, err);
    }
  };
  
  export const deleteJoinRequest = async (req: Request, res: Response) => {
    try {
      const userId = req.body.user_id;
      const requestId = Number(req.params.requestId);
      if (!userId) {
        return sendResponse(res, APIError({
          code: 401,
          success: false,
          error: "Unauthorized: User ID is missing",
        }));
      }
  
      const response = await organizationService.deleteJoinRequest(requestId, userId);
      clearCachePattern(`__express__/api/organizations/*/join-requests`);
      sendResponse(res, response);
    } catch (err) {
      handleError(res, err);
    }
  };

  const handleError = (res: Response, err: unknown) => {
    console.error("Handling error:", err);
    if (err instanceof Error) {
      sendResponse(res, APIData({
        code: 500,
        success: false,
        error: err.message || "An unexpected error occurred",
      }));
    } else {
      sendResponse(res, APIData({
        code: 500,
        success: false,
        error: "An unexpected error occurred",
      }));
    }
  };

  export const searchOrganizations = [
    cacheMiddleware(300),
    async (req: Request, res: Response) => {
      try {
        const { searchTerm, offset, limit } = req.query;
        
        if (typeof searchTerm !== 'string') {
          return sendResponse(res, APIError({
            code: 400,
            success: false,
            error: "Search term is required and must be a string",
          }));
        }
  
        const paginationParams: PaginationParams = {
          offset: Number(offset) || 0,
          limit: Number(limit) || 10
        };
  
        const response = await organizationService.searchOrganizations(searchTerm, paginationParams);
        sendResponse(res, response);
      } catch (err) {
        handleError(res, err);
      }
    }
  ];