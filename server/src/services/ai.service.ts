type Provider = "openai" | "groq" | "gemini" | "claude";

interface ChatParams {
  provider: Provider;
  apiKey: string;
  messages: { role: "user" | "assistant" | "system"; content: string }[];
  model?: string;
}

interface LLMApiResponse {
  content?: { text?: string }[];
  candidates?: { content?: { parts?: { text?: string }[] } }[];
  choices?: { message?: { content?: string } }[];
  error?: { message?: string };
}

const DEFAULT_MODELS: Record<Provider, string> = {
  openai: "gpt-4o-mini",
  groq: "llama-3.1-70b-versatile",
  gemini: "gemini-1.5-flash",
  claude: "claude-sonnet-4-6",
};

const ENDPOINTS: Record<Provider, string> = {
  openai: "https://api.openai.com/v1/chat/completions",
  groq: "https://api.groq.com/openai/v1/chat/completions",
  gemini: "https://generativelanguage.googleapis.com/v1beta/models",
  claude: "https://api.anthropic.com/v1/messages",
};

export async function callLLM({ provider, apiKey, messages, model }: ChatParams): Promise<string> {
  const chosenModel = model || DEFAULT_MODELS[provider];

  if (provider === "claude") {
    const res = await fetch(ENDPOINTS.claude, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: chosenModel,
        max_tokens: 1024,
        messages: messages.filter((m) => m.role !== "system"),
        system: messages.find((m) => m.role === "system")?.content,
      }),
    });
    const data = (await res.json()) as LLMApiResponse;
    if (!res.ok) throw new Error(data.error?.message || "Claude request failed");
    return data.content?.[0]?.text ?? "";
  }

  if (provider === "gemini") {
    const res = await fetch(
      `${ENDPOINTS.gemini}/${chosenModel}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contents: messages
            .filter((m) => m.role !== "system")
            .map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
        }),
      }
    );
    const data = (await res.json()) as LLMApiResponse;
    if (!res.ok) throw new Error(data.error?.message || "Gemini request failed");
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  }

  // openai and groq share the same OpenAI-compatible schema
  const res = await fetch(ENDPOINTS[provider], {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model: chosenModel, messages }),
  });
  const data = (await res.json()) as LLMApiResponse;
  if (!res.ok) throw new Error(data.error?.message || `${provider} request failed`);
  return data.choices?.[0]?.message?.content ?? "";
}