import { z } from "zod";

// ============================================================
// Zod schemas for /api/assets and /api/assets/:id/reviews
// ============================================================

const SECTORS = [
  "Quantum", "BioTech", "Fusion", "Robotics",
  "SpaceTech", "Neural", "Climate", "Defense",
] as const;

const STAGES = [
  "Pre-Seed", "Seed", "Series A", "Series B", "Series C+",
] as const;

// ------------------------------------------------------------
// Sub-schemas
// ------------------------------------------------------------
const founderSchema = z.object({
  name:       z.string().trim().min(1).max(120),
  role:       z.string().trim().min(1).max(80),
  background: z.string().trim().min(1).max(400),
});

const metricSchema = z.object({
  label: z.string().trim().min(1).max(60),
  value: z.string().trim().min(1).max(120),
});

// ------------------------------------------------------------
// Create asset
// ------------------------------------------------------------
export const createAssetSchema = z.object({
  title:            z.string().trim().min(2).max(200),
  sector:           z.enum(SECTORS),
  stage:            z.enum(STAGES),
  valuation:        z.coerce.number().nonnegative().max(1e12),
  shortDescription: z.string().trim().min(10).max(300),
  longDescription:  z.string().trim().max(5000).optional(),
  image:            z.string().trim().url("Image must be a valid URL."),
  riskScore:        z.coerce.number().min(0).max(100).optional().default(50),
  verified:         z.coerce.boolean().optional().default(false),

  patents:   z.coerce.number().int().min(0).optional(),
  employees: z.coerce.number().int().min(0).optional(),
  founded:   z.coerce.number().int().min(1900).max(2100).optional(),
  hq:        z.string().trim().max(120).optional(),
  website:   z.string().trim().max(200).optional(),

  founders: z.array(founderSchema).max(20).optional(),
  metrics:  z.array(metricSchema).max(30).optional(),
  tags:     z.array(z.string().trim().min(1).max(40)).max(20).optional(),
});
export type CreateAssetInput = z.infer<typeof createAssetSchema>;

// ------------------------------------------------------------
// Update asset — all fields optional
// ------------------------------------------------------------
export const updateAssetSchema = createAssetSchema.partial();
export type UpdateAssetInput = z.infer<typeof updateAssetSchema>;

// ------------------------------------------------------------
// List query params
// ------------------------------------------------------------
export const listAssetsQuerySchema = z.object({
  q:        z.string().trim().optional(),
  sector:   z.enum(SECTORS).optional(),
  stage:    z.enum(STAGES).optional(),
  verified: z.enum(["true", "false"]).optional(),
  mine:     z.enum(["true", "false"]).optional(),
  sort:     z.enum(["newest", "valuation", "risk", "verified"]).optional().default("newest"),
  page:     z.coerce.number().int().positive().optional().default(1),
  limit:    z.coerce.number().int().positive().max(100).optional().default(24),
});
export type ListAssetsQuery = z.infer<typeof listAssetsQuerySchema>;

// ------------------------------------------------------------
// :id param — Mongo ObjectId (24 hex chars)
// ------------------------------------------------------------
export const idParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid asset id."),
});

// ------------------------------------------------------------
// Review body
// ------------------------------------------------------------
export const createReviewSchema = z.object({
  rating:  z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().min(4).max(2000),
});
export type CreateReviewInput = z.infer<typeof createReviewSchema>;