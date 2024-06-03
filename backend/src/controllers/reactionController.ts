import { Request, Response } from "express";
import ReactionService from "../services/reactionService";

const reactionService = new ReactionService();

const addOrRemoveReaction = async (req: Request, res: Response) => {
  try {
    const { issue_id, user_id, emoji } = req.body;
    if (!issue_id || !user_id || !emoji) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const reaction = await reactionService.addOrRemoveReaction(issue_id, user_id, emoji);
    if (reaction) {
      res.status(201).json(reaction);
    } else {
      res.status(200).json({ message: "Reaction removed" });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Unknown error" });
    }
  }
};

const getReactionsByIssueId = async (req: Request, res: Response) => {
  try {
    const { issueId } = req.params;
    const reactions = await reactionService.getReactionsByIssueId(Number(issueId));
    res.status(200).json(reactions);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Unknown error" });
    }
  }
};

export default {
  addOrRemoveReaction,
  getReactionsByIssueId
};
