import { Request, Response, NextFunction } from "express";
import supabase from "../services/supabaseClient";
import { sendResponse } from "../utils/response";
import { APIError } from "../types/response";

export const serverMiddleare = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  next();
};

export const verifyAndGetUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  const serviceRoleKey = req.headers['x-service-role-key'];

  // Check for service role key
  if (serviceRoleKey === process.env.SUPABASE_SERVICE_ROLE_KEY) {
    // If service role key is used, don't modify user_id
    next();
    return;
  }

  // Reset user_id only if service role key is not used
  req.body.user_id = undefined;

  if (authHeader === undefined) {
    next();
    return;
  }

  const jwt = authHeader.split(" ")[1];

  try {
    const { data: { user }, error } = await supabase.auth.getUser(jwt);

    if (error) throw error;

    if (user) {
      req.body.user_id = user.id;
      console.log(req.body);
      next();
    } else {
      sendResponse(res, APIError({
        code: 403,
        success: false,
        error: "Invalid token"
      }));
    }
  } catch (error) {
    console.error(error);
    sendResponse(res, APIError({
      code: 500,
      success: false,
      error: "An unexpected error occurred. Please try again later."
    }));
  }
};