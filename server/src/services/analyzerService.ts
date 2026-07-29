import { chat } from "./aiService";
import { ANALYZER_SYSTEM_PROMPT } from "../prompts";
import type { ParsedFinancials } from "./csvParser";
import type { Provider } from "../models";

// ============================================================
// Analyzer service — turns parsed CSV/JSON into structured KPIs
// ============================================================

export interface AnalyzerResponse {
  kpis: {
    label:    string;
    value:    string;
    delta:    string;
    positive: boolean;
    icon:     "money" | "up" | "down";
  }[];
  burn: { month: string; burn: number; runway: number }[];
  anomalies: { severity: "low" | "med" | "high"; message: string }[];
  summary:   string;
}

// Loose settings shape — only what we read here
export interface SettingsLike {
  primaryProvider: Provider;
  getKey: (p: Provider) => string | null;
}

export async function analyzeFinancials(
  parsed: ParsedFinancials,
  settings?: SettingsLike | null
): Promise<AnalyzerResponse> {
  const preview = parsed.rows.slice(0, 20);
  const tableStr = [
    parsed.headers.join(" | "),
    "-".repeat(parsed.headers.join(" | ").length),
    ...preview.map((row) =>
      parsed.headers.map((h) => String(row[h] ?? "")).join(" | ")
    ),
  ].join("\n");

  const provider = settings?.primaryProvider ?? "groq";
  const userKey  = settings?.getKey(provider) ?? undefined;

  const result = await chat(
    [
      { role: "system", content: ANALYZER_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Analyze the following ${parsed.format.toUpperCase()} data (${parsed.rowCount} rows):

${tableStr}

Return JSON only, matching the AnalyzerResponse schema.`,
      },
    ],
    { provider, userKey, json: true, temperature: 0.2 }
  );

  return safeParseAnalyzerJson(result.content);
}

function safeParseAnalyzerJson(raw: string): AnalyzerResponse {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```$/, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned) as AnalyzerResponse;
    if (!Array.isArray(parsed.kpis) || !Array.isArray(parsed.burn)) {
      throw new Error("Missing required fields");
    }
    return parsed;
  } catch {
    return {
      kpis: [],
      burn: [],
      anomalies: [{ severity: "med", message: "AI returned malformed output — no anomalies extracted." }],
      summary: "The analyzer could not produce a structured response. Try uploading a cleaner CSV.",
    };
  }
}