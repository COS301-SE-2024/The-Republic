import { Request, Response } from "express";
import { sendResponse } from "../utils/response";
import { UserService } from "../services/userService";
import { APIResponse } from "../types/response";

const userService = new UserService();

export const getUserById = async (req: Request, res: Response) => {
  try {
    const response = await userService.getUserById(req.params.id);
    sendResponse(res, response);
  } catch (error) {
    sendResponse(res, error as APIResponse);
  }
};
