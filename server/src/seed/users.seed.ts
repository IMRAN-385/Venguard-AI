import { User } from "../models";
import { env } from "../config/env";

// ============================================================
// Seed the demo investor + a sample admin
// Idempotent — running twice does not create duplicates.
// ============================================================

export interface SeededUsers {
  demo:  { _id: string; email: string };
  admin: { _id: string; email: string };
}

export async function seedUsers(): Promise<SeededUsers> {
  // -------- Demo investor --------
  let demo = await User.findOne({ email: env.DEMO_EMAIL });
  if (!demo) {
    demo = await User.create({
      name:     "Demo Investor",
      email:    env.DEMO_EMAIL,
      password: env.DEMO_PASSWORD,
      firm:     "Vanguard Demo",
      role:     "investor",
      isDemo:   true,
      avatar:   "https://ui-avatars.com/api/?name=Demo+Investor&background=D7FF3A&color=0A0A0B",
    });
    // eslint-disable-next-line no-console
    console.log(`   ✓ Created demo user: ${demo.email}`);
  } else {
    // eslint-disable-next-line no-console
    console.log(`   • Demo user already exists: ${demo.email}`);
  }

  // -------- Admin --------
  let admin = await User.findOne({ email: "admin@vanguard-ai.io" });
  if (!admin) {
    admin = await User.create({
      name:     "Vanguard Admin",
      email:    "admin@vanguard-ai.io",
      password: "AdminVanguard2026!",
      firm:     "Vanguard AI",
      role:     "admin",
      avatar:   "https://ui-avatars.com/api/?name=V+A&background=0A0A0B&color=D7FF3A",
    });
    // eslint-disable-next-line no-console
    console.log(`   ✓ Created admin user: ${admin.email}`);
  }

  return {
    demo:  { _id: demo._id.toString(),  email: demo.email  },
    admin: { _id: admin._id.toString(), email: admin.email },
  };
}