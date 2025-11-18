import type { Response } from "express";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  meta?: Record<string, unknown>;
}

export function sendSuccess<T>(res: Response, data: T, meta?: Record<string, unknown>) {
  const payload: ApiResponse<T> = { success: true, data };
  if (meta) payload.meta = meta;
  return res.json(payload);
}

export function sendError(res: Response, status: number, message: string, details?: unknown) {
  const payload: ApiResponse<null> = {
    success: false,
    data: null,
    message,
    ...(details ? { meta: { details } } : {}),
  };
  return res.status(status).json(payload);
}
