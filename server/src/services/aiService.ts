import Groq from "groq-sdk";
import { env } from "../config/env";
import type { Provider as UserProvider } from "../models";

// Wider provider type — includes "simulation" which is a valid env
// default but not a user-selectable choice in AiSettings.
export type Provider = UserProvider | "simulation";

// ============================================================
// Unified LLM interface with Groq + simulation fallback.
//
// Adding a new provider = one branch in `chat()`. The rest of
// the codebase stays provider-agnostic.
// ============================================================

export interface ChatMessage {
  role:    "system" | "user" | "assistant";
  content: string;
}

export interface ChatOptions {
  provider?:    Provider;
  model?:       string;
  temperature?: number;
  maxTokens?:   number;
  json?:        boolean;      // request JSON-only output
  userKey?:     string;       // per-user API key override
}

export interface ChatResult {
  content:   string;
  model:     string;
  provider:  string;
  tokens?:   number;
  latencyMs: number;
  simulated: boolean;
}

// ------------------------------------------------------------
// Provider clients (lazy singletons)
// ------------------------------------------------------------

let groqClient: Groq | null = null;
function getGroq(apiKey: string): Groq {
  if (!groqClient || (groqClient as unknown as { apiKey: string }).apiKey !== apiKey) {
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
}

// ------------------------------------------------------------
// Public: chat
// ------------------------------------------------------------
export async function chat(
  messages: ChatMessage[],
  opts: ChatOptions = {}
): Promise<ChatResult> {
  const provider = opts.provider ?? (env.DEFAULT_LLM_PROVIDER as Provider);
  const start = Date.now();

  try {
    switch (provider) {
      case "groq": {
        const key = opts.userKey || env.GROQ_API_KEY;
        if (!key) return simulate(messages, "groq (no key)", start);

        const model = opts.model ?? "llama-3.3-70b-versatile";
        const groq  = getGroq(key);

        const completion = await groq.chat.completions.create({
          model,
          messages,
          temperature: opts.temperature ?? 0.4,
          max_tokens:  opts.maxTokens ?? 1200,
          response_format: opts.json ? { type: "json_object" } : undefined,
        });

        const content = completion.choices[0]?.message?.content ?? "";
        return {
          content,
          model,
          provider:  "groq",
          tokens:    completion.usage?.total_tokens,
          latencyMs: Date.now() - start,
          simulated: false,
        };
      }

      // Placeholders — extend as you add SDKs
      case "openai":
      case "anthropic":
      case "gemini":
      case "together":
      case "ollama":
        return simulate(messages, `${provider} (not yet wired)`, start);

      case "simulation":
      default:
        return simulate(messages, "simulation", start);
    }
  } catch (err) {
    // Never fail the request because of an LLM error — fall back
    // eslint-disable-next-line no-console
    console.warn(`⚠️  LLM (${provider}) error — falling back to simulation:`, (err as Error).message);
    return simulate(messages, `${provider} (fallback)`, start);
  }
}

// ============================================================
// Simulation engine — deterministic, structured, realistic
// ============================================================

function simulate(messages: ChatMessage[], label: string, start: number): ChatResult {
  const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
  const system   = messages.find((m) => m.role === "system")?.content ?? "";

  let content = "";

  // --- Memo generator ---
  if (system.includes("Memo Generator")) {
    content = simulateMemo(lastUser);
  }
  // --- Classifier (JSON) ---
  else if (system.includes("Auto-Classification")) {
    content = simulateClassify(lastUser);
  }
  // --- Analyzer (JSON) ---
  else if (system.includes("Financial Data Analyzer")) {
    content = simulateAnalyzer();
  }
  // --- Matching engine (JSON) ---
  else if (system.includes("Smart Matching Engine")) {
    content = simulateMatching();
  }
  // --- Copilot (default) ---
  else {
    content = simulateCopilot(lastUser);
  }

  return {
    content,
    model:     `vanguard-sim-${label}`,
    provider:  "simulation",
    tokens:    Math.floor(content.length / 4),
    latencyMs: Date.now() - start,
    simulated: true,
  };
}

// ------------------------------------------------------------
function simulateCopilot(q: string): string {
  const openers = [
    "Based on the last 90 days of ingested deal-flow, ",
    "Cross-referencing the verified network, ",
    "Per the current agent mesh signal, ",
  ];
  const opener = openers[Math.floor(Math.random() * openers.length)];

  return `${opener}here's what I'm seeing:

• 3 startups match the shape of your query with verification scores above 85%.
• Top candidate is showing +142% YoY traction with a defensible IP moat (7 granted USPTO filings).
• Runway averages 18-22 months across the shortlist — no immediate distress signals.
• Sector concentration is currently balanced; adding one more position wouldn't breach your thesis limits.

Want me to draft a full memo for the top candidate?

— Vanguard Copilot (simulation mode)`;
}

// ------------------------------------------------------------
function simulateMemo(userPrompt: string): string {
  const companyMatch = userPrompt.match(/Company:\s*(.+)/);
  const sectorMatch  = userPrompt.match(/Sector:\s*(.+)/);
  const toneMatch    = userPrompt.match(/Tone:\s*(.+)/);
  const company = companyMatch?.[1]?.trim() ?? "Target Company";
  const sector  = sectorMatch?.[1]?.trim()  ?? "DeepTech";
  const tone    = toneMatch?.[1]?.trim()    ?? "Formal VC";
  const preVal  = (Math.random() * 60 + 20).toFixed(0);

  return `INVESTMENT MEMORANDUM
Company: ${company}
Sector:  ${sector} · Tone: ${tone}
Prepared by: Vanguard Memo Engine

EXECUTIVE SUMMARY
${company} is a category-defining ${sector.toLowerCase()} company with strong
technical differentiation and a defensible IP posture. Cross-referenced
against 3,200+ verified startups in the Vanguard network, we rate this
opportunity a High-Conviction Watchlist candidate for institutional deployment.

KEY METRICS
• Verification score:  87 / 100
• Patent moat:         7 filings, 3 granted USPTO
• Team pedigree:       ex-DeepMind, ex-DARPA, ex-Broad Institute
• Burn multiple:       1.8x (healthy for stage)
• Runway:              18 months at current rate

TECHNOLOGY & MOAT
The core technology exhibits meaningful defensibility across three axes:
IP (granted claims cover the primary use case), data network effects
(closed-loop telemetry improves the model with every deployment), and
regulatory positioning (early-mover engagement with the relevant agencies).

RISK ASSESSMENT
1. Regulatory uncertainty in target vertical (12-18 month timeline)
2. Concentrated customer pipeline (top 3 = 61% of pipeline)
3. Team gaps in enterprise GTM leadership

RECOMMENDATION
Proceed to partner meeting. Suggested check size: $2-4M at $${preVal}M pre-money.
Milestone-gated tranches recommended to manage regulatory risk.

— Vanguard Memo Engine · v4.2 (simulation)`;
}

// ------------------------------------------------------------
function simulateClassify(pitch: string): string {
  const p = pitch.toLowerCase();
  const map: [RegExp, string][] = [
    [/quantum|qubit/,                        "Quantum"],
    [/bio|protein|dna|drug|pharma/,          "BioTech"],
    [/fusion|reactor|tokamak/,               "Fusion"],
    [/robot|autonom(ous|y)/,                 "Robotics"],
    [/space|orbit|satellite|launch/,         "SpaceTech"],
    [/brain|neural|bci|cortex/,              "Neural"],
    [/carbon|climate|weather|green/,         "Climate"],
    [/defense|drone|military|swarm/,         "Defense"],
  ];
  const sector = map.find(([rx]) => rx.test(p))?.[1] ?? "Quantum";

  return JSON.stringify({
    sector,
    stage: "Series A",
    tags: ["#deeptech", "#patent-protected", `#${sector.toLowerCase()}`, "#agent-verified"],
    confidence: 0.82,
  });
}

// ------------------------------------------------------------
function simulateAnalyzer(): string {
  return JSON.stringify({
    kpis: [
      { label: "Monthly burn", value: "$412K",   delta: "-8%",     positive: true, icon: "money" },
      { label: "Runway",       value: "18.4 mo", delta: "+2.1 mo", positive: true, icon: "up"    },
      { label: "MRR",          value: "$186K",   delta: "+14%",    positive: true, icon: "up"    },
      { label: "CAC / LTV",    value: "0.32",    delta: "-0.04",   positive: true, icon: "down"  },
    ],
    burn: [
      { month: "Jan", burn: 480, runway: 22 },
      { month: "Feb", burn: 465, runway: 21 },
      { month: "Mar", burn: 452, runway: 20 },
      { month: "Apr", burn: 438, runway: 19 },
      { month: "May", burn: 420, runway: 19 },
      { month: "Jun", burn: 412, runway: 18 },
    ],
    anomalies: [
      { severity: "high", message: "AWS spend spiked 34% in May — flag for review" },
      { severity: "med",  message: "Contractor headcount up 3, no matching JD in HR data" },
      { severity: "low",  message: "Q2 marketing overspend by 6% vs plan" },
    ],
    summary:
      "Financial health is trending positive. Burn multiple compressed from 2.4x to 1.8x over 6 months. Runway extension driven by MRR growth outpacing OpEx. One material anomaly (AWS spike) requires investigation before next fundraise.",
  });
}

// ------------------------------------------------------------
function simulateMatching(): string {
  return JSON.stringify({
    matches: [
      { assetId: "vg-001", score: 0.94, reasoning: "Exact sector + stage fit; verification score 92%." },
      { assetId: "vg-004", score: 0.88, reasoning: "Adjacent sector with strong revenue traction ($42M ARR)." },
      { assetId: "vg-002", score: 0.81, reasoning: "Higher risk but rare fusion IP moat aligns with thesis." },
    ],
  });
}