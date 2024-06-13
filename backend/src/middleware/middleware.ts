import { Request, Response, NextFunction } from "express";
import supabase from "../services/supabaseClient";

export const serverMiddleare = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("Middleware executed!");
  next();
};

export const verifyAndGetUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.body.user_id = undefined;

  const authHeader = req.headers.authorization;

  if (authHeader === undefined) {
    next();
    return;
  }

  const jwt = authHeader.split(" ")[1];
  const { data, error } = await supabase.auth.getUser(jwt);

  if (error) {
    console.error(error);

    if (error.status === 403) {
      res.sendStatus(403);
    } else {
      res.sendStatus(500);
    }

    return;
  }

  req.body.user_id = data.user.id;
  console.log(req.body);
  next();
};

export const defineParentCommentId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.body.parent_id ??= null;
  next();
};
