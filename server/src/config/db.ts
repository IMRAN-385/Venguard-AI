import mongoose from "mongoose";
import { env } from "./env";

// ============================================================
// MongoDB connection with graceful reconnect + shutdown
// ============================================================

mongoose.set("strictQuery", true);

let isConnected = false;

export async function connectDB(): Promise<void> {
  if (isConnected) return;

  mongoose.connection.on("connected",    () => {
    // eslint-disable-next-line no-console
    console.log("🟢 MongoDB connected");
  });

  mongoose.connection.on("error", (err) => {
    // eslint-disable-next-line no-console
    console.error("🔴 MongoDB error:", err.message);
  });

  mongoose.connection.on("disconnected", () => {
    // eslint-disable-next-line no-console
    console.warn("🟡 MongoDB disconnected");
    isConnected = false;
  });

  try {
    await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 10_000,
    });
    isConnected = true;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("❌ MongoDB initial connection failed:", (err as Error).message);
    // eslint-disable-next-line no-console
    console.error("   → Server will exit. Check MONGO_URI in .env");
    process.exit(1);
  }

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    // eslint-disable-next-line no-console
    console.log(`\n${signal} received, closing MongoDB connection...`);
    await mongoose.connection.close();
    process.exit(0);
  };

  process.on("SIGINT",  () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

export async function disconnectDB(): Promise<void> {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
}