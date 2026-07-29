"use client";

import Link from "next/link";
import { ArrowUpRight, Eye, Play } from "lucide-react";

export function Hero() {
  return (
    <section className="relative">
      <div className="container-x pt-10 pb-24">
        {/* Editorial panel — mirrors the Humanity Protocol layout */}
        <div className="panel overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[85vh]">
            {/* LEFT — Copy */}
            <div className="lg:col-span-7 p-8 md:p-14 lg:p-20 flex flex-col justify-between">
              <div>
                <p className="eyebrow mb-8">
                  [ Verify anything. Fund what's real. ]
                </p>

                <h1 className="display-serif text-display-xl mb-10">
                  Introducing the<br />
                  investor's<br />
                  <span className="italic text-bone-200">trust layer</span>
                </h1>

                {/* Info chip like reference "View More" card */}
                <div className="max-w-md rounded-2xl bg-ink-800/60 border border-ink-600/50 p-5 mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <span className="tag">View More</span>
                    <Eye className="w-4 h-4 text-bone-300" />
                  </div>
                  <p className="text-sm text-bone-200 leading-relaxed">
                    From cap-tables to GitHub commits, Vanguard verifies deeptech
                    startups end-to-end — without you touching a spreadsheet.
                  </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-4">
                  <Link href="/explore" className="btn-primary">
                    Get Started <ArrowUpRight className="w-4 h-4" />
                  </Link>
                  <Link href="/docs" className="btn-link">
                    Here's How It Works →
                  </Link>
                </div>
              </div>

              {/* Bottom demo quote */}
              <div className="hidden lg:flex items-center gap-3 mt-16">
                <div className="w-10 h-10 rounded-full bg-ink-700 flex items-center justify-center">
                  <Play className="w-4 h-4 text-bone-100 ml-0.5" />
                </div>
                <div>
                  <p className="text-xs text-bone-300">
                    "A quick demo of the platform in action."
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT — Visual */}
            <div className="relative lg:col-span-5 min-h-[400px] lg:min-h-full border-t lg:border-t-0 lg:border-l border-ink-600/40 bg-gradient-to-br from-ink-900 via-ink-800 to-ink-950 overflow-hidden">
              {/* Huge ghost wordmark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
                <span className="font-display text-[14rem] leading-none tracking-tighter">
                  VNGRD
                </span>
              </div>

              {/* Central visual — abstract "AI head" via layered SVG rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-[380px] h-[380px]">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="absolute inset-0 rounded-full border border-bone-200/10"
                      style={{
                        transform: `scale(${1 - i * 0.15})`,
                        animation: `spin ${20 + i * 5}s linear infinite ${i % 2 ? 'reverse' : ''}`,
                      }}
                    />
                  ))}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-accent/40 to-accent/5 blur-2xl" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-[10px] uppercase tracking-[0.3em] text-bone-300 mb-2">
                        Agent Cluster
                      </div>
                      <div className="font-display text-5xl text-bone-50">
                        v4<span className="text-accent">.</span>2
                      </div>
                      <div className="text-xs text-bone-400 mt-2">
                        6 agents online
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vertical pagination dots — like reference "01 ... 05" */}
              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 text-[10px] font-mono text-bone-300">
                <span>01</span>
                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                <div className="w-1.5 h-1.5 rounded-full bg-ink-600" />
                <div className="w-1.5 h-1.5 rounded-full bg-ink-600" />
                <div className="w-1.5 h-1.5 rounded-full bg-ink-600" />
                <span>05</span>
              </div>

              {/* Bottom-right sys label */}
              <div className="absolute bottom-6 right-6 text-[10px] font-mono text-bone-400">
                //scroll_to_start_analysis
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg) scale(var(--s, 1)); }
          to   { transform: rotate(360deg) scale(var(--s, 1)); }
        }
      `}</style>
    </section>
  );
}