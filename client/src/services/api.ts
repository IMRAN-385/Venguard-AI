import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { MOCK_ASSETS } from "@/lib/mockAssets";

// ============================================================
// Axios instance
// ============================================================

export const api = axios.create({
  baseURL: "/api",           // rewritten to http://localhost:5000/api in next.config.ts
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

// ------------------------------------------------------------
// Request interceptor — attach JWT
// ------------------------------------------------------------
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("vg_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ------------------------------------------------------------
// Response interceptor — offline-fallback + auth handling
// ------------------------------------------------------------
api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    const url = error.config?.url ?? "";
    const status = error.response?.status;

    // 401 → clear token so ProtectedRoute redirects
    if (status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("vg_token");
    }

    // Backend offline — return mock data so the UI stays alive
    const isNetworkError = !error.response;
    if (isNetworkError) {
      // GET /assets or /assets?mine=true or /assets?limit=8
      if (url.startsWith("/assets") && !url.includes("/reviews")) {
        // Details: /assets/:id
        const detailMatch = url.match(/\/assets\/([^/?]+)/);
        if (detailMatch) {
          const id = detailMatch[1];
          const found = MOCK_ASSETS.find((a) => a._id === id) ?? MOCK_ASSETS[0];
          return Promise.resolve({ data: { asset: found } });
        }
        return Promise.resolve({ data: { assets: MOCK_ASSETS } });
      }

      // /auth/me
      if (url.startsWith("/auth/me")) {
        return Promise.resolve({
          data: {
            user: {
              id: "demo",
              name: "Demo Investor",
              email: "demo.investor@vanguard-ai.io",
              firm: "Vanguard Demo",
            },
          },
        });
      }
    }

    return Promise.reject(error);
  }
);

// ============================================================
// Typed helpers — feel free to grow this
// ============================================================

export const authApi = {
  login:      (email: string, password: string) => api.post("/auth/login",       { email, password }),
  register:   (email: string, password: string, name: string) => api.post("/auth/register", { email, password, name }),
  demoLogin:  () => api.post("/auth/demo-login"),
  googleLogin:(token: string) => api.post("/auth/google-login", { token }),
  me:         () => api.get("/auth/me"),
};

export const assetsApi = {
  list:   (params?: Record<string, string | number | boolean>) => api.get("/assets", { params }),
  get:    (id: string) => api.get(`/assets/${id}`),
  create: (data: Partial<Record<string, unknown>>) => api.post("/assets", data),
  update: (id: string, data: Partial<Record<string, unknown>>) => api.patch(`/assets/${id}`, data),
  remove: (id: string) => api.delete(`/assets/${id}`),
};

export const aiApi = {
  generateMemo: (payload: Record<string, unknown>) => api.post("/ai/generate-memo", payload),
  recommend:    (payload: Record<string, unknown>) => api.post("/ai/recommend", payload),
  copilot:      (payload: Record<string, unknown>) => api.post("/ai/copilot", payload),
  analyze:      (form: FormData) => api.post("/ai/analyze", form, { headers: { "Content-Type": "multipart/form-data" } }),
  classify:     (text: string) => api.post("/ai/classify", { text }),
  settings:     (payload: Record<string, unknown>) => api.post("/ai/settings", payload),
};