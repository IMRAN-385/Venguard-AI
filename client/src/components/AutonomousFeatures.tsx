import Link from "next/link";
import {
  FileText,
  Sparkles,
  Bot,
  BarChart3,
  Layers,
  Cpu,
  ArrowUpRight,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "AI Due Diligence Generator",
    desc: "Formal institutional investment memos, risk reports, and executive summaries in seconds. Adjustable length & VC tone.",
    href: "/ai/generator",
    tag: "Agent 01",
  },
  {
    icon: Sparkles,
    title: "Smart Matching Engine",
    desc: "Matches your personal check size, risk profile, and preferred deeptech sectors against verified cap-tables with exact-match reasoning.",
    href: "/explore",
    tag: "Agent 02",
  },
  {
    icon: Bot,
    title: "Vanguard Copilot",
    desc: "Conversational agent capable of searching assets, calculating 5-year ROI projections, and executing macroeconomic stress tests.",
    href: "/ai/copilot",
    tag: "Agent 03",
  },
  {
    icon: BarChart3,
    title: "Financial & CSV Analyzer",
    desc: "Upload CSV or JSON balance sheets or SaaS burn reports for instant KPI cards, Recharts burn trajectories, and anomaly alerts.",
    href: "/ai/analyzer",
    tag: "Agent 04",
  },
  {
    icon: Layers,
    title: "Auto Classification & Tagging",
    desc: "Automatically organizes startup pitch descriptions into structured tags (#DeepTech, #Patent-Protected) with bulk classification support.",
    href: "/items/manage",
    tag: "Agent 05",
  },
  {
    icon: Cpu,
    title: "Multi-LLM Live API Support",
    desc: "Connect your own API keys for Groq, OpenAI, Gemini, or Claude in settings, or use the zero-config Vanguard Simulation Engine.",
    href: "/settings",
    tag: "Agent 06",
  },
];

export function AutonomousFeatures() {
  return (
    <section className="section">
      <div className="container-x">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <p className="eyebrow mb-4">[ Agentic AI Suite ]</p>
            <h2 className="display-serif text-display-lg max-w-3xl">
              Six built-in<br />
              <span className="italic text-bone-200">autonomous features</span>
            </h2>
          </div>
          <p className="text-bone-300 text-sm max-w-sm">
            Beyond basic text generation — context-aware recommendation, tool execution, and multi-provider LLM support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <Link
                key={f.title}
                href={f.href}
                className="group relative panel p-8 flex flex-col justify-between min-h-[280px] hover:bg-ink-800 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Top: icon + tag */}
                <div className="flex items-start justify-between mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-ink-800 border border-ink-600/60 flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all">
                    <Icon className="w-5 h-5 text-bone-100 group-hover:text-ink-950" />
                  </div>
                  <span className="text-[10px] font-mono text-bone-400 uppercase tracking-widest">
                    {f.tag}
                  </span>
                </div>

                {/* Middle: title + desc */}
                <div>
                  <h3 className="font-display text-2xl text-bone-50 mb-3 leading-tight">
                    {f.title}
                  </h3>
                  <p className="text-sm text-bone-300 leading-relaxed">{f.desc}</p>
                </div>

                {/* Bottom: CTA */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-ink-600/40">
                  <span className="text-sm text-bone-100 group-hover:text-accent transition-colors">
                    Try feature
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-bone-300 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>

                {/* Index number background */}
                <span className="absolute top-6 right-6 font-display text-6xl text-ink-700/50 pointer-events-none select-none">
                  0{i + 1}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}