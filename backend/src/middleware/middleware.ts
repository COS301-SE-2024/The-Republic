import { Request, Response, NextFunction } from "express";

export const serverMiddleare = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("Middleware executed!");
  next();
};
