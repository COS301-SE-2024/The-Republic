import { Request, Response } from "express";
import { sendResponse } from "@/utilities/response";
import { UserAdminService } from "@/modules/users/services/userAdminService";
import { APIResponse } from "@/types/response";

const userAdminService = new UserAdminService();

export const usernameExists = async (req: Request, res: Response) => {
  try {
    const response = await userAdminService.usernameExists(
      req.body,
    );

    sendResponse(res, response);
  } catch (error) {
    sendResponse(res, error as APIResponse<Promise<boolean>>);
  }
};

export const deleteAccountById = async (req: Request, res: Response) => {
  try {
    const response = await userAdminService.deleteAccountById(
      req.params.id,
      req.body.user_id,
      req.body.username,
      req.body.email_address
    );

    sendResponse(res, response);
  } catch (error) {
    sendResponse(res, error as APIResponse);
  }
};

export default {
  usernameExists,
  deleteAccountById,
};