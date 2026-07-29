// ============================================================
// Shared TypeScript types for Vanguard AI client
// ============================================================

export interface User {
  id: string;
  name: string;
  email: string;
  firm?: string;
  role?: "investor" | "admin" | "analyst";
  avatar?: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Asset {
  _id: string;
  title: string;
  sector: string;
  stage: string;
  valuation: number;
  shortDescription: string;
  longDescription?: string;
  image: string;
  riskScore: number;
  verified: boolean;

  patents?: number;
  employees?: number;
  founded?: number;
  hq?: string;
  website?: string;

  founders?: Founder[];
  metrics?: Metric[];
  reviews?: Review[];

  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Founder {
  name: string;
  role: string;
  background: string;
}

export interface Metric {
  label: string;
  value: string;
}

export interface Review {
  author: string;
  rating: number;
  comment: string;
  date: string;
}

// ------------------------------------------------------------
// AI / Agent types
// ------------------------------------------------------------

export type AgentId =
  | "generator"
  | "matching"
  | "copilot"
  | "analyzer"
  | "classifier"
  | "router";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt?: number;
}

export interface MemoRequest {
  company: string;
  sector: string;
  tone: string;
  length: string;
  notes?: string;
}

export interface MemoResponse {
  memo: string;
  sources?: { label: string; url: string }[];
  model?: string;
  tokens?: number;
}

export interface AnalyzerResponse {
  kpis: {
    label: string;
    value: string;
    delta: string;
    positive: boolean;
    icon: "money" | "up" | "down";
  }[];
  burn: { month: string; burn: number; runway: number }[];
  anomalies: { severity: "low" | "med" | "high"; message: string }[];
  summary: string;
}

// ------------------------------------------------------------
// API responses
// ------------------------------------------------------------

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}