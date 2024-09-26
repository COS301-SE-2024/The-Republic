import { Request, Response, NextFunction } from "express";
import redisClient from "@/modules/shared/services/redisClient";

export const cacheMiddleware = (duration: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!redisClient) {
      return next();
    }

    const key = `__express__${req.originalUrl || req.url}__${JSON.stringify(req.body)}`;

    try {
      const cachedBody = await redisClient.get(key);

      if (cachedBody) {
        return res.send(JSON.parse(cachedBody));
      } else {
        const originalJson = res.json;
        res.json = function (body: unknown) {
          redisClient?.setex(key, duration, JSON.stringify(body));
          return originalJson.call(this, body);
        };
        next();
      }
    } catch (error) {
      console.error("Redis operation failed:", error);
      next();
    }
  };
};
