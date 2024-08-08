import { APIResponse } from "@/types/response";
import { Response } from "express";

export function sendResponse<T>(res: Response, response: APIResponse<T>) {
  res.status(response.code).json(response);
}
