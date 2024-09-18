import { Request, Response } from "express";
import { sendResponse } from "@/utilities/response";
import { NoAuthService } from "@/modules/users/services/noAuthService";
import { APIResponse } from "@/types/response";

const noAuthService = new NoAuthService();

export const usernameExists = async (req: Request, res: Response) => {
  try {
    const response = await noAuthService.usernameExists(
      req.body,
    );

    sendResponse(res, response);
  } catch (error) {
    sendResponse(res, error as APIResponse<Promise<boolean>>);
  }
};

export default {
  usernameExists,
};