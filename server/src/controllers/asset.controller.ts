import { Response } from "express";
import Asset from "../models/Asset";
import { AuthRequest } from "../middleware/auth.middleware";

export const getAssets = async (req: AuthRequest, res: Response) => {
  const {
    search,
    sector,
    riskTier,
    minPrice,
    maxPrice,
    sortBy = "createdAt",
    sortOrder = "desc",
    page = "1",
    limit = "12",
  } = req.query as Record<string, string>;

  const filter: Record<string, any> = {};
  if (search) filter.$text = { $search: search };
  if (sector) filter.sector = sector;
  if (riskTier) filter.riskTier = riskTier;
  if (minPrice || maxPrice) {
    filter.valuation = {};
    if (minPrice) filter.valuation.$gte = Number(minPrice);
    if (maxPrice) filter.valuation.$lte = Number(maxPrice);
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));

  const [assets, total] = await Promise.all([
    Asset.find(filter)
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Asset.countDocuments(filter),
  ]);

  res.json({
    assets,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum),
  });
};

export const getAssetById = async (req: AuthRequest, res: Response) => {
  const asset = await Asset.findById(req.params.id);
  if (!asset) return res.status(404).json({ message: "Asset not found" });
  res.json(asset);
};

export const createAsset = async (req: AuthRequest, res: Response) => {
  try {
    const asset = await Asset.create({ ...req.body, ownerId: req.userId });
    res.status(201).json(asset);
  } catch (err: any) {
    res.status(400).json({ message: err.message || "Failed to create asset" });
  }
};

export const updateAsset = async (req: AuthRequest, res: Response) => {
  const asset = await Asset.findById(req.params.id);
  if (!asset) return res.status(404).json({ message: "Asset not found" });
  if (asset.ownerId.toString() !== req.userId) {
    return res.status(403).json({ message: "Not authorized to edit this asset" });
  }

  Object.assign(asset, req.body);
  await asset.save();
  res.json(asset);
};

export const deleteAsset = async (req: AuthRequest, res: Response) => {
  const asset = await Asset.findById(req.params.id);
  if (!asset) return res.status(404).json({ message: "Asset not found" });
  if (asset.ownerId.toString() !== req.userId) {
    return res.status(403).json({ message: "Not authorized to delete this asset" });
  }

  await asset.deleteOne();
  res.json({ message: "Asset deleted" });
};

export const getMyAssets = async (req: AuthRequest, res: Response) => {
  const assets = await Asset.find({ ownerId: req.userId }).sort({ createdAt: -1 });
  res.json(assets);
};