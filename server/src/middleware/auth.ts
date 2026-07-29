import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

// ============================================================
// JWT auth middleware — protect routes and expose req.user
// ============================================================

export interface JwtPayload {
  sub:   string;          // user id
  email: string;
  role:  "investor" | "admin" | "analyst";
  iat?:  number;
  exp?:  number;
}

// Augment Express Request with typed user
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

// ------------------------------------------------------------
// requireAuth — 401 if no valid token
// ------------------------------------------------------------
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ message: "Authentication required." });
    return;
  }

  const token = header.slice("Bearer ".length).trim();
  if (!token) {
    res.status(401).json({ message: "Malformed authorization header." });
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    const isExpired = (err as Error).name === "TokenExpiredError";
    res.status(401).json({
      message: isExpired ? "Session expired. Please sign in again." : "Invalid token.",
    });
  }
}

// ------------------------------------------------------------
// optionalAuth — attaches req.user if a valid token is present,
//                but never blocks the request. Useful for public
//                routes that personalize when logged in.
// ------------------------------------------------------------
export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return next();

  const token = header.slice("Bearer ".length).trim();
  try {
    req.user = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  } catch {
    // Silently ignore — treat as unauthenticated
  }
  next();
}

// ------------------------------------------------------------
// requireRole — role-based guard (use after requireAuth)
// ------------------------------------------------------------
export function requireRole(...allowed: JwtPayload["role"][]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "Authentication required." });
      return;
    }
    if (!allowed.includes(req.user.role)) {
      res.status(403).json({ message: "Insufficient permissions." });
      return;
    }
    next();
  };
}