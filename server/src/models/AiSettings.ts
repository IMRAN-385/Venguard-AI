import mongoose, { Schema, type Document, type Model } from "mongoose";
import crypto from "crypto";
import { env } from "../config/env";

// ============================================================
// AI Settings — per-user LLM provider preference + encrypted keys
//
// Keys are encrypted with AES-256-GCM using a key derived from
// JWT_SECRET so they're never stored plain-text in the DB.
// ============================================================

export type Provider = "groq" | "openai" | "anthropic" | "gemini" | "together" | "ollama";

export interface INotificationPrefs {
  weekly:   boolean;
  deals:    boolean;
  stress:   boolean;
  critical: boolean;
}

export interface IAiSettings extends Document {
  _id: mongoose.Types.ObjectId;
  user:            mongoose.Types.ObjectId;
  primaryProvider: Provider;
  encryptedKeys:   Record<string, string>;   // provider -> ciphertext
  notify:          INotificationPrefs;
  createdAt: Date;
  updatedAt: Date;

  // Instance helpers
  setKey(provider: Provider, plaintext: string): void;
  getKey(provider: Provider): string | null;
  toClientJSON(): {
    primaryProvider: Provider;
    providersConfigured: Provider[];
    notify: INotificationPrefs;
  };
}

// ------------------------------------------------------------
// Crypto helpers
// ------------------------------------------------------------

const ALGO = "aes-256-gcm";

function deriveKey(): Buffer {
  return crypto.createHash("sha256").update(env.JWT_SECRET).digest();
}

function encrypt(plaintext: string): string {
  if (!plaintext) return "";
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, deriveKey(), iv);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  // Format: iv:tag:cipher  (all base64)
  return `${iv.toString("base64")}:${tag.toString("base64")}:${enc.toString("base64")}`;
}

function decrypt(payload: string): string {
  if (!payload) return "";
  const [ivB64, tagB64, encB64] = payload.split(":");
  if (!ivB64 || !tagB64 || !encB64) return "";
  const decipher = crypto.createDecipheriv(ALGO, deriveKey(), Buffer.from(ivB64, "base64"));
  decipher.setAuthTag(Buffer.from(tagB64, "base64"));
  const dec = Buffer.concat([decipher.update(Buffer.from(encB64, "base64")), decipher.final()]);
  return dec.toString("utf8");
}

// ------------------------------------------------------------
// Schema
// ------------------------------------------------------------
const aiSettingsSchema = new Schema<IAiSettings>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    primaryProvider: {
      type: String,
      enum: ["groq", "openai", "anthropic", "gemini", "together", "ollama"],
      default: "groq",
    },
    encryptedKeys: {
      type: Object,
      default: {},
    },
    notify: {
      weekly:   { type: Boolean, default: true  },
      deals:    { type: Boolean, default: true  },
      stress:   { type: Boolean, default: false },
      critical: { type: Boolean, default: true  },
    },
  },
  { timestamps: true, minimize: false }
);

// ------------------------------------------------------------
// Instance methods
// ------------------------------------------------------------
aiSettingsSchema.methods.setKey = function (provider: Provider, plaintext: string) {
  if (!plaintext) {
    delete this.encryptedKeys[provider];
  } else {
    this.encryptedKeys[provider] = encrypt(plaintext);
  }
  this.markModified("encryptedKeys");
};

aiSettingsSchema.methods.getKey = function (provider: Provider): string | null {
  const enc = this.encryptedKeys[provider];
  if (!enc) return null;
  try {
    return decrypt(enc);
  } catch {
    return null;
  }
};

aiSettingsSchema.methods.toClientJSON = function () {
  return {
    primaryProvider: this.primaryProvider,
    providersConfigured: Object.keys(this.encryptedKeys) as Provider[],
    notify: this.notify,
  };
};

// Never leak encrypted keys via toJSON
aiSettingsSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform: (_doc, ret: any) => {
    delete ret.encryptedKeys;
    delete ret._id;
    return ret;
  },
});

export const AiSettings: Model<IAiSettings> =
  mongoose.models.AiSettings as Model<IAiSettings> ??
  mongoose.model<IAiSettings>("AiSettings", aiSettingsSchema);