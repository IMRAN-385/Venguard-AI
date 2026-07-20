import User from "../models/User";
import Asset from "../models/Asset";

export async function seedDatabase() {
  const existingDemo = await User.findOne({ isDemo: true });
  if (existingDemo) return; // already seeded

  const demoUser = await User.create({
    name: "Demo Investor",
    email: "demo@vanguard.ai",
    password: "demo1234",
    isDemo: true,
    riskTolerance: "Moderate",
    checkSize: 50000,
  });

  await Asset.insertMany([
    {
      name: "Nexora Robotics",
      sector: "Technology",
      description: "Autonomous warehouse robotics with a modular arm platform.",
      stage: "Series A",
      valuation: 42000000,
      arr: 3200000,
      burnRate: 180000,
      aiScore: 87,
      riskTier: "Moderate",
      founder: "Ayesha Rahman",
      ownerId: demoUser._id,
    },
    {
      name: "Verdant Grid",
      sector: "Energy",
      description: "Distributed solar micro-grid management for rural utilities.",
      stage: "Seed",
      valuation: 12000000,
      arr: 650000,
      burnRate: 60000,
      aiScore: 74,
      riskTier: "High",
      founder: "Tanvir Ahmed",
      ownerId: demoUser._id,
    },
    {
      name: "Pulse Diagnostics",
      sector: "Pharmaceuticals",
      description: "AI-assisted early screening for cardiovascular risk.",
      stage: "Series B",
      valuation: 96000000,
      arr: 9100000,
      burnRate: 420000,
      aiScore: 91,
      riskTier: "Low",
      founder: "Dr. Farah Islam",
      ownerId: demoUser._id,
    },
  ]);

  console.log("✅ Database seeded with demo user and sample assets");
}