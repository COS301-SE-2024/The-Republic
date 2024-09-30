import { Request, Response } from "express";
import { CommentService } from "@/modules/comments/services/commentService";
import { sendResponse } from "@/utilities/response";
import { APIResponse } from "@/types/response";
import { cacheMiddleware } from "@/middleware/cacheMiddleware";
import { clearCachePattern } from "@/utilities/cacheUtils";

const commentService = new CommentService();

export const getNumComments = [
  cacheMiddleware(300),
  async (req: Request, res: Response) => {
    try {
      const { itemId, itemType, parent_id } = req.body;
      const response = await commentService.getNumComments({
        itemId,
        itemType,
        parent_id,
      });
      sendResponse(res, response);
    } catch (error) {
      sendResponse(res, error as APIResponse);
    }
  },
];

export const getComments = [
  cacheMiddleware(300),
  async (req: Request, res: Response) => {
    try {
      const response = await commentService.getComments(req.body);
      sendResponse(res, response);
    } catch (error) {
      sendResponse(res, error as APIResponse);
    }
  },
];

export async function addComment(req: Request, res: Response) {
  try {
    const response = await commentService.addComment(req.body);
    clearCachePattern("__express__/api/comments*");
    sendResponse(res, response);
  } catch (error) {
    sendResponse(res, error as APIResponse);
  }
}

export async function deleteComment(req: Request, res: Response) {
  try {
    const response = await commentService.deleteComment(req.body);
    clearCachePattern("__express__/api/comments*");
    sendResponse(res, response);
  } catch (error) {
    sendResponse(res, error as APIResponse);
  }
}
