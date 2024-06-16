import { Request, Response, NextFunction } from "express";
import supabase from "../services/supabaseClient";
import { sendResponse } from "../utils/response";
import { APIError } from "../types/response";

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
      sendResponse(res, APIError({
        code: 403,
        success: false,
        error: "Invalid token"
      }));
    } else {
      sendResponse(res, APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred. Please try again later."
      }));
    }

    return;
  }

  req.body.user_id = data.user.id;
  console.log(req.body);

  next();
};
