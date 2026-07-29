import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import type { JwtPayload } from "../middleware/auth";
import type { IUser } from "../models";

// ============================================================
// JWT token service — sign, verify, decode
// ============================================================

/**
 * Sign a JWT for the given user.
 */
export function signToken(user: IUser): string {
  const payload: JwtPayload = {
    sub:   user._id.toString(),
    email: user.email,
    role:  user.role,
  };

  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
    issuer: "vanguard-ai",
    audience: "vanguard-ai-client",
  };

  return jwt.sign(payload, env.JWT_SECRET, options);
}

/**
 * Verify a JWT and return its payload. Throws on invalid/expired.
 */
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET, {
    issuer:   "vanguard-ai",
    audience: "vanguard-ai-client",
  }) as JwtPayload;
}

/**
 * Decode without verifying (for logging/debugging only).
 */
export function decodeToken(token: string): JwtPayload | null {
  const decoded = jwt.decode(token);
  return typeof decoded === "object" ? (decoded as JwtPayload) : null;
}

/**
 * Convenience: build the { token, user } payload the client expects.
 */
export function buildAuthResponse(user: IUser) {
  return {
    token: signToken(user),
    user: user.toSafeJSON(),
  };
}