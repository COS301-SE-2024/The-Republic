import { Request, Response } from "express";
import { sendResponse } from "@/utilities/response";
import { UserService } from "@/modules/users/services/userService";
import { APIResponse } from "@/types/response";
import { cacheMiddleware } from "@/middleware/cacheMiddleware";
import { clearCache, clearCachePattern } from "@/utilities/cacheUtils";
import { MulterFile } from "@/types/users";

const userService = new UserService();

export const getUserById = [
  cacheMiddleware(300), 
  async (req: Request, res: Response) => {
    try {
      const response = await userService.getUserById(
        req.params.id,
        req.body.user_id,
      );
      sendResponse(res, response);
    } catch (error) {
      sendResponse(res, error as APIResponse);
    }
  }
];

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const response = await userService.updateUserProfile(
      req.params.id,
      req.body,
      req.file as MulterFile,
    );
    
    clearCache(`/api/users/${req.params.id}`);

    clearCachePattern('__express__/api/users*');
    
    sendResponse(res, response);
  } catch (error) {
    sendResponse(res, error as APIResponse);
  }
};

export const updateUsername = async (req: Request, res: Response) => {
  try {
    const response = await userService.updateUsername(
      req.params.id,
      req.body.username
    );

    clearCache(`/api/users/${req.params.id}`);
    clearCachePattern('__express__/api/users*');

    sendResponse(res, response);
  } catch (error) {
    sendResponse(res, error as APIResponse);
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const response = await userService.changePassword(
      req.params.id,
      req.body.currentPassword,
      req.body.newPassword
    );

    sendResponse(res, response);
  } catch (error) {
    sendResponse(res, error as APIResponse);
  }
};

export const searchForUser = async (req: Request, res: Response) => {
  try {
    const response = await userService.searchForUser(
      req.body.name,
      req.body.username
    );

    sendResponse(res, response);
  } catch (error) {
    sendResponse(res, error as APIResponse);
  }
};
