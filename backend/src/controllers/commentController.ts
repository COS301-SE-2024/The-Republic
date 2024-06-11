import { Request, Response } from "express";
import { CommentService } from "../services/commentService";

const commentService = new CommentService();

export async function getNumComments(req: Request, res: Response) {
  try {
    const count = await commentService.getNumComments(req.body.issue_id);
    res.json(count);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export async function getComments(req: Request, res: Response) {
  try {
    const comments = await commentService.getComments(req.body);
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
}
