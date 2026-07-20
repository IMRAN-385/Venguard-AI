"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, TrendingUp, CheckCircle2, Layers } from 'lucide-react';

export const Hero: React.FC<{ onOpenCopilot?: () => void }> = ({ onOpenCopilot }) => {
  const [interactiveValuation, setInteractiveValuation] = useState<number>(25);
  const [activeSimTab, setActiveSimTab] = useState<'roi' | 'risk'>('roi');

  // Computed live simulation values
  const ownershipEstimate = ((1.5 / interactiveValuation) * 100).toFixed(2);
  const projectedMultiple = interactiveValuation < 30 ? 11.4 : 7.8;
  const projectedExit = (interactiveValuation * projectedMultiple).toFixed(1);

  return (
    <section className="relative w-full min-h-[65vh] max-h-[78vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-navy-950 via-navy-900/90 to-navy-950 border-b border-navy-800 py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Background Animated Glow & Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-primary/20 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-secondary/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        
        {/* Left Col: Hero Messaging & CTAs */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          
          {/* Autonomous Banner */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-navy-800/90 border border-primary/40 shadow-[0_0_15px_rgba(59,130,246,0.15)] text-xs font-semibold text-slate-200">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
            </span>
            <span className="text-primary-light font-bold">VANGUARD COPLOT v4.2</span>
            <span className="text-slate-400">|</span>
            <span>Autonomous DeepTech & Patent Verification Live</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Autonomous Due Diligence for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light via-primary to-secondary">High-Conviction AI & DeepTech</span> Startups
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
            Eliminate weeks of manual spreadsheet audits. Vanguard AI continuously ingests live cap-tables, github repositories, patent filings, and burn metrics to generate institutional due diligence memorandums in seconds.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
            <Link
              href="/explore"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-bold text-sm shadow-[0_0_25px_rgba(59,130,246,0.35)] transition-all transform hover:-translate-y-0.5"
            >
              <span>Explore Verified Startups</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {onOpenCopilot ? (
              <button
                onClick={onOpenCopilot}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-navy-800/80 hover:bg-navy-700/90 border border-navy-700 text-slate-200 font-semibold text-sm transition-all shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-secondary" />
                <span>Chat with Vanguard Copilot</span>
              </button>
            ) : (
              <Link
                href="/ai/generator"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-navy-800/80 hover:bg-navy-700/90 border border-navy-700 text-slate-200 font-semibold text-sm transition-all"
              >
                <Sparkles className="w-4 h-4 text-secondary" />
                <span>Run Autonomous Memo</span>
              </Link>
            )}
          </div>

          {/* Mini Trust Badges */}
          <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 font-medium border-t border-navy-800/60">
            <div className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-secondary" />
              <span>$1.8B+ Assessed Capital</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-secondary" />
              <span>SOC2 & USPTO Patent Validated</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-secondary" />
              <span>Multi-LLM Tool Calling</span>
            </div>
          </div>

        </div>

        {/* Right Col: Interactive Valuation & ROI Simulation Card */}
        <div className="lg:col-span-5 w-full">
          <div className="glass-panel rounded-2xl p-6 border border-primary/30 shadow-[0_10px_40px_rgba(0,0,0,0.6)] relative overflow-hidden">
            
            {/* Card Header & Tabs */}
            <div className="flex items-center justify-between pb-4 border-b border-navy-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Interactive Institutional Simulator</span>
                  <span className="text-[10px] text-slate-400">Live Syndicate Allocation Model</span>
                </div>
              </div>
              <div className="flex gap-1 bg-navy-950 p-1 rounded-lg border border-navy-800 text-[11px] font-semibold">
                <button
                  onClick={() => setActiveSimTab('roi')}
                  className={`px-2.5 py-1 rounded transition-colors ${activeSimTab === 'roi' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  ROI Multiple
                </button>
                <button
                  onClick={() => setActiveSimTab('risk')}
                  className={`px-2.5 py-1 rounded transition-colors ${activeSimTab === 'risk' ? 'bg-accent text-navy-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  Stress Test
                </button>
              </div>
            </div>

            {/* Simulation Content */}
            {activeSimTab === 'roi' ? (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                    <span>Target Pre-Money Valuation:</span>
                    <span className="text-primary-light font-bold text-sm">${interactiveValuation}M USD</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="120"
                    step="5"
                    value={interactiveValuation}
                    onChange={(e) => setInteractiveValuation(Number(e.target.value))}
                    className="w-full h-2 bg-navy-950 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>$10M (Seed)</span>
                    <span>$60M (Series A)</span>
                    <span>$120M (Growth)</span>
                  </div>
                </div>

                {/* Simulation Output Metrics */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-navy-950/80 p-3 rounded-xl border border-navy-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">$1.5M Syndicate Stake</span>
                    <span className="text-lg font-extrabold text-white mt-0.5 block">{ownershipEstimate}% Equity</span>
                    <span className="text-[10px] text-secondary font-medium">Optimal Governance Rights</span>
                  </div>
                  <div className="bg-navy-950/80 p-3 rounded-xl border border-navy-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Projected Exit Multiple</span>
                    <span className="text-lg font-extrabold text-secondary mt-0.5 block">{projectedMultiple}x Multiple</span>
                    <span className="text-[10px] text-slate-400">${projectedExit}M Implied Exit</span>
                  </div>
                </div>

                <div className="bg-primary/10 border border-primary/30 rounded-xl p-3 text-xs text-slate-300 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-primary-light block">Autonomous Verdict: High Conviction</span>
                    <span className="text-[11px] text-slate-400">Unit economics align with Tier-1 deeptech hurdles.</span>
                  </div>
                  <Link
                    href="/ai/generator"
                    className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold text-xs shadow-sm transition-all shrink-0"
                  >
                    Run Memo
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-navy-950/90 p-3.5 rounded-xl border border-accent/40 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-accent-light flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      Macroeconomic Stress Simulation
                    </span>
                    <span className="bg-accent/20 text-accent font-extrabold px-2 py-0.5 rounded text-[10px]">92.4% Survival</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Under a simulated +25% cloud infrastructure cost inflation scenario, this target asset maintains over 16 months of runway with positive cash-flow buffer.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-navy-950 p-2.5 rounded-xl border border-navy-800 text-center">
                    <span className="text-[10px] text-slate-400 block">Patent Defense Score</span>
                    <span className="text-sm font-bold text-white">96 / 100 (Fortified)</span>
                  </div>
                  <div className="bg-navy-950 p-2.5 rounded-xl border border-navy-800 text-center">
                    <span className="text-[10px] text-slate-400 block">Cap-Table Cleanliness</span>
                    <span className="text-sm font-bold text-secondary">Verified Clean</span>
                  </div>
                </div>
              </div>
            )}

            {/* Visual flow indicator */}
            <div className="pt-3 text-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-semibold animate-pulse">
                Scroll Down For Live Autonomous Feed & Verified Assets ↓
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};