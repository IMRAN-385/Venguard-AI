import mongoose, { Schema, type Document, type Model } from "mongoose";
import bcrypt from "bcryptjs";

// ============================================================
// User model — investors, admins, analysts
// ============================================================

export type UserRole = "investor" | "admin" | "analyst";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name:      string;
  email:     string;
  password?: string;               // undefined for Google-only users
  firm?:     string;
  role:      UserRole;
  avatar?:   string;
  googleId?: string;
  isDemo?:   boolean;
  createdAt: Date;
  updatedAt: Date;

  // Instance methods
  comparePassword(candidate: string): Promise<boolean>;
  toSafeJSON(): SafeUser;
}

export interface SafeUser {
  id:     string;
  name:   string;
  email:  string;
  firm?:  string;
  role:   UserRole;
  avatar?: string;
  createdAt: Date;
}

// ------------------------------------------------------------
// Schema
// ------------------------------------------------------------

const userSchema = new Schema<IUser>(
  {
    name:  { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    email: {
      type: String, required: true, unique: true, lowercase: true, trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"],
    },
    password: {
      type: String,
      minlength: 8,
      select: false,               // never returned by default
    },
    firm:     { type: String, trim: true, maxlength: 120 },
    role:     { type: String, enum: ["investor", "admin", "analyst"], default: "investor", index: true },
    avatar:   { type: String, trim: true },
    googleId: { type: String, unique: true, sparse: true, index: true },
    isDemo:   { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

// ------------------------------------------------------------
// Hash password before save
// ------------------------------------------------------------
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err as Error);
  }
});

// ------------------------------------------------------------
// Instance methods
// ------------------------------------------------------------
userSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeJSON = function (): SafeUser {
  return {
    id:        this._id.toString(),
    name:      this.name,
    email:     this.email,
    firm:      this.firm,
    role:      this.role,
    avatar:    this.avatar,
    createdAt: this.createdAt,
  };
};

// ------------------------------------------------------------
// Never leak password in JSON responses
// ------------------------------------------------------------
userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform: (_doc, ret: any) => {
    delete ret.password;
    delete ret._id;
    return ret;
  },
});

// ------------------------------------------------------------
// Model
// ------------------------------------------------------------
export const User: Model<IUser> =
  mongoose.models.User as Model<IUser> ?? mongoose.model<IUser>("User", userSchema);