"use client";

import { useGoogleLogin } from "@react-oauth/google";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

interface Props {
  label: string;
  onSuccess?: () => void;
}

export function GoogleButton({ label, onSuccess }: Props) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setUserFromToken } = useAuth();

  // Only render after client mount → prevents SSR hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.post("/auth/google-login", {
          token: tokenResponse.access_token,
        });

        if (data.token && data.user) {
          setUserFromToken?.(data.token, data.user);
          onSuccess?.();
        } else {
          throw new Error("Invalid backend response");
        }
      } catch (err) {
        console.error("Google login failed:", err);
        setError("Google sign-in failed. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    onError: (err) => {
      console.error("Google OAuth error:", err);
      setError("Google sign-in was cancelled or failed.");
      setLoading(false);
    },
    flow: "implicit",
  });

  // Render a static placeholder on server + first client render
  // then swap to real button after mount
  if (!mounted) {
    return (
      <div className="w-full space-y-2">
        <button
          type="button"
          disabled
          className="w-full flex items-center justify-center gap-3 py-3 rounded-full bg-bone-50 text-ink-950 opacity-60"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <span className="text-sm font-medium">{label}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-2">
      <button
        type="button"
        onClick={() => login()}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 py-3 rounded-full bg-bone-50 text-ink-950 hover:bg-bone-100 transition disabled:opacity-40"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
        )}
        <span className="text-sm font-medium">{label}</span>
      </button>

      {error && (
        <p className="text-xs text-orange-400 text-center">{error}</p>
      )}
    </div>
  );
}