import mongoose, { Schema, type Document, type Model } from "mongoose";

// ============================================================
// Asset model — verified deeptech startups
// Shape mirrors client's Asset interface in src/types/index.ts
// ============================================================

export type Sector =
  | "Quantum" | "BioTech" | "Fusion" | "Robotics"
  | "SpaceTech" | "Neural" | "Climate" | "Defense";

export type Stage =
  | "Pre-Seed" | "Seed" | "Series A" | "Series B" | "Series C+";

export interface IFounder {
  name: string;
  role: string;
  background: string;
}

export interface IMetric {
  label: string;
  value: string;
}

export interface IAsset extends Document {
  _id: mongoose.Types.ObjectId;
  title:            string;
  slug:             string;
  sector:           Sector;
  stage:            Stage;
  valuation:        number;
  shortDescription: string;
  longDescription?: string;
  image:            string;
  riskScore:        number;      // 0–100
  verified:         boolean;

  patents?:   number;
  employees?: number;
  founded?:   number;
  hq?:        string;
  website?:   string;

  founders?: IFounder[];
  metrics?:  IMetric[];
  tags?:     string[];

  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// ------------------------------------------------------------
// Sub-schemas
// ------------------------------------------------------------
const founderSchema = new Schema<IFounder>(
  {
    name:       { type: String, required: true, trim: true },
    role:       { type: String, required: true, trim: true },
    background: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const metricSchema = new Schema<IMetric>(
  {
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false }
);

// ------------------------------------------------------------
// Main schema
// ------------------------------------------------------------
const assetSchema = new Schema<IAsset>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200, index: "text" },
    slug:  { type: String, required: true, unique: true, lowercase: true, index: true },

    sector: {
      type: String,
      required: true,
      enum: ["Quantum", "BioTech", "Fusion", "Robotics", "SpaceTech", "Neural", "Climate", "Defense"],
      index: true,
    },
    stage: {
      type: String,
      required: true,
      enum: ["Pre-Seed", "Seed", "Series A", "Series B", "Series C+"],
      index: true,
    },

    valuation:        { type: Number, required: true, min: 0 },
    shortDescription: { type: String, required: true, trim: true, maxlength: 300 },
    longDescription:  { type: String, trim: true, maxlength: 5000 },
    image:            { type: String, required: true, trim: true },

    riskScore: { type: Number, required: true, min: 0, max: 100, default: 50 },
    verified:  { type: Boolean, default: false, index: true },

    patents:   { type: Number, min: 0, default: 0 },
    employees: { type: Number, min: 0 },
    founded:   { type: Number, min: 1900, max: 2100 },
    hq:        { type: String, trim: true },
    website:   { type: String, trim: true },

    founders: { type: [founderSchema], default: [] },
    metrics:  { type: [metricSchema],  default: [] },
    tags:     { type: [String],        default: [], index: true },

    createdBy: { type: Schema.Types.ObjectId, ref: "User", index: true },
  },
  { timestamps: true }
);

// ------------------------------------------------------------
// Auto-slug from title
// ------------------------------------------------------------
assetSchema.pre<IAsset>("validate", function (next) {
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 80);
  }
  next();
});

// ------------------------------------------------------------
// Indexes for common queries
// ------------------------------------------------------------
assetSchema.index({ sector: 1, stage: 1 });
assetSchema.index({ verified: 1, valuation: -1 });
assetSchema.index({ createdAt: -1 });

// ------------------------------------------------------------
// Serialization: expose `id`, hide internal fields
// ------------------------------------------------------------
assetSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform: (_doc, ret: any) => {
    if (ret._id) {
      ret._id = String(ret._id);
    }
    delete ret.id;
    return ret;
  },
});

export const Asset: Model<IAsset> =
  mongoose.models.Asset as Model<IAsset> ?? mongoose.model<IAsset>("Asset", assetSchema);