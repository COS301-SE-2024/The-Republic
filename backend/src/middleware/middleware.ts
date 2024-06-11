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
  const authHeader = req.headers.authorization;

  if (authHeader === undefined) {
    next();
    return;
  }

  const { data, error } = await supabase.auth.getUser(
    authHeader.split(" ")[1]
  );

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
  next();
};
