import mongoose, { Schema, Document } from "mongoose";

export interface IMemo extends Document {
  assetId: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  tone: "formal" | "concise" | "bullish";
  content: string;
  createdAt: Date;
}

const MemoSchema = new Schema<IMemo>(
  {
    assetId: { type: Schema.Types.ObjectId, ref: "Asset", required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tone: { type: String, enum: ["formal", "concise", "bullish"], default: "formal" },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IMemo>("Memo", MemoSchema);