import { Request, Response } from "express";
import ReactionService from "@/modules/reactions/services/reactionService";
import { sendResponse } from "@/utils/response";
import { APIResponse } from "@/types/response";

const reactionService = new ReactionService();

const addOrRemoveReaction = async (req: Request, res: Response) => {
  try {
    const response = await reactionService.addOrRemoveReaction(req.body);
    sendResponse(res, response);
  } catch (error) {
    sendResponse(res, error as APIResponse);
  }
};

export default {
  addOrRemoveReaction,
};
