import { Response } from "express";
import Papa from "papaparse";
import Asset, { IAsset } from "../models/Asset";
import Memo from "../models/Memo";
import Setting from "../models/Setting";
import { callLLM } from "../services/ai.service";
import { AuthRequest } from "../middleware/auth.middleware";

interface AuthRequestWithFile extends AuthRequest {
  file?: Express.Multer.File;
}

async function getActiveProviderKey(userId: string) {
  const setting = await Setting.findOne({ userId, isActive: true });
  if (setting) return { provider: setting.provider, apiKey: setting.apiKey };

  if (process.env.GROQ_API_KEY) return { provider: "groq" as const, apiKey: process.env.GROQ_API_KEY };
  if (process.env.OPENAI_API_KEY) return { provider: "openai" as const, apiKey: process.env.OPENAI_API_KEY };
  throw new Error("No AI provider configured. Add an API key in Settings.");
}

// [AI Feature A] Due diligence memo generator
export const generateMemo = async (req: AuthRequest, res: Response) => {
  try {
    const { assetName, sector, tone = "formal" } = req.body as {
      assetName: string;
      sector?: string;
      tone?: "formal" | "concise" | "bullish";
    };
    const { provider, apiKey } = await getActiveProviderKey(req.userId as string);

    const prompt = `Write a ${tone} investment due-diligence memo for a startup called "${assetName}"${
      sector ? ` in the ${sector} sector` : ""
    }. Cover: overview, market opportunity, risks, and a recommendation. Keep it under 350 words.`;

    const memo = await callLLM({
      provider,
      apiKey,
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ memo });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Memo generation failed" });
  }
};

// [AI Feature C] Copilot chat with lightweight tool calling over Asset data
export const copilotChat = async (req: AuthRequest, res: Response) => {
  try {
    const { message, history = [] } = req.body as {
      message: string;
      history?: { role: "user" | "assistant" | "system"; content: string }[];
    };
    const { provider, apiKey } = await getActiveProviderKey(req.userId as string);

    const matchedAsset = await Asset.findOne({
      name: { $regex: message.split(" ").slice(0, 4).join("|"), $options: "i" },
    });

    const systemPrompt = matchedAsset
      ? `You are Vanguard Copilot, an investment assistant. Relevant asset context: ${matchedAsset.name}, sector ${matchedAsset.sector}, valuation $${matchedAsset.valuation}, ARR $${matchedAsset.arr}, AI score ${matchedAsset.aiScore}. Answer using this context when relevant.`
      : "You are Vanguard Copilot, an investment assistant for a startup asset marketplace. Be concise and specific.";

    const reply = await callLLM({
      provider,
      apiKey,
      messages: [
        { role: "system", content: systemPrompt },
        ...history,
        { role: "user", content: message },
      ],
    });

    res.json({ reply });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Copilot request failed" });
  }
};

// [AI Feature D] CSV/spreadsheet analyzer
export const analyzeData = async (req: AuthRequestWithFile, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const csvText = req.file.buffer.toString("utf-8");
    const parsed = Papa.parse<Record<string, string>>(csvText, { header: true, skipEmptyLines: true });
    const rows = parsed.data;

    if (!rows.length) return res.status(400).json({ message: "File appears to be empty" });

    const { provider, apiKey } = await getActiveProviderKey(req.userId as string);

    const sample = rows.slice(0, 25);
    const prompt = `Analyze this asset dataset (${rows.length} rows, showing first ${sample.length}): ${JSON.stringify(
      sample
    )}. Respond ONLY as JSON with shape: { "summary": string, "insights": string[], "metrics": [{ "label": string, "value": string }] }. No markdown, no preamble.`;

    const raw = await callLLM({
      provider,
      apiKey,
      messages: [{ role: "user", content: prompt }],
    });

    const clean = raw.replace(/```json|```/g, "").trim();
    const result = JSON.parse(clean);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Analysis failed" });
  }
};

// [AI Feature B] Smart portfolio recommendations
export const getRecommendations = async (req: AuthRequest, res: Response) => {
  try {
    const myAssets = await Asset.find({ ownerId: req.userId });
    const mySectors: string[] = [...new Set(myAssets.map((a: IAsset) => a.sector))];

    const candidates = await Asset.find({
      ownerId: { $ne: req.userId },
      ...(mySectors.length ? { sector: { $in: mySectors } } : {}),
    })
      .sort({ aiScore: -1 })
      .limit(10);

    const recommendations = candidates.map((asset: IAsset) => ({
      asset,
      score: asset.aiScore,
      reason: mySectors.includes(asset.sector)
        ? `Matches your existing exposure to ${asset.sector}`
        : `High AI score (${asset.aiScore}) relative to your risk profile`,
    }));

    res.json({ recommendations });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Recommendation engine failed" });
  }
};

export const saveMemo = async (req: AuthRequest, res: Response) => {
  const { assetId, tone, content } = req.body as {
    assetId: string;
    tone: "formal" | "concise" | "bullish";
    content: string;
  };
  const memo = await Memo.create({ assetId, ownerId: req.userId, tone, content });
  res.status(201).json(memo);
};