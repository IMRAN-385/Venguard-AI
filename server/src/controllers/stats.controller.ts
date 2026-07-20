import { Response } from "express";
import Asset from "../models/Asset";
import { AuthRequest } from "../middleware/auth.middleware";

export const getPortfolioStats = async (req: AuthRequest, res: Response) => {
  const assets = await Asset.find({ ownerId: req.userId });

  const totalValue = assets.reduce((sum, a) => sum + a.valuation, 0);
  const bySector = assets.reduce((acc: Record<string, number>, a) => {
    acc[a.sector] = (acc[a.sector] || 0) + a.valuation;
    return acc;
  }, {});

  const sectorChartData = Object.entries(bySector).map(([sector, value]) => ({ sector, value }));

  res.json({
    totalValue,
    assetCount: assets.length,
    avgAiScore: assets.length
      ? Math.round(assets.reduce((s, a) => s + a.aiScore, 0) / assets.length)
      : 0,
    sectorChartData,
  });
};

export const getMarketStats = async (_req: AuthRequest, res: Response) => {
  const [bySector, topAssets] = await Promise.all([
    Asset.aggregate([
      { $group: { _id: "$sector", totalValuation: { $sum: "$valuation" }, count: { $sum: 1 } } },
      { $sort: { totalValuation: -1 } },
    ]),
    Asset.find().sort({ aiScore: -1 }).limit(5),
  ]);

  res.json({ bySector, topAssets });
};