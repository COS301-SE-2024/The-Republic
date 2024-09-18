import { Request, Response } from "express";
import { OrganizationService } from "@/modules/organizations/services/organizationService";
import { sendResponse } from "@/utilities/response";
import { APIData, APIError } from "@/types/response";
import { PaginationParams } from "@/types/pagination";
import multer from "multer";
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
    //cacheMiddleware(300),
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

  export const getJoinRequestByUser = async (req: Request, res: Response) => {
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
  
      const response = await organizationService.getJoinRequestByUser(organizationId, userId);
      sendResponse(res, response);
    } catch (err) {
      handleError(res, err);
    }
  };

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
  async (req: Request, res: Response) => {
    try {
      const { offset, limit, orgType, locationId } = req.query;
      const userId = req.body.user_id;
      
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

      const response = await organizationService.getOrganizations(
        paginationParams,
        orgType as string | null,
        locationId as string | null,
        userId
      );
      sendResponse(res, response);
    } catch (err) {
      handleError(res, err);
    }
  }
];

export const getOrganizationById = [
  async (req: Request, res: Response) => {
    try {
      const organizationId = req.params.id;
      const userId = req.body.user_id as string;

      if (!userId) {
        return sendResponse(res, APIError({
          code: 401,
          success: false,
          error: "Unauthorized: User ID is missing",
        }));
      }

      const response = await organizationService.getOrganizationById(organizationId, userId);
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

  export const searchOrganizations = async (req: Request, res: Response) => {
    try {
      const { searchTerm, orgType, locationId, offset, limit } = req.query;
      
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
  
      const response = await organizationService.searchOrganizations(
        searchTerm,
        orgType as string | null,
        locationId as string | null,
        paginationParams
      );
      sendResponse(res, response);
    } catch (err) {
      console.error("Error in searchOrganizations:", err);
      handleError(res, err);
    }
  };

  export const getOrganizationPosts = [
    async (req: Request, res: Response) => {
      try {
        const organizationId = req.params.id;
        const userId = req.query.user_id as string;
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
  
        const response = await organizationService.getOrganizationPosts(organizationId, userId, paginationParams);
        sendResponse(res, response);
      } catch (err) {
        console.error("Detailed error in getOrganizationPosts:", err);
        handleError(res, err);
      }
    }
  ];
  
  export const createOrganizationPost = [
    upload.single("image"),
    async (req: Request, res: Response) => {
      try {
        const organizationId = req.params.id;
        const userId = req.body.author_id;
        const { content } = req.body;
  
        if (!userId) {
          return sendResponse(res, APIError({
            code: 401,
            success: false,
            error: "Unauthorized: User ID is missing",
          }));
        }
  
        const isMember = await organizationService.isMember(organizationId, userId);
        if (!isMember) {
          return sendResponse(res, APIError({
            code: 403,
            success: false,
            error: "Forbidden: User is not a member of this organization",
          }));
        }
  
        const post = {
          organization_id: organizationId,
          author_id: userId,
          content
        };
  
        const response = await organizationService.createOrganizationPost(post, userId, req.file);
        clearCachePattern(`__express__/api/organizations/${organizationId}/posts*`);
        sendResponse(res, response);
      } catch (err) {
        handleError(res, err);
      }
    }
  ];
  
  export const deleteOrganizationPost = async (req: Request, res: Response) => {
    try {
      const postId = req.params.postId;
      const organizationId = req.params.id;
      const userId = req.body.user_id;
  
      if (!userId) {
        return sendResponse(res, APIError({
          code: 401,
          success: false,
          error: "Unauthorized: User ID is missing",
        }));
      }
  
      const response = await organizationService.deleteOrganizationPost(postId);
      clearCachePattern(`__express__/api/organizations/${organizationId}/posts*`);
      sendResponse(res, response);
    } catch (err) {
      handleError(res, err);
    }
  };
  
  export const getTopActiveMembers = [
    //cacheMiddleware(300),
    async (req: Request, res: Response) => {
      try {
        const organizationId = req.params.id;
        const response = await organizationService.getTopActiveMembers(organizationId);
        sendResponse(res, response);
      } catch (err) {
        handleError(res, err);
      }
    }
  ];

  export const getOrganizationMembers = async (req: Request, res: Response) => {
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
  
      const response = await organizationService.getOrganizationMembers(organizationId, userId, paginationParams);
      sendResponse(res, response);
    } catch (err) {
      handleError(res, err);
    }
  };

  export const promoteToAdmin = async (req: Request, res: Response) => {
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
  
      const response = await organizationService.addAdmin(organizationId, adminId, memberUserId);
      clearCachePattern(`__express__/api/organizations/${organizationId}`);
      sendResponse(res, response);
    } catch (err) {
      handleError(res, err);
    }
  };

  export const getOrganizationPost = async (req: Request, res: Response) => {
    try {
      const organizationId = req.params.id;
      const postId = req.params.postId;
      const response = await organizationService.getOrganizationPost(organizationId, postId, req.body.user_id);
      sendResponse(res, response);
    } catch (err) {
      handleError(res, err);
    }
  };
  
  export const checkUserMembership = async (req: Request, res: Response) => {
    try {
      const organizationId = req.params.id;
      const userId = req.params.userId;
      const response = await organizationService.checkUserMembership(organizationId, userId);
      sendResponse(res, response);
    } catch (err) {
      handleError(res, err);
    }
  };

  export const getActivityLogs = async (req: Request, res: Response) => {
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
  
      const response = await organizationService.getActivityLogs(organizationId, userId, paginationParams);
      sendResponse(res, response);
    } catch (err) {
      handleError(res, err);
    }
  };