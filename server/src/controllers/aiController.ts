import type { Request, Response, NextFunction } from "express";
import { AiSettings, Memo, type Provider } from "../models";
import { chat } from "../services/aiService";
import { parseFile } from "../services/csvParser";
import { analyzeFinancials } from "../services/analyzerService";
import { env } from "../config/env";
import {
  COPILOT_SYSTEM_PROMPT,
  MEMO_SYSTEM_PROMPT,
  CLASSIFIER_SYSTEM_PROMPT,
  buildMemoPrompt,
  buildClassifyPrompt,
} from "../prompts";
import { badRequest, unauthorized } from "../middleware/error";

// ============================================================
// AI controllers — thin HTTP layer over aiService + analyzerService
// ============================================================

/**
 * Load per-user AI settings (or return null if none saved yet).
 * Never throws — falls back to env defaults if unauthenticated.
 */
async function getUserSettings(userId?: string) {
  if (!userId) return null;
  return AiSettings.findOne({ user: userId });
}

// ------------------------------------------------------------
// POST /api/ai/copilot
// ------------------------------------------------------------
export async function copilot(
  req: Request<unknown, unknown, { message: string; history?: { role: string; content: string }[]; model?: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { message, history = [], model } = req.body;
    if (!message?.trim()) throw badRequest("Message is required.");

    const settings = await getUserSettings(req.user?.sub);
    const provider = settings?.primaryProvider ?? env.DEFAULT_LLM_PROVIDER;
    const userKey = provider !== "simulation"
  ? settings?.getKey(provider) ?? undefined
  : undefined;

    const messages = [
      { role: "system" as const, content: COPILOT_SYSTEM_PROMPT },
      ...history.slice(-10).map((m) => ({
        role: (m.role === "user" ? "user" : "assistant") as "user" | "assistant",
        content: m.content,
      })),
      { role: "user" as const, content: message },
    ];

    const result = await chat(messages, { provider, userKey, model, temperature: 0.5 });

    res.json({
      reply:     result.content,
      response:  result.content,       // alias for older clients
      model:     result.model,
      provider:  result.provider,
      simulated: result.simulated,
      latencyMs: result.latencyMs,
    });
  } catch (err) {
    next(err);
  }
}

// ------------------------------------------------------------
// POST /api/ai/generate-memo
// ------------------------------------------------------------
export async function generateMemo(
  req: Request<unknown, unknown, { company: string; sector: string; tone: string; length: string; notes?: string; assetId?: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { company, sector, tone, length, notes, assetId } = req.body;
    if (!company?.trim()) throw badRequest("Company name is required.");

    const settings = await getUserSettings(req.user?.sub);
    const provider = settings?.primaryProvider ?? env.DEFAULT_LLM_PROVIDER;
  const userKey = provider !== "simulation"
  ? settings?.getKey(provider) ?? undefined
  : undefined;

    const result = await chat(
      [
        { role: "system", content: MEMO_SYSTEM_PROMPT },
        { role: "user",   content: buildMemoPrompt({ company, sector, tone, length, notes }) },
      ],
      { provider, userKey, temperature: 0.4, maxTokens: 1800 }
    );

    // Persist audit trail if user is authenticated
    if (req.user?.sub) {
      await Memo.create({
        user:      req.user.sub,
        asset:     assetId,
        company, sector, tone, length, notes,
        content:   result.content,
        llmModel:  result.model,     // renamed field
        provider:  result.provider,
        tokens:    result.tokens,
        latencyMs: result.latencyMs,
      }).catch(() => { /* audit failure shouldn't break the response */ });
    }

    res.json({
      memo:      result.content,
      output:    result.content,       // alias
      model:     result.model,
      provider:  result.provider,
      simulated: result.simulated,
    });
  } catch (err) {
    next(err);
  }
}

// ------------------------------------------------------------
// POST /api/ai/classify
// ------------------------------------------------------------
export async function classify(
  req: Request<unknown, unknown, { text: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { text } = req.body;
    if (!text?.trim()) throw badRequest("Text is required.");

    const result = await chat(
      [
        { role: "system", content: CLASSIFIER_SYSTEM_PROMPT },
        { role: "user",   content: buildClassifyPrompt(text) },
      ],
      { json: true, temperature: 0.1 }
    );

    let parsed: Record<string, unknown> = {};
    try { parsed = JSON.parse(result.content); }
    catch { parsed = { sector: "Quantum", stage: "Seed", tags: [], confidence: 0.5 }; }

    res.json({
      ...parsed,
      simulated: result.simulated,
    });
  } catch (err) {
    next(err);
  }
}

// ------------------------------------------------------------
// POST /api/ai/analyze     (multipart/form-data with "file")
// ------------------------------------------------------------
export async function analyze(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.file) throw badRequest("No file uploaded. Use multipart/form-data with field 'file'.");

    const parsed   = parseFile(req.file);
    const settings = await getUserSettings(req.user?.sub);
    const analysis = await analyzeFinancials(parsed, settings ?? undefined);

    res.json({
      analysis,
      meta: {
        filename: req.file.originalname,
        rows:     parsed.rowCount,
        format:   parsed.format,
      },
    });
  } catch (err) {
    next(err);
  }
}

// ------------------------------------------------------------
// POST /api/ai/recommend
// Stub — full matching engine can be added later
// ------------------------------------------------------------
export async function recommend(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // For now we return a static-but-realistic response.
    // Extend later by feeding real portfolio + candidate assets to Agent 02.
    res.json({
      matches: [
        { assetId: "seeded-vg-001", score: 0.94, reasoning: "Sector + stage fit; 92% verification." },
        { assetId: "seeded-vg-004", score: 0.88, reasoning: "Strong revenue traction ($42M ARR)." },
        { assetId: "seeded-vg-002", score: 0.81, reasoning: "Rare fusion IP moat aligns with thesis." },
      ],
    });
  } catch (err) {
    next(err);
  }
}

// ------------------------------------------------------------
// POST /api/ai/settings    (upsert per-user)
// ------------------------------------------------------------
export async function saveSettings(
  req: Request<unknown, unknown, {
    primaryProvider?: Provider;
    keys?: Partial<Record<Provider, string>>;
    notify?: { weekly?: boolean; deals?: boolean; stress?: boolean; critical?: boolean };
  }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) throw unauthorized();

    const settings =
      (await AiSettings.findOne({ user: req.user.sub })) ??
      new AiSettings({ user: req.user.sub });

    if (req.body.primaryProvider) settings.primaryProvider = req.body.primaryProvider;

    if (req.body.keys) {
      for (const [provider, key] of Object.entries(req.body.keys)) {
        settings.setKey(provider as Provider, key ?? "");
      }
    }

    if (req.body.notify) {
      settings.notify = { ...settings.notify, ...req.body.notify };
    }

    await settings.save();
    res.json({ settings: settings.toClientJSON() });
  } catch (err) {
    next(err);
  }
}

// ------------------------------------------------------------
// GET /api/ai/settings
// ------------------------------------------------------------
export async function getSettings(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) throw unauthorized();
    const settings = await AiSettings.findOne({ user: req.user.sub });
    res.json({
      settings: settings?.toClientJSON() ?? {
        primaryProvider: "groq",
        providersConfigured: [],
        notify: { weekly: true, deals: true, stress: false, critical: true },
      },
    });
  } catch (err) {
    next(err);
  }
}