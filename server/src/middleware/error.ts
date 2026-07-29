import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import mongoose from "mongoose";
import { isDev } from "../config/env";

// ============================================================
// Custom application error class
// ============================================================

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
    Error.captureStackTrace?.(this, this.constructor);
  }
}

// Convenience factories
export const badRequest    = (msg: string, details?: unknown) => new AppError(msg, 400, "BAD_REQUEST", details);
export const unauthorized  = (msg = "Authentication required.")  => new AppError(msg, 401, "UNAUTHORIZED");
export const forbidden     = (msg = "Insufficient permissions.") => new AppError(msg, 403, "FORBIDDEN");
export const notFound      = (msg = "Not found.")                => new AppError(msg, 404, "NOT_FOUND");
export const conflict      = (msg: string)                       => new AppError(msg, 409, "CONFLICT");
export const serverError   = (msg = "Internal server error.")    => new AppError(msg, 500, "SERVER_ERROR");

// ============================================================
// 404 handler — must come after all routes
// ============================================================
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    message: `Route ${req.method} ${req.originalUrl} not found.`,
    code: "ROUTE_NOT_FOUND",
  });
}

// ============================================================
// Global error handler — must come LAST
// ============================================================
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  // Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      message: "Validation failed.",
      code: "VALIDATION_ERROR",
      details: err.flatten().fieldErrors,
    });
    return;
  }

  // Mongoose validation
  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).json({
      message: "Database validation failed.",
      code: "DB_VALIDATION_ERROR",
      details: Object.fromEntries(
        Object.entries(err.errors).map(([k, v]) => [k, v.message]),
      ),
    });
    return;
  }

  // Mongoose cast error (bad ObjectId etc)
  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({
      message: `Invalid value for field "${err.path}".`,
      code: "CAST_ERROR",
    });
    return;
  }

  // Mongo duplicate key
  if ((err as { code?: number })?.code === 11000) {
    const key = Object.keys((err as { keyValue?: Record<string, unknown> }).keyValue ?? {})[0] ?? "field";
    res.status(409).json({
      message: `Duplicate ${key}. Already exists.`,
      code: "DUPLICATE_KEY",
    });
    return;
  }

  // Our own AppError
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
      code: err.code,
      ...(err.details ? { details: err.details } : {}),
    });
    return;
  }

  // Fallback — unknown
  const message = err instanceof Error ? err.message : "Something went wrong.";
  // eslint-disable-next-line no-console
  console.error("💥 Unhandled error:", err);

  res.status(500).json({
    message: isDev ? message : "Internal server error.",
    code: "SERVER_ERROR",
    ...(isDev && err instanceof Error ? { stack: err.stack } : {}),
  });
}