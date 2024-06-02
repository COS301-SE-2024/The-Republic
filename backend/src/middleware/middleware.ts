import { Request, Response, NextFunction } from "express";

export const exampleMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Middleware executed!");
  next();
};
