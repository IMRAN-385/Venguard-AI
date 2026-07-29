"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { api, authApi } from "@/services/api";
import { MOCK_USER } from "@/lib/mockAssets";
import type { User } from "@/types";

// ============================================================
// Context shape
// ============================================================

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  demoLogin: () => Promise<void>;
  logout: () => void;
  setUserFromToken: (token: string, user: User) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "vg_token";
const USER_KEY  = "vg_user";

// ============================================================
// Provider
// ============================================================

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Hydrate from localStorage on mount, then verify with backend
  useEffect(() => {
    if (typeof window === "undefined") { setLoading(false); return; }

    const cachedUser  = localStorage.getItem(USER_KEY);
    const cachedToken = localStorage.getItem(TOKEN_KEY);

    if (cachedUser) {
      try { setUser(JSON.parse(cachedUser)); } catch { /* ignore */ }
    }

    if (cachedToken) {
      // Verify token still valid; if backend down, keep cached user
      authApi.me()
        .then(({ data }) => {
          const u: User = data.user ?? data;
          setUser(u);
          localStorage.setItem(USER_KEY, JSON.stringify(u));
        })
        .catch(() => {
          // Token invalid → clear. Network error → keep cached (offline mode).
          // The api interceptor already clears on 401.
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // --------------------------------------------------------
  // Actions
  // --------------------------------------------------------

  const persist = (token: string, u: User) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    setUser(u);
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { data } = await authApi.login(email, password);
      persist(data.token, data.user);
    } catch (err) {
      // Offline fallback: accept demo credentials so the UI is testable
      if (email === MOCK_USER.email && password === "Vanguard2026!") {
        persist("offline-demo-token", MOCK_USER);
        return;
      }
      throw new Error(
        (err as { response?: { data?: { message?: string } } })
          ?.response?.data?.message ?? "Invalid email or password."
      );
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    try {
      const { data } = await authApi.register(email, password, name);
      persist(data.token, data.user);
    } catch (err) {
      // Offline fallback: create a local session
      const localUser: User = {
        id: "local-" + Date.now(),
        name,
        email,
        role: "investor",
      };
      persist("offline-local-token", localUser);
      // Rethrow only for real API errors (not network errors)
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status && status !== 0) {
        throw new Error(
          (err as { response?: { data?: { message?: string } } })
            ?.response?.data?.message ?? "Registration failed."
        );
      }
    }
  }, []);

  const demoLogin = useCallback(async () => {
    try {
      const { data } = await authApi.demoLogin();
      persist(data.token, data.user);
    } catch {
      persist("offline-demo-token", MOCK_USER);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    // Clear axios default header
    delete api.defaults.headers.common.Authorization;
    // Redirect to home
    if (typeof window !== "undefined") window.location.href = "/";
  }, []);

  const setUserFromToken = useCallback((token: string, u: User) => {
    persist(token, u);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, demoLogin, logout, setUserFromToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ============================================================
// Hook
// ============================================================

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}