"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { api } from "@/services/api";
import { ChatMessage, type Message } from "./ChatMessage";

const suggestions = [
  "Summarize the top 3 fusion startups on the platform",
  "Compare burn rate of Quantum Bio vs Neuralink Cortex",
  "Which patents in my portfolio expire before 2028?",
  "Generate a 5-year ROI stress-test for AtomFusion",
];

export function CopilotDrawer() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "I'm Vanguard Copilot — your agentic diligence partner. Ask me about any startup in the network, run stress-tests, or generate memos. I have full access to the verified deal-flow.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await api.post("/ai/copilot", { message: content, history: messages });
      setMessages((m) => [
        ...m,
        { id: Date.now().toString() + "-a", role: "assistant", content: data.reply ?? data.response ?? "…" },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: Date.now().toString() + "-a",
          role: "assistant",
          content:
            "Backend offline. Simulated response: Based on the last 90 days of ingested data, the Quantum sector is showing 38 verified deals with 82% verification rate. Would you like me to pull the top 3?",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} />
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-sm text-bone-300">
            <Loader2 className="w-4 h-4 animate-spin text-accent" />
            <span className="font-mono text-xs">Copilot is thinking…</span>
          </div>
        )}
      </div>

      {/* Suggestions (only when 1 message) */}
      {messages.length === 1 && (
        <div className="px-6 pb-3 space-y-2">
          <p className="text-[10px] font-mono uppercase tracking-widest text-bone-400 mb-2">
            Try asking
          </p>
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="w-full text-left text-sm text-bone-200 px-4 py-2.5 rounded-xl border border-ink-600/40 hover:bg-ink-800 hover:border-accent/40 hover:text-bone-50 transition"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Composer */}
      <div className="border-t border-ink-600/40 p-4 bg-ink-950/40">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex items-end gap-2"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Ask the agent…"
            rows={1}
            className="field resize-none max-h-32 text-sm"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="btn-accent flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Send"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] font-mono text-bone-400 text-center mt-2">
          Vanguard Copilot v4.2 · powered by multi-LLM mesh
        </p>
      </div>
    </>
  );
}