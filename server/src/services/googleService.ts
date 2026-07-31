import { OAuth2Client } from "google-auth-library";
import { env } from "../config/env";
import { badRequest, unauthorized } from "../middleware/error";

const DEMO_TOKEN = "demo-google-id-token";

let client: OAuth2Client | null = null;
function getClient(): OAuth2Client {
  if (!client) client = new OAuth2Client(env.GOOGLE_CLIENT_ID);
  return client;
}

export interface GoogleProfile {
  googleId: string;
  email:    string;
  name:     string;
  avatar?:  string;
  isDemo:   boolean;
}

export async function verifyGoogleToken(token: string): Promise<GoogleProfile> {
  console.log("🔵 [Google] Verifying token, length:", token?.length ?? 0);
  console.log("🔵 [Google] Token starts with:", token?.substring(0, 20));
  console.log("🔵 [Google] GOOGLE_CLIENT_ID configured:", !!env.GOOGLE_CLIENT_ID);
  console.log("🔵 [Google] GOOGLE_CLIENT_ID value:", env.GOOGLE_CLIENT_ID?.substring(0, 30) + "...");

  if (!token) {
    console.error("❌ [Google] No token provided");
    throw badRequest("Missing Google token.");
  }

  if (token === DEMO_TOKEN || !env.GOOGLE_CLIENT_ID) {
    console.log("🟡 [Google] Using demo path (no client ID or demo token)");
    return {
      googleId: "demo-google-uid",
      email:    "demo.google@vanguard-ai.io",
      name:     "Demo Google User",
      avatar:   "https://ui-avatars.com/api/?name=Demo+Google&background=D7FF3A&color=0A0A0B",
      isDemo:   true,
    };
  }

  try {
    console.log("🔵 [Google] Calling Google userinfo endpoint...");
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("🔵 [Google] Google response status:", response.status);

    if (!response.ok) {
      const errBody = await response.text();
      console.error("❌ [Google] userinfo failed:", response.status, errBody);
      throw unauthorized(`Google rejected token (${response.status}): ${errBody}`);
    }

    const payload = await response.json() as {
      sub: string;
      email: string;
      email_verified: boolean;
      name?: string;
      picture?: string;
    };

    console.log("✅ [Google] Profile received:", {
      sub: payload.sub,
      email: payload.email,
      verified: payload.email_verified,
    });

    if (!payload.sub || !payload.email) {
      throw unauthorized("Google response missing required fields.");
    }

    return {
      googleId: payload.sub,
      email:    payload.email.toLowerCase(),
      name:     payload.name ?? payload.email.split("@")[0],
      avatar:   payload.picture,
      isDemo:   false,
    };
  } catch (err) {
    console.error("❌ [Google] Exception:", (err as Error).message);
    if ((err as { statusCode?: number })?.statusCode) throw err;
    throw unauthorized("Failed to verify Google credentials.");
  }
}

void getClient;