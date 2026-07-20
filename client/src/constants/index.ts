export const NAV_LINKS = [
  { label: "Explore", href: "/explore" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "AI Copilot", href: "/ai/copilot" },
  { label: "Docs", href: "/docs" },
  { label: "Pricing", href: "/pricing" },
] as const;

export const SECTORS = [
  "Technology",
  "Telecom",
  "Banking",
  "Energy",
  "Pharmaceuticals",
  "Real Estate",
  "Consumer Goods",
  "Textiles",
] as const;

export const RISK_TIERS = ["Low", "Moderate", "High"] as const;

export const MEMO_TONES = ["formal", "concise", "bullish"] as const;

export const API_ROUTES = {
  assets: "/items",
  copilot: "/ai/copilot",
  generator: "/ai/generator",
  analyzer: "/ai/analyzer",
  contact: "/contact",
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    me: "/auth/me",
  },
} as const;

export const APP_NAME = "Vanguard AI";
export const APP_DESCRIPTION = "AI-powered asset intelligence and portfolio insight.";