import { Request, Response } from "express";
import { CommentService } from "@/modules/comments/services/commentService";
import { sendResponse } from "@/utils/response";
import { APIResponse } from "@/types/response";

const commentService = new CommentService();

export async function getNumComments(req: Request, res: Response) {
  try {
    const response = await commentService.getNumComments(req.body);
    sendResponse(res, response);
  } catch (error) {
    sendResponse(res, error as APIResponse);
  }
}

export async function getComments(req: Request, res: Response) {
  try {
    const response = await commentService.getComments(req.body);
    sendResponse(res, response);
  } catch (error) {
    sendResponse(res, error as APIResponse);
  }
}

export async function addComment(req: Request, res: Response) {
  try {
    const response = await commentService.addComment(req.body);
    sendResponse(res, response);
  } catch (error) {
    sendResponse(res, error as APIResponse);
  }
}

export async function deleteComment(req: Request, res: Response) {
  try {
    const response = await commentService.deleteComment(req.body);
    sendResponse(res, response);
  } catch (error) {
    sendResponse(res, error as APIResponse);
  }
}
