"use client";

import React from 'react';
import { Shield, Award, MapPin, Globe, Cpu, Users, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen bg-navy-950 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs font-semibold text-primary-light">
            <Globe className="w-3.5 h-3.5" />
            <span>Autonomous Intelligence Platform</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">About Vanguard AI Syndicates</h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">Founded across our primary R&D hub in Chattogram, Bangladesh and global offices in Zurich and San Francisco, Vanguard AI builds autonomous deeptech due diligence infrastructure for institutional venture capital.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <div className="glass-panel rounded-3xl p-8 border border-navy-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary"><Shield className="w-6 h-6" /></div>
              <h3 className="text-xl font-extrabold text-white">The Problem We Solve</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">Modern venture capital syndicates spend an average of 42 hours manually auditing startup spreadsheets, cap tables, and USPTO patent registries before issuing a Series A term sheet. Human error during technical due diligence leads to costly misallocations and overlooked burn-rate anomalies.</p>
            </div>
            <span className="text-xs font-bold text-primary-light pt-4 block border-t border-navy-800">Transforming weeks of diligence into 18 seconds.</span>
          </div>

          <div className="glass-panel rounded-3xl p-8 border border-navy-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary"><Cpu className="w-6 h-6" /></div>
              <h3 className="text-xl font-extrabold text-white">Our Autonomous Solution</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">Vanguard AI orchestrates specialized multi-agent LLM workflows (`Vanguard Copilot`, `Cap-Table Auditor`, `Patent IP Cross-Referencer`). Our agents continuously ingest GitHub metrics, clinical trial dossiers, and cloud compute invoices to deliver real-time, SOC2-verified audit memorandums.</p>
            </div>
            <span className="text-xs font-bold text-secondary pt-4 block border-t border-navy-800">Over $1.8 Billion in evaluated capital to date.</span>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-navy-800 space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-extrabold text-white">Our Global R&D & Engineering Hubs</h3>
            <p className="text-xs text-slate-400 mt-1">Distributed across three strategic technological centers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-navy-950 p-6 rounded-2xl border border-primary/40 space-y-2">
              <div className="flex items-center justify-between"><span className="text-sm font-extrabold text-white">Chattogram / Dhaka Hub</span><span className="px-2 py-0.5 rounded bg-primary/20 text-primary-light font-bold text-[10px]">Primary R&D</span></div>
              <p className="text-xs text-slate-300">Agrabad Tech & Innovation Tower, Chattogram, Bangladesh (GMT+6). Home to our Core AI & Multi-Agent Engineering division.</p>
            </div>

            <div className="bg-navy-950 p-6 rounded-2xl border border-navy-800 space-y-2">
              <div className="flex items-center justify-between"><span className="text-sm font-extrabold text-white">San Francisco HQ</span><span className="px-2 py-0.5 rounded bg-navy-800 text-slate-300 font-bold text-[10px]">Venture Deal-Flow</span></div>
              <p className="text-xs text-slate-300">450 Mission Street, San Francisco, CA. Connecting directly with Silicon Valley Tier-1 institutional funds and deeptech founders.</p>
            </div>

            <div className="bg-navy-950 p-6 rounded-2xl border border-navy-800 space-y-2">
              <div className="flex items-center justify-between"><span className="text-sm font-extrabold text-white">Zurich Lab</span><span className="px-2 py-0.5 rounded bg-navy-800 text-slate-300 font-bold text-[10px]">Quantum & Bio R&D</span></div>
              <p className="text-xs text-slate-300">ETH Zurich Innovation Park, Switzerland. Overseeing regulatory compliance and quantum cryptography verification.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}