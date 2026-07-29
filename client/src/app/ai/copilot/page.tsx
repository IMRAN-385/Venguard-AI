"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Plus, MessageSquare, Loader2, Cpu } from "lucide-react";
import { api } from "@/services/api";
import { ChatMessage, type Message } from "@/components/ChatMessage";

interface Thread {
  id: string;
  title: string;
  updatedAt: number;
}

const models = [
  { id: "groq-llama-3.3", label: "Groq · Llama 3.3 70B" },
  { id: "openai-gpt-4o", label: "OpenAI · GPT-4o" },
  { id: "claude-sonnet", label: "Claude 3.5 Sonnet" },
  { id: "gemini-2-pro", label: "Gemini 2.0 Pro" },
  { id: "simulation", label: "Vanguard Simulation" },
];

const starterThreads: Thread[] = [
  { id: "t1", title: "Quantum sector Q3 recap",       updatedAt: Date.now() - 60_000 },
  { id: "t2", title: "AtomFusion stress-test",         updatedAt: Date.now() - 3_600_000 },
  { id: "t3", title: "Patent expiry sweep · 2028",     updatedAt: Date.now() - 86_400_000 },
];

export default function CopilotPage() {
  const [threads, setThreads] = useState<Thread[]>(starterThreads);
  const [activeId, setActiveId] = useState<string>("new");
  const [model, setModel] = useState(models[0].id);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    const content = input.trim();
    if (!content || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    // Auto-create thread if new
    if (activeId === "new") {
      const newThread: Thread = {
        id: "t" + Date.now(),
        title: content.slice(0, 40),
        updatedAt: Date.now(),
      };
      setThreads((t) => [newThread, ...t]);
      setActiveId(newThread.id);
    }

    try {
      const { data } = await api.post("/ai/copilot", { message: content, model, history: messages });
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
          content: `Simulated reply (${model}):\n\nBased on the last 90 days of deal-flow, 3 startups match your query. I'd recommend prioritizing Helion Fusion (verification rate 94%) followed by AtomFusion (89%). Want me to draft comparative memos?`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function newChat() {
    setActiveId("new");
    setMessages([]);
    setInput("");
  }

  return (
    <div className="container-x pt-10 pb-24">
      <div className="grid lg:grid-cols-12 gap-5 min-h-[85vh]">
        {/* Sidebar */}
        <aside className="lg:col-span-3 panel p-4 flex flex-col">
          <button onClick={newChat} className="btn-accent w-full justify-center mb-6">
            <Plus className="w-4 h-4" /> New chat
          </button>

          <p className="eyebrow mb-3 px-2">Recent</p>
          <div className="flex-1 overflow-y-auto space-y-1">
            {threads.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setActiveId(t.id);
                  setMessages([
                    {
                      id: "restored",
                      role: "assistant",
                      content: `[Restored thread: ${t.title}] — Ask me to continue where we left off.`,
                    },
                  ]);
                }}
                className={`w-full flex items-start gap-2 px-3 py-2.5 rounded-xl text-left text-sm transition ${
                  activeId === t.id
                    ? "bg-ink-800 text-bone-50"
                    : "text-bone-200 hover:bg-ink-800/60"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-bone-400" />
                <span className="truncate">{t.title}</span>
              </button>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-ink-600/40 space-y-2">
            <p className="eyebrow px-2">Model</p>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="field text-sm"
            >
              {models.map((m) => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
            <p className="text-[10px] font-mono text-bone-400 px-2 flex items-center gap-1.5">
              <Cpu className="w-3 h-3" /> Provider routing active
            </p>
          </div>
        </aside>

        {/* Chat area */}
        <section className="lg:col-span-9 panel flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-ink-600/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-ink-950" />
              </div>
              <div>
                <h1 className="font-display text-2xl text-bone-50">Vanguard Copilot</h1>
                <p className="text-xs text-bone-300 font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  {models.find((m) => m.id === model)?.label}
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-8 py-8 space-y-6">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-8">
                <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center mb-6">
                  <Sparkles className="w-7 h-7 text-accent" />
                </div>
                <h2 className="font-display text-3xl text-bone-50 mb-3">
                  What are we verifying today?
                </h2>
                <p className="text-bone-300 max-w-md mb-8">
                  I can search 3,200+ verified startups, run stress-tests, generate memos, and cross-reference patents. Start with a question.
                </p>
                <div className="grid sm:grid-cols-2 gap-3 max-w-2xl w-full">
                  {[
                    "Top 5 fusion startups by verification score",
                    "Draft a memo for Neuralink Cortex Labs",
                    "Compare Q3 burn: Quantum Bio vs Boreal Robotics",
                    "Which of my portfolio has patent risk?",
                  ].map((s) => (
                    <button
                      key={s}
                      onClick={() => setInput(s)}
                      className="text-left text-sm text-bone-200 px-4 py-3 rounded-xl border border-ink-600/40 hover:bg-ink-800 hover:border-accent/40 hover:text-bone-50 transition"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m) => <ChatMessage key={m.id} message={m} />)
            )}

            {loading && (
              <div className="flex items-center gap-2 text-sm text-bone-300">
                <Loader2 className="w-4 h-4 animate-spin text-accent" />
                <span className="font-mono text-xs">Copilot is thinking…</span>
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="border-t border-ink-600/40 p-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex items-end gap-3"
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
                rows={1}
                placeholder="Ask about any startup, sector, or portfolio holding…"
                className="field resize-none max-h-40 text-base"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="btn-accent disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" /> Send
              </button>
            </form>
            <p className="text-[10px] font-mono text-bone-400 text-center mt-3">
              Enter to send · Shift+Enter for new line · Every claim is source-cited
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}