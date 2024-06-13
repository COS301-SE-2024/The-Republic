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
    res.sendStatus(500);
  }
}

export async function addComment(req: Request, res: Response) {
  try {
    await commentService.addComment(req.body);
    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    if (error === 400)  {
      res.sendStatus(400);
    } else {
      res.sendStatus(500);
    }
  }
}

export async function deleteComment(req: Request, res: Response) {
  try {
    await commentService.deleteComment(req.body);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    if (error === 400)  {
      res.sendStatus(400);
    } else {
      res.sendStatus(500);
    }
  }
}
