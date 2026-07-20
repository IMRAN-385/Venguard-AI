import { Asset } from "./asset";

export interface Recommendation {
  asset: Asset;
  score: number; // 0-100 confidence/fit score
  reason: string;
}

export interface PortfolioHolding {
  assetId: string;
  asset: Asset;
  quantity: number;
  addedAt: string;
}

export interface PortfolioSummary {
  totalValue: number;
  totalChange: number; // percent
  holdings: PortfolioHolding[];
  recommendations: Recommendation[];
}