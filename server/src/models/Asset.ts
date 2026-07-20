import mongoose, { Schema, Document } from "mongoose";

export interface IAsset extends Document {
  name: string;
  sector: string;
  description: string;
  stage: "Pre-Seed" | "Seed" | "Series A" | "Series B" | "Growth";
  valuation: number;
  arr: number; // annual recurring revenue
  burnRate: number; // monthly, USD
  aiScore: number; // 0-100 computed score
  riskTier: "Low" | "Moderate" | "High";
  imageUrl?: string;
  founder: string;
  ownerId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AssetSchema = new Schema<IAsset>(
  {
    name: { type: String, required: true, trim: true },
    sector: { type: String, required: true, index: true },
    description: { type: String, required: true },
    stage: {
      type: String,
      enum: ["Pre-Seed", "Seed", "Series A", "Series B", "Growth"],
      default: "Seed",
    },
    valuation: { type: Number, required: true, index: true },
    arr: { type: Number, default: 0 },
    burnRate: { type: Number, default: 0 },
    aiScore: { type: Number, default: 50, min: 0, max: 100 },
    riskTier: { type: String, enum: ["Low", "Moderate", "High"], default: "Moderate", index: true },
    imageUrl: { type: String },
    founder: { type: String, required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

AssetSchema.index({ name: "text", description: "text", sector: "text" });

export default mongoose.model<IAsset>("Asset", AssetSchema);