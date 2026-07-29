import bcrypt from "bcryptjs";

// ============================================================
// Password utilities — bcrypt hashing + strength validation
// ============================================================

const SALT_ROUNDS = 12;

/**
 * Hash a plain-text password. Returns the bcrypt hash string.
 */
export async function hashPassword(plaintext: string): Promise<string> {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(plaintext, salt);
}

/**
 * Compare a candidate password with a stored bcrypt hash.
 */
export async function verifyPassword(
  candidate: string,
  hash: string
): Promise<boolean> {
  if (!candidate || !hash) return false;
  return bcrypt.compare(candidate, hash);
}

/**
 * Enforce the same password policy the client shows:
 *   - 8+ characters
 *   - at least one uppercase letter
 *   - at least one number or symbol
 * Returns an array of human-readable issues (empty = valid).
 */
export function validatePasswordStrength(password: string): string[] {
  const issues: string[] = [];
  if (password.length < 8)             issues.push("Password must be at least 8 characters.");
  if (!/[A-Z]/.test(password))         issues.push("Password must include an uppercase letter.");
  if (!/[0-9!@#$%^&*]/.test(password)) issues.push("Password must include a number or symbol.");
  return issues;
}

/**
 * Generate a random password (used for Google-only accounts so
 * we can still store a placeholder bcrypt hash if the model
 * requires one). Length defaults to 32.
 */
export function generateRandomPassword(length = 32): string {
  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}