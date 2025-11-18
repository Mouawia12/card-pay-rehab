import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { sendError } from "../utils/response.js";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return sendError(res, 422, "البيانات المدخلة غير صالحة", err.flatten());
  }

  if (err instanceof Error) {
    console.error(err);
    return sendError(res, 500, err.message);
  }

  return sendError(res, 500, "Unknown error");
}
