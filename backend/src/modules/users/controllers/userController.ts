import { Request, Response } from "express";
import { sendResponse } from "@/modules/infrastructure/utilities/response";
import { UserService } from "@/modules/users/services/userService";
import { APIResponse } from "@/types/response";

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

const userService = new UserService();

export const getUserById = async (req: Request, res: Response) => {
  try {
    const response = await userService.getUserById(
      req.params.id,
      req.body.user_id,
    );
    sendResponse(res, response);
  } catch (error) {
    sendResponse(res, error as APIResponse);
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const response = await userService.updateUserProfile(
      req.params.id,
      req.body,
      req.file as MulterFile,
    );
    sendResponse(res, response);
  } catch (error) {
    sendResponse(res, error as APIResponse);
  }
};
