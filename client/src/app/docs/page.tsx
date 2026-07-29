"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, BookOpen, Cpu, Terminal, Zap, ShieldCheck, ArrowUpRight, ChevronRight } from "lucide-react";
import { CopilotFAB } from "@/components/CopilotFAB";

const sections = [
  {
    id: "getting-started",
    icon: Zap,
    title: "Getting Started",
    items: [
      { title: "Quickstart",           slug: "quickstart",  time: "3 min" },
      { title: "Your first memo",      slug: "first-memo",  time: "5 min" },
      { title: "Connecting a data room", slug: "data-room", time: "8 min" },
    ],
  },
  {
    id: "agents",
    icon: Cpu,
    title: "Agent Reference",
    items: [
      { title: "Agent 01 · Memo generator",      slug: "agent-01", time: "6 min" },
      { title: "Agent 02 · Matching engine",      slug: "agent-02", time: "4 min" },
      { title: "Agent 03 · Copilot",              slug: "agent-03", time: "7 min" },
      { title: "Agent 04 · Data analyzer",        slug: "agent-04", time: "5 min" },
      { title: "Agent 05 · Auto-classification",  slug: "agent-05", time: "3 min" },
      { title: "Agent 06 · Multi-LLM router",     slug: "agent-06", time: "4 min" },
    ],
  },
  {
    id: "api",
    icon: Terminal,
    title: "API Reference",
    items: [
      { title: "Authentication",       slug: "auth",        time: "3 min" },
      { title: "Assets endpoints",     slug: "assets-api",  time: "6 min" },
      { title: "AI endpoints",         slug: "ai-api",      time: "8 min" },
      { title: "Webhooks",             slug: "webhooks",    time: "4 min" },
    ],
  },
  {
    id: "compliance",
    icon: ShieldCheck,
    title: "Security & Compliance",
    items: [
      { title: "SOC 2 posture",         slug: "soc2",         time: "5 min" },
      { title: "Data retention policy", slug: "retention",    time: "3 min" },
      { title: "LLM proxying model",    slug: "llm-proxy",    time: "4 min" },
    ],
  },
];

export default function DocsPage() {
  const [q, setQ] = useState("");
  const filter = q.trim().toLowerCase();

  return (
    <div className="container-x pt-10 pb-24">
      {/* Hero */}
      <div className="panel p-12 md:p-16 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-end pr-10 opacity-[0.04] pointer-events-none select-none">
          <BookOpen className="w-96 h-96" strokeWidth={0.5} />
        </div>
        <div className="relative max-w-2xl">
          <p className="eyebrow mb-4">[ Documentation ]</p>
          <h1 className="display-serif text-display-lg mb-6">
            Everything you need to<br />
            <span className="italic text-bone-200">ship with Vanguard.</span>
          </h1>
          <div className="relative max-w-lg">
            <Search className="w-4 h-4 text-bone-300 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search docs…"
              className="field pl-11"
            />
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
        {[
          { icon: Zap,      label: "Quickstart",       href: "#getting-started" },
          { icon: Cpu,      label: "Agent SDK",        href: "#agents" },
          { icon: Terminal, label: "API reference",    href: "#api" },
          { icon: ShieldCheck, label: "Security docs", href: "#compliance" },
        ].map((q) => {
          const Icon = q.icon;
          return (
            <a key={q.label} href={q.href} className="panel p-5 flex items-center gap-3 hover:bg-ink-800 transition">
              <div className="w-10 h-10 rounded-xl bg-ink-800 border border-ink-600/60 flex items-center justify-center">
                <Icon className="w-4 h-4 text-accent" />
              </div>
              <span className="text-sm text-bone-100">{q.label}</span>
              <ChevronRight className="w-4 h-4 text-bone-400 ml-auto" />
            </a>
          );
        })}
      </div>

      {/* Sections */}
      <div className="space-y-10">
        {sections.map((section) => {
          const Icon = section.icon;
          const items = filter
            ? section.items.filter((i) => i.title.toLowerCase().includes(filter))
            : section.items;
          if (filter && items.length === 0) return null;

          return (
            <section key={section.id} id={section.id}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-ink-800 border border-ink-600/60 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-accent" />
                </div>
                <h2 className="font-display text-3xl text-bone-50">{section.title}</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                {items.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/docs#${item.slug}`}
                    className="panel p-5 flex items-center justify-between hover:bg-ink-800 transition group"
                  >
                    <div>
                      <div className="text-sm font-medium text-bone-50 group-hover:text-accent transition mb-0.5">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-bone-400 font-mono">{item.time} read</div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-bone-300 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {filter && sections.every((s) => !s.items.some((i) => i.title.toLowerCase().includes(filter))) && (
        <div className="panel p-16 text-center mt-10">
          <p className="font-display text-2xl text-bone-50 mb-2">Nothing matched "{q}"</p>
          <p className="text-bone-300 mb-6">Ask the Copilot — it's trained on the full documentation.</p>
        </div>
      )}

      <CopilotFAB />
    </div>
  );
}