import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import "dotenv/config";
import express, { type Application, type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { connectDB } from "./config/db";
import { errorHandler, notFoundHandler } from "./middleware/error";

// Route imports
import authRoutes    from "./routes/authRoutes";
import assetsRoutes  from "./routes/assetsRoutes";
import reviewsRoutes from "./routes/reviewsRoutes";
import aiRoutes      from "./routes/aiRoutes";

// ============================================================
// App bootstrap
// ============================================================

const app: Application = express();

// --- Security & core middleware ------------------------------
app.use(helmet());
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

if (env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// --- Health check --------------------------------------------
app.get("/", (_req: Request, res: Response) => {
  res.json({
    name: "Vanguard AI — Autonomous DeepTech Due Diligence API",
    version: "1.0.0",
    status: "operational",
    agents: 6,
    docs: "/api",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    env: env.NODE_ENV,
    llmProvider: env.DEFAULT_LLM_PROVIDER,
  });
});

// --- API routes ----------------------------------------------
app.use("/api/auth",    authRoutes);
app.use("/api/assets",  assetsRoutes);
app.use("/api/assets",  reviewsRoutes);   // /assets/:id/reviews
app.use("/api/ai",      aiRoutes);

// --- 404 + error handlers ------------------------------------
app.use(notFoundHandler);
app.use(errorHandler);

// ============================================================
// Boot
// ============================================================

async function boot() {
  try {
    await connectDB();

    app.listen(env.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`
┌──────────────────────────────────────────────────────────┐
│  ⚡ Vanguard AI API                                       │
│                                                          │
│  📡  http://localhost:${env.PORT}                              │
│  🌐  CORS:      ${env.CORS_ORIGIN.padEnd(38)} │
│  🧠  LLM:       ${env.DEFAULT_LLM_PROVIDER.padEnd(38)} │
│  🏷️  ENV:       ${env.NODE_ENV.padEnd(38)} │
│                                                          │
│  Agents online · 6/6 · streaming                         │
└──────────────────────────────────────────────────────────┘
      `);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("❌ Failed to boot server:", err);
    process.exit(1);
  }
}

boot();