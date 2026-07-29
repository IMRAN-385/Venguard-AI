import type { Response } from "express";

// ============================================================
// Consistent API response helpers
//
// Optional — you're free to keep using res.json() directly.
// These are here for controllers that want structured envelopes.
// ============================================================

interface SuccessMeta {
  message?: string;
  total?:   number;
  page?:    number;
  pageSize?: number;
}

/**
 * 200 OK with a `data` envelope
 */
export function ok<T>(res: Response, data: T, meta?: SuccessMeta): Response {
  return res.status(200).json({ success: true, data, ...meta });
}

/**
 * 201 Created
 */
export function created<T>(res: Response, data: T, meta?: SuccessMeta): Response {
  return res.status(201).json({ success: true, data, ...meta });
}

/**
 * 204 No Content — use for deletes when the client doesn't need a body
 */
export function noContent(res: Response): Response {
  return res.status(204).send();
}

/**
 * Consistent error envelope. Prefer throwing AppError from
 * middleware/error.ts — this is only useful when you already
 * caught the error and want to shape the response yourself.
 */
export function fail(
  res: Response,
  statusCode: number,
  message: string,
  code?: string,
  details?: unknown
): Response {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(code    ? { code    } : {}),
    ...(details ? { details } : {}),
  });
}