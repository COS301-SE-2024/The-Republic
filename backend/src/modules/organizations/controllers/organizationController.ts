import { Request, Response } from "express";
import { OrganizationService } from "../services/organizationService";
import { sendResponse } from "@/utilities/response";
import { APIData, APIError } from "@/types/response";
import { PaginationParams } from "@/types/pagination";

const organizationService = new OrganizationService();

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
    sendResponse(res, response);
  } catch (err) {
    handleError(res, err);
  }
};

export const updateOrganization = async (req: Request, res: Response) => {
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
  
      const updates = { ...req.body };
      delete updates.user_id;
  
      const response = await organizationService.updateOrganization(organizationId, updates, userId);
      sendResponse(res, response);
    } catch (err) {
      handleError(res, err);
    }
  };

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
    sendResponse(res, response);
  } catch (err) {
    handleError(res, err);
  }
};

export const getJoinRequests = async (req: Request, res: Response) => {
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
  };

export const handleJoinRequest = async (req: Request, res: Response) => {
  try {
    const userId = req.body.user_id;
    const organizationId = req.params.id;
    const requestId = req.params.requestId;
    const { accept } = req.body;
    if (!userId) {
      return sendResponse(res, APIError({
        code: 401,
        success: false,
        error: "Unauthorized: User ID is missing",
      }));
    }

    const response = await organizationService.handleJoinRequest(organizationId, Number(requestId), accept, userId);
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
    sendResponse(res, response);
  } catch (err) {
    handleError(res, err);
  }
};

export const getOrganizations = async (req: Request, res: Response) => {
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
  };

export const getOrganizationById = async (req: Request, res: Response) => {
  try {
    const organizationId = req.params.id;
    const response = await organizationService.getOrganizationById(organizationId);
    sendResponse(res, response);
  } catch (err) {
    handleError(res, err);
  }
};

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

export const getUserOrganizations = async (req: Request, res: Response) => {
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
  };
  
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