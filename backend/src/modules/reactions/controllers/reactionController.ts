import { Request, Response } from "express";
import ReactionService from "@/modules/reactions/services/reactionService";
import { sendResponse } from "@/utilities/response";
import { APIResponse } from "@/types/response";
import { clearCachePattern } from "@/utilities/cacheUtils";

const reactionService = new ReactionService();

const addOrRemoveReaction = async (req: Request, res: Response) => {
  try {
    const response = await reactionService.addOrRemoveReaction(req.body);

    clearCachePattern("__express__/api/reactions*");

    sendResponse(res, response);
  } catch (error) {
    sendResponse(res, error as APIResponse);
  }
};

export default {
  addOrRemoveReaction,
};
