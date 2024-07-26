import { Request, Response, NextFunction } from "express";
import supabase from "@/modules/shared/services/supabaseClient";
import { sendResponse } from "@/infrastructure/utilities/response";
import { APIError } from "@/types/response";

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
  const serviceRoleKey = req.headers["x-service-role-key"];

  if (serviceRoleKey === process.env.SUPABASE_SERVICE_ROLE_KEY) {
    next();
    return;
  }

  req.body.user_id = undefined;

  if (authHeader === undefined) {
    next();
    return;
  }

  const jwt = authHeader.split(" ")[1];

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(jwt);

    if (error) {
      sendResponse(
        res,
        APIError({
          code: 403,
          success: false,
          error: "Invalid token",
        }),
      );
      return;
    }

    if (user) {
      req.body.user_id = user.id;
      next();
    } else {
      sendResponse(
        res,
        APIError({
          code: 403,
          success: false,
          error: "Invalid token",
        }),
      );
    }
  } catch (error) {
    console.error(error);
    sendResponse(
      res,
      APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      }),
    );
  }
};
