"use client";

import { useState } from "react";
import {
  Search,
  BookOpen,
  Key,
  LineChart,
  Sparkles,
  Webhook,
  ChevronRight,
} from "lucide-react";

interface DocSection {
  id: string;
  title: string;
  icon: React.ElementType;
  items: { title: string; content: string }[];
}

const sections: DocSection[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: BookOpen,
    items: [
      {
        title: "Creating an account",
        content:
          "Register with your email and set up your workspace. Once verified, you land on the Explore page with live asset data already loaded.",
      },
      {
        title: "Adding your first asset",
        content:
          "Go to Items → Add, fill in the asset name, sector, and valuation details. Assets appear in Manage instantly and are searchable across the platform.",
      },
    ],
  },
  {
    id: "authentication",
    title: "Authentication",
    icon: Key,
    items: [
      {
        title: "API keys",
        content:
          "Generate a key from Settings → API. Keys are scoped to your workspace and can be rotated at any time without affecting active sessions.",
      },
      {
        title: "Session handling",
        content:
          "Vanguard uses short-lived JWTs with silent refresh. Tokens are stored in httpOnly cookies, so no client-side token handling is needed.",
      },
    ],
  },
  {
    id: "portfolio",
    title: "Portfolio & Recommendations",
    icon: LineChart,
    items: [
      {
        title: "Smart recommendations",
        content:
          "The Portfolio page ranks assets against your holdings using sector correlation and volatility scoring, refreshed every trading session.",
      },
      {
        title: "Filtering and sorting",
        content:
          "Explore supports filtering by sector, price range, and risk tier, plus sorting by performance, name, or date added.",
      },
    ],
  },
  {
    id: "ai-tools",
    title: "AI Tools",
    icon: Sparkles,
    items: [
      {
        title: "Copilot",
        content:
          "Ask Copilot natural-language questions about any asset or sector. It answers using live market context, not static training data.",
      },
      {
        title: "Memo Generator",
        content:
          "Generate structured investment memos for any asset by choosing a tone — formal, concise, or bullish — and letting the model draft it.",
      },
      {
        title: "Data Analyzer",
        content:
          "Upload a CSV or spreadsheet of asset data to get a plain-English summary, key metrics, and notable insights.",
      },
    ],
  },
  {
    id: "webhooks",
    title: "Webhooks",
    icon: Webhook,
    items: [
      {
        title: "Setting up a webhook",
        content:
          "Register an endpoint under Settings → Webhooks to receive events for asset updates, portfolio changes, and price alerts.",
      },
      {
        title: "Event payloads",
        content:
          "Every payload includes an event type, timestamp, and signed signature header so you can verify the request came from Vanguard.",
      },
    ],
  },
];

export default function DocsPage() {
  const [query, setQuery] = useState("");
  const [activeSection, setActiveSection] = useState(sections[0].id);

  const filteredSections = sections
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.content.toLowerCase().includes(query.toLowerCase())
      ),
    }))
    .filter((section) => section.items.length > 0 || query === "");

  return (
    <div className="min-h-screen bg-[#080612] text-white">
      <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-[240px_1fr] gap-16">
        {/* Sidebar */}
        <aside className="md:sticky md:top-16 h-fit">
          <div className="relative mb-8">
            <Search className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search docs..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.07] transition-colors"
            />
          </div>

          <nav className="space-y-1">
            {sections.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveSection(s.id);
                    setQuery("");
                    document
                      .getElementById(s.id)
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-left transition-colors ${
                    activeSection === s.id
                      ? "bg-violet-600/15 text-white border border-violet-500/30"
                      : "text-white/45 hover:text-white/80 hover:bg-white/[0.04] border border-transparent"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {s.title}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <main className="space-y-20">
          <div>
            <p className="text-violet-400 text-xs font-semibold tracking-[0.15em] uppercase mb-4">
              Documentation
            </p>
            <h1 className="text-4xl font-semibold mb-4 tracking-tight">
              Build with Vanguard.
            </h1>
            <p className="text-white/50 leading-relaxed max-w-xl">
              Everything you need to integrate assets, AI tools, and portfolio data
              into your own workflow.
            </p>
          </div>

          {filteredSections.length === 0 && (
            <p className="text-white/40 text-sm">No results for &quot;{query}&quot;.</p>
          )}

          {filteredSections.map((section) => {
            const Icon = section.icon;
            return (
              <section key={section.id} id={section.id} className="scroll-mt-20">
                <div className="flex items-center gap-2.5 mb-6 pb-3 border-b border-white/10">
                  <Icon className="w-4 h-4 text-violet-400" />
                  <h2 className="text-lg font-semibold tracking-tight">
                    {section.title}
                  </h2>
                </div>

                <div className="space-y-2.5">
                  {section.items.map((item) => (
                    <details
                      key={item.title}
                      className="group bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 transition-colors hover:border-white/20 hover:bg-white/[0.05] open:bg-white/[0.05] open:border-violet-500/20"
                    >
                      <summary className="flex items-center justify-between cursor-pointer list-none text-sm font-medium marker:content-none">
                        <span>{item.title}</span>
                        <ChevronRight className="w-4 h-4 text-white/30 shrink-0 ml-4 group-open:rotate-90 group-open:text-violet-400 transition-transform" />
                      </summary>
                      <p className="text-sm text-white/55 leading-relaxed mt-3 pt-3 border-t border-white/[0.06]">
                        {item.content}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            );
          })}
        </main>
      </div>
    </div>
  );
}