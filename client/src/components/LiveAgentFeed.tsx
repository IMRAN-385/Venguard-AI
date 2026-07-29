"use client";

import { useEffect, useState } from "react";
import { Activity, CheckCircle2, Loader2 } from "lucide-react";

interface AgentEvent {
  id: number;
  agent: string;
  action: string;
  target: string;
  status: "running" | "done";
  time: string;
}

const seedEvents: AgentEvent[] = [
  { id: 1, agent: "Agent 01", action: "Generating memo for", target: "Neuralink Cortex Labs", status: "running", time: "just now" },
  { id: 2, agent: "Agent 04", action: "Analyzing burn rate for", target: "Quantum Bio Systems", status: "done", time: "12s ago" },
  { id: 3, agent: "Agent 02", action: "Matched investor thesis to", target: "AtomFusion Reactors", status: "done", time: "34s ago" },
  { id: 4, agent: "Agent 05", action: "Tagged 47 patents from", target: "USPTO batch #A-2210", status: "done", time: "1m ago" },
  { id: 5, agent: "Agent 03", action: "Answered Copilot query about", target: "SaaS ARR benchmarks", status: "done", time: "2m ago" },
  { id: 6, agent: "Agent 06", action: "Rotated LLM provider to", target: "Groq (Llama 3.3 70B)", status: "done", time: "3m ago" },
];

export function LiveAgentFeed() {
  const [events, setEvents] = useState(seedEvents);

  useEffect(() => {
    const interval = setInterval(() => {
      const agents = ["Agent 01", "Agent 02", "Agent 03", "Agent 04", "Agent 05", "Agent 06"];
      const actions = [
        { a: "Verified cap-table for", t: "Helion Fusion Corp" },
        { a: "Ingested GitHub commits from", t: "openfold/protein-pred" },
        { a: "Stress-tested portfolio against", t: "2030 climate scenario" },
        { a: "Classified pitch deck of", t: "Boreal Robotics Inc" },
      ];
      const pick = actions[Math.floor(Math.random() * actions.length)];
      const agent = agents[Math.floor(Math.random() * agents.length)];
      const newEvent: AgentEvent = {
        id: Date.now(),
        agent,
        action: pick.a,
        target: pick.t,
        status: "running",
        time: "just now",
      };
      setEvents((prev) => [newEvent, ...prev.slice(0, 5)]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="section">
      <div className="container-x">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Left column: heading */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <p className="eyebrow mb-4">[ Live telemetry ]</p>
            <h2 className="display-serif text-display-lg mb-6">
              Agents at work,<br />
              <span className="italic text-bone-200">right now.</span>
            </h2>
            <p className="text-bone-300 leading-relaxed max-w-md">
              Every deal-flow event is streamed from the Vanguard agent mesh — no polling, no batch jobs. This is a live window into what the platform is verifying globally.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
              </span>
              <span className="text-xs font-mono uppercase tracking-widest text-bone-200">
                6 agents · streaming
              </span>
            </div>
          </div>

          {/* Right column: terminal */}
          <div className="lg:col-span-7">
            <div className="panel overflow-hidden">
              {/* Terminal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-ink-600/40 bg-ink-950/40">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-ink-600" />
                  <div className="w-3 h-3 rounded-full bg-ink-600" />
                  <div className="w-3 h-3 rounded-full bg-accent" />
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-bone-300">
                  <Activity className="w-3.5 h-3.5" />
                  vanguard://agents/stream
                </div>
                <span className="text-[10px] font-mono text-bone-400">v4.2</span>
              </div>

              {/* Feed */}
              <div className="p-6 space-y-3 font-mono text-sm min-h-[400px]">
                {events.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-start gap-3 py-2 border-b border-ink-600/20 last:border-0 animate-in fade-in slide-in-from-top-2 duration-500"
                  >
                    <span className="text-bone-400 text-xs mt-1 w-20 flex-shrink-0">
                      {e.time}
                    </span>
                    <span className="tag text-[10px] px-2 py-0.5 flex-shrink-0">
                      {e.agent}
                    </span>
                    <span className="text-bone-200 flex-1">
                      {e.action} <span className="text-accent">{e.target}</span>
                    </span>
                    {e.status === "running" ? (
                      <Loader2 className="w-3.5 h-3.5 text-accent animate-spin flex-shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-bone-300 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}