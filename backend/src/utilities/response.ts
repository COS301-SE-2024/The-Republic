import { APIResponse } from "@/types/response";
import { Response } from "express";

export function sendResponse(res: Response, response: APIResponse<unknown>) {
  if (response.code === 204) {
    return res.status(204).send();
  }

  return res.status(response.code).json(response);
}
