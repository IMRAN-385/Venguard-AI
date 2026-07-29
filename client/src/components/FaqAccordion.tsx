"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "Which LLM providers does Vanguard support?",
    a: "Groq (Llama 3.3 70B, Mixtral), OpenAI (GPT-4o, GPT-4.1), Anthropic Claude 3.5 Sonnet, Google Gemini 2.0 Pro, Together AI, Ollama for local inference, and HuggingFace inference endpoints. Rotate keys or providers from Settings — no redeploy required.",
  },
  {
    q: "Where does the diligence data come from?",
    a: "We ingest public sources — USPTO patent filings, GitHub repository telemetry, Crunchbase/Pitchbook APIs, SEC EDGAR, and voluntarily uploaded cap-tables. All ingestion is auditable and every claim in a generated memo is source-linked.",
  },
  {
    q: "Is Vanguard a fund or a platform?",
    a: "Platform only. We do not manage capital, receive carry, or take positions in the startups on our network. We charge institutional SaaS fees to allocators, family offices, and syndicates who use the agentic tooling.",
  },
  {
    q: "How is generated content different from ChatGPT?",
    a: "Vanguard is agentic, not chat-only. Each agent has a scoped toolchain (patent search, cap-table parser, burn-rate calculator, benchmarking engine). Outputs are structured, source-cited, and reproducible — not free-form prose.",
  },
  {
    q: "Can I bring my own data room?",
    a: "Yes. Upload PDFs, CSV balance sheets, XLSX cap-tables, or connect a Notion/Google Drive folder. The Analyzer will schema-detect and parse into structured KPIs automatically.",
  },
  {
    q: "What is the pricing model?",
    a: "Three tiers: Analyst ($199/mo), Firm ($1,499/mo, 10 seats), Institutional (custom, unlimited seats + private VPC deployment). See /pricing for full breakdown.",
  },
];

export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="section">
      <div className="container-x">
        <div className="grid lg:grid-cols-12 gap-10">
          {/* Left: heading */}
          <div className="lg:col-span-4">
            <p className="eyebrow mb-4">[ Frequently asked ]</p>
            <h2 className="display-serif text-display-lg mb-6">
              Questions,<br />
              <span className="italic text-bone-200">answered.</span>
            </h2>
            <p className="text-bone-300 text-sm leading-relaxed max-w-sm">
              Still curious? Ping the Copilot in the bottom-right corner — it's trained on our full documentation.
            </p>
          </div>

          {/* Right: accordion */}
          <div className="lg:col-span-8">
            <div className="panel divide-y divide-ink-600/40">
              {faqs.map((f, i) => {
                const isOpen = open === i;
                return (
                  <div key={i} className="px-8">
                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="w-full py-6 flex items-center justify-between gap-6 text-left group"
                    >
                      <span className="font-display text-xl text-bone-50 group-hover:text-accent transition-colors">
                        {f.q}
                      </span>
                      <span className="flex-shrink-0 w-9 h-9 rounded-full border border-ink-600/60 flex items-center justify-center text-bone-100 group-hover:border-accent group-hover:text-accent transition-colors">
                        {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="pb-6 pr-14 -mt-2">
                        <p className="text-bone-200 leading-relaxed">{f.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}