import mongoose, { Schema, type Document, type Model } from "mongoose";

// ============================================================
// Review model — analyst reviews of assets
// ============================================================

export interface IReview extends Document {
  _id: mongoose.Types.ObjectId;
  asset:   mongoose.Types.ObjectId;
  author:  mongoose.Types.ObjectId;    // ref User
  rating:  number;                     // 1–5
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    asset:  { type: Schema.Types.ObjectId, ref: "Asset", required: true, index: true },
    author: { type: Schema.Types.ObjectId, ref: "User",  required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: {
      type: String, required: true, trim: true,
      minlength: 4, maxlength: 2000,
    },
  },
  { timestamps: true }
);

// One review per user per asset
reviewSchema.index({ asset: 1, author: 1 }, { unique: true });

reviewSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform: (_doc, ret: any) => {
    if (ret._id) ret._id = String(ret._id);
    delete ret.id;
    return ret;
  },
});

export const Review: Model<IReview> =
  mongoose.models.Review as Model<IReview> ?? mongoose.model<IReview>("Review", reviewSchema);