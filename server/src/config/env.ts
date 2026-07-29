import "dotenv/config";
import { z } from "zod";

// ============================================================
// Environment validation with Zod
// Fails fast at boot if anything critical is missing/malformed
// ============================================================

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  CORS_ORIGIN: z.string().url().default("http://localhost:3000"),

  // MongoDB
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),

  // JWT
  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters"),
  JWT_EXPIRES_IN: z.string().default("7d"),

  // Google OAuth (optional in dev)
  GOOGLE_CLIENT_ID: z.string().optional().default(""),

  // LLM providers — all optional (simulation fallback)
  GROQ_API_KEY:      z.string().optional().default(""),
  OPENAI_API_KEY:    z.string().optional().default(""),
  ANTHROPIC_API_KEY: z.string().optional().default(""),
  GEMINI_API_KEY:    z.string().optional().default(""),

  DEFAULT_LLM_PROVIDER: z
    .enum(["groq", "openai", "anthropic", "gemini", "simulation"])
    .default("simulation"),

  // Demo credentials
  DEMO_EMAIL:    z.string().email().default("demo.investor@vanguard-ai.io"),
  DEMO_PASSWORD: z.string().min(8).default("Vanguard2026!"),
});

// ------------------------------------------------------------
// Parse + expose
// ------------------------------------------------------------

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error("❌ Invalid environment configuration:");
  // eslint-disable-next-line no-console
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
export type Env = typeof env;

// Helpful boolean for downstream code
export const isProd = env.NODE_ENV === "production";
export const isDev  = env.NODE_ENV === "development";