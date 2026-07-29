import type { Request, Response, NextFunction } from "express";
import { User } from "../models";
import { env } from "../config/env";
import {
  conflict,
  notFound,
  unauthorized,
} from "../middleware/error";
import { buildAuthResponse } from "../services/tokenService";
import { verifyGoogleToken } from "../services/googleService";
import { generateRandomPassword } from "../utils/passwordUtils";
import type {
  LoginInput,
  RegisterInput,
  GoogleLoginInput,
} from "../validators/authValidators";

// ============================================================
// Auth controllers
// All request bodies are already validated by validate() middleware.
// ============================================================

// ------------------------------------------------------------
// POST /api/auth/register
// ------------------------------------------------------------
export async function register(
  req: Request<unknown, unknown, RegisterInput>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name, email, password, firm } = req.body;

    const existing = await User.findOne({ email });
    if (existing) throw conflict("An account with that email already exists.");

    const user = await User.create({
      name,
      email,
      password,
      firm,
      role: "investor",
    });

    res.status(201).json(buildAuthResponse(user));
  } catch (err) {
    next(err);
  }
}

// ------------------------------------------------------------
// POST /api/auth/login
// ------------------------------------------------------------
export async function login(
  req: Request<unknown, unknown, LoginInput>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user || !user.password) throw unauthorized("Invalid email or password.");

    const ok = await user.comparePassword(password);
    if (!ok) throw unauthorized("Invalid email or password.");

    res.json(buildAuthResponse(user));
  } catch (err) {
    next(err);
  }
}

// ------------------------------------------------------------
// POST /api/auth/demo-login
// ------------------------------------------------------------
export async function demoLogin(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    let user = await User.findOne({ email: env.DEMO_EMAIL }).select("+password");

    if (!user) {
      user = await User.create({
        name:     "Demo Investor",
        email:    env.DEMO_EMAIL,
        password: env.DEMO_PASSWORD,
        firm:     "Vanguard Demo",
        role:     "investor",
        isDemo:   true,
      });
    }

    res.json(buildAuthResponse(user));
  } catch (err) {
    next(err);
  }
}

// ------------------------------------------------------------
// POST /api/auth/google-login
// ------------------------------------------------------------
export async function googleLogin(
  req: Request<unknown, unknown, GoogleLoginInput>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { token } = req.body;
    const profile = await verifyGoogleToken(token);

    let user =
      (await User.findOne({ googleId: profile.googleId })) ||
      (await User.findOne({ email: profile.email }));

    if (!user) {
      user = await User.create({
        name:     profile.name,
        email:    profile.email,
        googleId: profile.googleId,
        avatar:   profile.avatar,
        password: generateRandomPassword(),
        role:     "investor",
        isDemo:   profile.isDemo,
      });
    } else if (!user.googleId) {
      user.googleId = profile.googleId;
      if (!user.avatar && profile.avatar) user.avatar = profile.avatar;
      await user.save();
    }

    res.json(buildAuthResponse(user));
  } catch (err) {
    next(err);
  }
}

// ------------------------------------------------------------
// GET /api/auth/me    (requires requireAuth)
// ------------------------------------------------------------
export async function me(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) throw unauthorized();

    const user = await User.findById(req.user.sub);
    if (!user) throw notFound("User no longer exists.");

    res.json({ user: user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
}

// ------------------------------------------------------------
// POST /api/auth/logout
// ------------------------------------------------------------
export async function logout(_req: Request, res: Response): Promise<void> {
  res.json({ message: "Signed out." });
}