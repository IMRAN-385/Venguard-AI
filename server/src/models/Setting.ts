import mongoose, { Schema, Document } from "mongoose";

export interface ISetting extends Document {
  userId: mongoose.Types.ObjectId;
  provider: "openai" | "groq" | "gemini" | "claude";
  apiKey: string; // stored encrypted in production — see note below
  isActive: boolean;
}

const SettingSchema = new Schema<ISetting>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    provider: { type: String, enum: ["openai", "groq", "gemini", "claude"], required: true },
    apiKey: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

SettingSchema.index({ userId: 1, provider: 1 }, { unique: true });

export default mongoose.model<ISetting>("Setting", SettingSchema);