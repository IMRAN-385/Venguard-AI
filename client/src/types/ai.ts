export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface CopilotRequest {
  message: string;
  history: Pick<ChatMessage, "role" | "content">[];
}

export interface CopilotResponse {
  reply: string;
}

export type MemoTone = "formal" | "concise" | "bullish";

export interface GeneratorRequest {
  assetName: string;
  sector?: string;
  tone: MemoTone;
}

export interface GeneratorResponse {
  memo: string;
}

export interface AnalyzerMetric {
  label: string;
  value: string;
}

export interface AnalyzerResponse {
  summary: string;
  insights: string[];
  metrics: AnalyzerMetric[];
}