import Link from "next/link";
import { ArrowUpRight, Target, Radar, Layers, Users } from "lucide-react";
import { CopilotFAB } from "@/components/CopilotFAB";

const principles = [
  {
    icon: Radar,
    title: "Verify, don't trust",
    body: "Every claim in a Vanguard memo is source-linked to raw data — patent filings, GitHub commits, SEC filings. No LLM hallucination survives our agent mesh.",
  },
  {
    icon: Layers,
    title: "Composable intelligence",
    body: "Six agents, one contract. Swap LLM providers, plug in your own data rooms, deploy to a private VPC. Vanguard is infrastructure, not a walled garden.",
  },
  {
    icon: Target,
    title: "Institutional discipline",
    body: "We serve allocators moving billions. That means SOC 2, zero-retention proxying, and audit trails on every agent decision — not consumer-grade chatbots.",
  },
  {
    icon: Users,
    title: "Aligned with allocators",
    body: "We charge SaaS fees. We do not manage capital, take carry, or hold positions in listed startups. Zero conflict, zero incentive to bias signal.",
  },
];

const timeline = [
  { year: "2024", label: "Founded",              detail: "Seed round led by Kairos Deep Capital"                },
  { year: "2025", label: "Series A",             detail: "$18M · Meridian, Nordwind, angel syndicate"          },
  { year: "2025", label: "Agent mesh v4",        detail: "Six-agent architecture goes live · Groq integration"  },
  { year: "2026", label: "Institutional launch", detail: "89 LPs onboarded · 3,200+ verified startups"           },
];

const team = [
  { name: "Dr. Anaya Rahman",   role: "Co-founder, CEO",  bg: "ex-DeepMind · Cambridge PhD" },
  { name: "Marcus Voss",         role: "Co-founder, CTO",  bg: "ex-Palantir · MIT" },
  { name: "Priya Sundaresan",    role: "Head of Research", bg: "ex-Two Sigma · Wharton" },
  { name: "Jakob Lindqvist",     role: "Head of Product",  bg: "ex-Stripe · KTH" },
];

export default function AboutPage() {
  return (
    <div className="container-x pt-10 pb-24">
      {/* Hero */}
      <div className="panel overflow-hidden mb-6">
        <div className="p-12 md:p-20 relative">
          <div className="absolute inset-0 flex items-center justify-end pr-10 opacity-[0.04] pointer-events-none select-none">
            <span className="font-display text-[18rem] leading-none tracking-tighter">V</span>
          </div>
          <div className="relative max-w-3xl">
            <p className="eyebrow mb-6">[ About Vanguard ]</p>
            <h1 className="display-serif text-display-xl mb-8">
              We build the<br />
              <span className="italic text-bone-200">trust layer</span><br />
              for frontier capital.
            </h1>
            <p className="text-lg text-bone-200 leading-relaxed max-w-2xl">
              Vanguard AI is an agentic due-diligence platform built for institutional allocators deploying capital into deeptech. We turn 3-week diligence cycles into 4-minute agent workflows — without sacrificing rigor.
            </p>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {[
          { v: "3,204",   l: "Startups verified" },
          { v: "$18B+",   l: "Diligence coverage" },
          { v: "89",      l: "Institutional LPs" },
          { v: "4.2min",  l: "Avg. diligence time" },
        ].map((s) => (
          <div key={s.l} className="panel p-6 text-center">
            <div className="font-display text-4xl text-bone-50 mb-1">{s.v}</div>
            <div className="text-xs text-bone-300 uppercase tracking-widest">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Principles */}
      <section className="mb-20">
        <div className="mb-10">
          <p className="eyebrow mb-3">[ Operating principles ]</p>
          <h2 className="display-serif text-display-lg max-w-2xl">
            How we think<br />
            <span className="italic text-bone-200">about signal.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {principles.map((p, i) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="panel p-8 relative overflow-hidden">
                <span className="absolute top-6 right-6 font-display text-6xl text-ink-700/60 select-none pointer-events-none">
                  0{i + 1}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-ink-800 border border-ink-600/60 flex items-center justify-center mb-6">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-display text-2xl text-bone-50 mb-3">{p.title}</h3>
                <p className="text-bone-300 leading-relaxed">{p.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Timeline */}
      <section className="mb-20">
        <div className="mb-10">
          <p className="eyebrow mb-3">[ Trajectory ]</p>
          <h2 className="display-serif text-display-lg">Milestones.</h2>
        </div>
        <div className="panel p-8 md:p-12">
          <div className="space-y-8">
            {timeline.map((t, i) => (
              <div key={i} className="flex items-start gap-6 pb-8 border-b border-ink-600/40 last:border-0 last:pb-0">
                <div className="font-display text-4xl text-accent flex-shrink-0 w-24">{t.year}</div>
                <div className="flex-1 pt-2">
                  <h3 className="font-display text-xl text-bone-50 mb-1">{t.label}</h3>
                  <p className="text-sm text-bone-300">{t.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="mb-16">
        <div className="mb-10">
          <p className="eyebrow mb-3">[ Founding team ]</p>
          <h2 className="display-serif text-display-lg">Operators, not tourists.</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {team.map((m) => (
            <div key={m.name} className="panel p-6">
              <div className="w-14 h-14 rounded-full bg-ink-800 border border-ink-600/60 flex items-center justify-center mb-4 font-display text-lg text-bone-100">
                {m.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
              <h3 className="font-display text-lg text-bone-50 mb-1">{m.name}</h3>
              <p className="text-xs text-accent font-mono uppercase tracking-widest mb-2">{m.role}</p>
              <p className="text-xs text-bone-300 leading-relaxed">{m.bg}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="panel p-12 md:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="display-serif text-display-md mb-2">
            Ready to see the agents?
          </h2>
          <p className="text-bone-300">Book a walkthrough or spin up the demo cockpit.</p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <Link href="/contact" className="btn-ghost">Book a call</Link>
          <Link href="/register" className="btn-accent">
            Try the demo <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <CopilotFAB />
    </div>
  );
}