import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import "dotenv/config";
import { connectDB, disconnectDB } from "../config/db";
import { seedUsers } from "./users.seed";
import { seedAssets } from "./assets.seed";

// ============================================================
// One-shot database seeder
// Run:  npm run seed
// ============================================================

async function main(): Promise<void> {
  const t0 = Date.now();

  // eslint-disable-next-line no-console
  console.log(`
┌──────────────────────────────────────────────────────────┐
│  🌱  Vanguard AI · Database Seeder                       │
└──────────────────────────────────────────────────────────┘
`);

  try {
    await connectDB();

    // eslint-disable-next-line no-console
    console.log("\n▸ Seeding users...");
    const users = await seedUsers();

    // eslint-disable-next-line no-console
    console.log("\n▸ Seeding assets...");
    const createdAssets = await seedAssets(users.admin._id);

    const elapsed = ((Date.now() - t0) / 1000).toFixed(2);

    // eslint-disable-next-line no-console
    console.log(`
┌──────────────────────────────────────────────────────────┐
│  ✅  Seed complete in ${elapsed}s${" ".repeat(Math.max(0, 34 - elapsed.length))}│
│                                                          │
│  Users:  demo + admin                                    │
│  Assets: ${String(createdAssets).padEnd(3)} new · 8 total                            │
│                                                          │
│  Demo login:                                             │
│    email:    ${users.demo.email.padEnd(43)} │
│    password: Vanguard2026!                               │
└──────────────────────────────────────────────────────────┘
`);
    await disconnectDB();
    process.exit(0);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("\n❌ Seed failed:", err);
    await disconnectDB();
    process.exit(1);
  }
}

main();