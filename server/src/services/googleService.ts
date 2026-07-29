import { OAuth2Client, type TokenPayload } from "google-auth-library";
import { env } from "../config/env";
import { badRequest, unauthorized } from "../middleware/error";

// ============================================================
// Google OAuth — verify ID tokens from the client
//
// In production the client obtains an id_token via
// @react-oauth/google and posts it here. We verify signature
// against Google's public keys and extract profile info.
// ============================================================

const DEMO_TOKEN = "demo-google-id-token";

let client: OAuth2Client | null = null;

function getClient(): OAuth2Client {
  if (!client) {
    client = new OAuth2Client(env.GOOGLE_CLIENT_ID);
  }
  return client;
}

export interface GoogleProfile {
  googleId: string;
  email:    string;
  name:     string;
  avatar?:  string;
  isDemo:   boolean;
}

/**
 * Verify an incoming Google id_token from the client.
 * Falls back to a "demo" profile if the special demo token is
 * used or if GOOGLE_CLIENT_ID isn't configured (dev convenience).
 */
export async function verifyGoogleToken(idToken: string): Promise<GoogleProfile> {
  if (!idToken) throw badRequest("Missing Google id_token.");

  // -------- Demo path (no Google Cloud setup needed) --------
  if (idToken === DEMO_TOKEN || !env.GOOGLE_CLIENT_ID) {
    return {
      googleId: "demo-google-uid",
      email:    "demo.google@vanguard-ai.io",
      name:     "Demo Google User",
      avatar:   "https://ui-avatars.com/api/?name=Demo+Google&background=D7FF3A&color=0A0A0B",
      isDemo:   true,
    };
  }

  // -------- Real path --------
  try {
    const ticket = await getClient().verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload() as TokenPayload | undefined;
    if (!payload || !payload.sub || !payload.email) {
      throw unauthorized("Google token is missing required fields.");
    }
    if (payload.email_verified === false) {
      throw unauthorized("Google email is not verified.");
    }

    return {
      googleId: payload.sub,
      email:    payload.email.toLowerCase(),
      name:     payload.name ?? payload.email.split("@")[0],
      avatar:   payload.picture,
      isDemo:   false,
    };
  } catch (err) {
    if ((err as { statusCode?: number })?.statusCode) throw err;
    throw unauthorized("Failed to verify Google credentials.");
  }
}