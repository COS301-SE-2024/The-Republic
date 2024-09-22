import { Request, Response, NextFunction } from "express";
import supabase from "@/modules/shared/services/supabaseClient";
import { sendResponse } from "@/utilities/response";
import { APIError } from "@/types/response";

export const serverMiddleware = (
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

  if (!authHeader) {
    // sendResponse(
    //   res,
    //   APIError({
    //     code: 401,
    //     success: false,
    //     error: "Authorization token is required",
    //   }),
    // );
    
    next();
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      sendResponse(
        res,
        APIError({
          code: 403,
          success: false,
          error: "Invalid or expired token",
        }),
      );

      return;
    }

    req.body.user_id = user.id;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);

    sendResponse(
      res,
      APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      }),
    );

    return;
  }
};
