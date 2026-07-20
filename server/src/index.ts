import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.routes";
import assetRoutes from "./routes/asset.routes";
import aiRoutes from "./routes/ai.routes";
import statsRoutes from "./routes/stats.routes";
import { seedDatabase } from "./config/seed";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/stats", statsRoutes);

app.use((_req, res) => res.status(404).json({ message: "Route not found" }));

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(async () => {
    console.log("✅ MongoDB connected");
    await seedDatabase();
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });