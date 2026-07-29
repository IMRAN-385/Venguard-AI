import type { FilterQuery, SortOrder } from "mongoose";
import { Asset, type IAsset } from "../models";
import type { ListAssetsQuery } from "../validators/assetsValidators";

// ============================================================
// Business logic for asset listing + filtering + pagination
// ============================================================

interface ListResult {
  assets:   IAsset[];
  total:    number;
  page:     number;
  pageSize: number;
  totalPages: number;
}

/**
 * Build a Mongoose filter from validated query params.
 */
function buildFilter(query: ListAssetsQuery, userId?: string): FilterQuery<IAsset> {
  const filter: FilterQuery<IAsset> = {};

  if (query.q) {
    // Case-insensitive search over title + shortDescription + tags
    const rx = new RegExp(query.q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [
      { title:            rx },
      { shortDescription: rx },
      { tags:             rx },
    ];
  }

  if (query.sector)   filter.sector   = query.sector;
  if (query.stage)    filter.stage    = query.stage;
  if (query.verified) filter.verified = query.verified === "true";

  if (query.mine === "true" && userId) {
    filter.createdBy = userId;
  }

  return filter;
}

/**
 * Convert the client sort key into a Mongoose sort spec.
 */
function buildSort(sort: ListAssetsQuery["sort"]): Record<string, SortOrder> {
  switch (sort) {
    case "valuation": return { valuation: -1 };
    case "risk":      return { riskScore:  1 };
    case "verified":  return { verified:  -1, createdAt: -1 };
    case "newest":
    default:          return { createdAt: -1 };
  }
}

/**
 * List assets with filters + pagination.
 */
export async function listAssets(
  query: ListAssetsQuery,
  userId?: string
): Promise<ListResult> {
  const filter = buildFilter(query, userId);
  const sort   = buildSort(query.sort);
  const page   = query.page;
  const limit  = query.limit;
  const skip   = (page - 1) * limit;

  const [assets, total] = await Promise.all([
    Asset.find(filter).sort(sort).skip(skip).limit(limit).lean({ virtuals: true }),
    Asset.countDocuments(filter),
  ]);

  return {
    assets:     assets as unknown as IAsset[],
    total,
    page,
    pageSize:   limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

/**
 * Fetch a single asset by id.
 */
export async function getAssetById(id: string): Promise<IAsset | null> {
  return Asset.findById(id);
}