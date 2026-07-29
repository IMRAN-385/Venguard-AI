import mongoose, { Schema, type Document, type Model } from "mongoose";

// ============================================================
// Memo model — audit trail of every generated investment memo
// Enables re-download, versioning, and analytics.
// ============================================================

export interface ISource {
  label: string;
  url:   string;
}

export interface IMemo extends Document {
  _id: mongoose.Types.ObjectId;
  user:      mongoose.Types.ObjectId;
  asset?:    mongoose.Types.ObjectId;
  company:   string;
  sector:    string;
  tone:      string;
  length:    string;
  notes?:    string;
  content:   string;
  sources?:  ISource[];
  llmModel:  string;         // renamed from `model` (conflicts w/ Document)
  provider:  string;
  tokens?:   number;
  latencyMs?: number;
  createdAt: Date;
  updatedAt: Date;
}

const sourceSchema = new Schema<ISource>(
  {
    label: { type: String, required: true, trim: true },
    url:   { type: String, required: true, trim: true },
  },
  { _id: false }
);

const memoSchema = new Schema<IMemo>(
  {
    user:    { type: Schema.Types.ObjectId, ref: "User",  required: true, index: true },
    asset:   { type: Schema.Types.ObjectId, ref: "Asset", index: true },
    company: { type: String, required: true, trim: true },
    sector:  { type: String, required: true, trim: true },
    tone:    { type: String, required: true, trim: true },
    length:  { type: String, required: true, trim: true },
    notes:   { type: String, trim: true, maxlength: 2000 },

    content:  { type: String, required: true },
    sources:  { type: [sourceSchema], default: [] },

    llmModel:  { type: String, required: true, trim: true },
    provider:  { type: String, required: true, trim: true, index: true },
    tokens:    { type: Number, min: 0 },
    latencyMs: { type: Number, min: 0 },
  },
  { timestamps: true }
);

memoSchema.index({ user: 1, createdAt: -1 });

memoSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform: (_doc, ret: any) => {
    if (ret._id) ret._id = String(ret._id);
    delete ret.id;
    return ret;
  },
});
export const Memo: Model<IMemo> =
  mongoose.models.Memo as Model<IMemo> ?? mongoose.model<IMemo>("Memo", memoSchema);