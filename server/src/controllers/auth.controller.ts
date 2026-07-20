import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

const signToken = (id: string) =>
  jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: (process.env.JWT_EXPIRES_IN as any) || "7d",
  });

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, riskTolerance, checkSize } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already registered" });

    const user = await User.create({ name, email, password, riskTolerance, checkSize });
    const token = signToken(user.id);

    res.status(201).json({
      user: { _id: user.id, name: user.name, email: user.email, riskTolerance: user.riskTolerance },
      token,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Registration failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken(user.id);
    res.json({
      user: { _id: user.id, name: user.name, email: user.email, riskTolerance: user.riskTolerance },
      token,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Login failed" });
  }
};

// 1-click demo login — uses a seeded demo account so reviewers can explore
// without registering.
export const demoLogin = async (_req: Request, res: Response) => {
  try {
    const demoUser = await User.findOne({ isDemo: true });
    if (!demoUser) return res.status(404).json({ message: "Demo account not seeded yet" });

    const token = signToken(demoUser.id);
    res.json({
      user: { _id: demoUser.id, name: demoUser.name, email: demoUser.email },
      token,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Demo login failed" });
  }
};

export const getMe = async (req: Request & { userId?: string }, res: Response) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user });
};