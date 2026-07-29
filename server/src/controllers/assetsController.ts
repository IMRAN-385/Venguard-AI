import type { Request, Response, NextFunction } from "express";
import { Asset } from "../models";
import * as assetsService from "../services/assetsService";
import {
  forbidden,
  notFound,
} from "../middleware/error";
import type {
  CreateAssetInput,
  UpdateAssetInput,
} from "../validators/assetsValidators";
import type { ListAssetsQuery } from "../validators/assetsValidators";

// ============================================================
// Asset controllers
// ============================================================

// ------------------------------------------------------------
// GET /api/assets
// ------------------------------------------------------------
export async function list(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Cast is safe — req.query is validated + coerced by validate({ query: listAssetsQuerySchema })
    const result = await assetsService.listAssets(
      req.query as unknown as ListAssetsQuery,
      req.user?.sub
    );
    res.json({
      assets:     result.assets,
      total:      result.total,
      page:       result.page,
      pageSize:   result.pageSize,
      totalPages: result.totalPages,
    });
  } catch (err) {
    next(err);
  }
}

// ------------------------------------------------------------
// GET /api/assets/:id
// ------------------------------------------------------------
export async function get(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const asset = await assetsService.getAssetById(req.params.id);
    if (!asset) throw notFound("Asset not found.");
    res.json({ asset });
  } catch (err) {
    next(err);
  }
}

// ------------------------------------------------------------
// POST /api/assets
// ------------------------------------------------------------
export async function create(
  req: Request<unknown, unknown, CreateAssetInput>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const asset = await Asset.create({
      ...req.body,
      createdBy: req.user!.sub,
    });
    res.status(201).json({ asset });
  } catch (err) {
    next(err);
  }
}

// ------------------------------------------------------------
// PATCH /api/assets/:id
// ------------------------------------------------------------
export async function update(
  req: Request<{ id: string }, unknown, UpdateAssetInput>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) throw notFound("Asset not found.");

    const isOwner = String(asset.createdBy) === req.user!.sub;
    const isAdmin = req.user!.role === "admin";
    if (!isOwner && !isAdmin) throw forbidden("You cannot edit this asset.");

    Object.assign(asset, req.body);
    await asset.save();

    res.json({ asset });
  } catch (err) {
    next(err);
  }
}

// ------------------------------------------------------------
// DELETE /api/assets/:id
// ------------------------------------------------------------
export async function remove(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) throw notFound("Asset not found.");

    const isOwner = String(asset.createdBy) === req.user!.sub;
    const isAdmin = req.user!.role === "admin";
    if (!isOwner && !isAdmin) throw forbidden("You cannot delete this asset.");

    await asset.deleteOne();
    res.json({ message: "Asset deleted.", id: req.params.id });
  } catch (err) {
    next(err);
  }
}