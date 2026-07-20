"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import api from '../services/api';
import { AssetCard } from '../components/AssetCard';
import { AssetCardSkeleton } from '../components/AssetCardSkeleton';
import { Cpu, Sparkles, FileText, BarChart3, ShieldCheck, ArrowRight, Layers, Database } from 'lucide-react';

export default function HomePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['assets', 'featured'],
    queryFn: async () => {
      const response = await api.get('/assets?limit=8');
      return response.data.assets;
    }
  });

  const capabilities = [
    {
      title: 'AI Due Diligence Generator',
      desc: 'Create formal institutional investment memos, risk reports, and executive summaries in seconds. Adjustable length & VC tones.',
      path: '/ai/generator',
      icon: FileText
    },
    {
      title: 'Smart Matching Engine',
      desc: 'Matches your personal check size, risk profile, and preferred deeptech sectors against verified startup cap-tables with exact match reasoning.',
      path: '/portfolio',
      icon: Sparkles
    },
    {
      title: 'Vanguard Copilot & Tools',
      desc: 'Conversational agent capable of searching assets, calculating 5-year ROI projections, and executing macroeconomic stress tests.',
      path: '/ai/copilot',
      icon: Cpu
    },
    {
      title: 'Financial & CSV Data Analyzer',
      desc: 'Upload CSV or JSON balance sheets or test built-in SaaS burn reports to get instant KPI cards, Recharts burn trajectories, and anomaly alerts.',
      path: '/ai/analyzer',
      icon: BarChart3
    },
    {
      title: 'Auto Classification & Tagging',
      desc: 'Automatically organizes startup pitch descriptions into structured tags (#DeepTech, #Patent-Protected) with bulk classification support.',
      path: '/items/add',
      icon: Layers
    },
    {
      title: 'Multi-LLM Live API Support',
      desc: 'Connect your own API keys for Groq, OpenAI, Gemini, or Claude right in settings, or use our zero-config Vanguard Simulation Engine.',
      path: '/settings',
      icon: Database
    }
  ];

  return (
    <div className="w-full pb-24">
      
      {/* Clean Minimal Hero Section */}
      <section className="w-full pt-20 pb-24 px-6 lg:px-8 border-b border-slate-800/80">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="clean-badge">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Autonomous DeepTech Due Diligence Platform v4.2</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Invest with <span className="text-primary">Autonomous Verification</span> & Zero Spreadsheets
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
            Vanguard AI programmatically ingests startup cap-tables, GitHub repositories, and USPTO patent filings to draft institutional investment memorandums in seconds.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/explore" className="btn-primary px-6 py-3 text-sm">
              <span>Explore Verified Startups</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/ai/generator" className="btn-secondary px-6 py-3 text-sm">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Run Due Diligence Memo</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Core Listing Grid (Exactly 4 Cards per Row on Desktop) */}
      <section className="w-full py-20 px-6 lg:px-8 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider block mb-1">Portfolio Deal-Flow</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Featured Startup Assets</h2>
            </div>
            <Link href="/explore" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors">
              <span>View all verified assets</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              [...Array(8)].map((_, idx) => <AssetCardSkeleton key={idx} />)
            ) : error ? (
              <div className="col-span-full clean-card p-8 text-center text-red-400 text-sm">Unable to load startup assets. Please check backend connection.</div>
            ) : data && data.length > 0 ? (
              data.map((asset: any) => <AssetCard key={asset._id || asset.id} asset={asset} />)
            ) : (
              <div className="col-span-full clean-card p-12 text-center text-slate-400">No startup assets found.</div>
            )}
          </div>
        </div>
      </section>

      {/* Clean AI Capabilities Suite */}
      <section className="w-full py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-1">Agentic AI Suite</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Six Built-In Autonomous Features</h2>
            <p className="text-sm text-slate-400 mt-2">Go beyond basic text generation with context-aware recommendation algorithms, tool executions, and multi-provider LLM support.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((cap, idx) => {
              const Icon = cap.icon;
              return (
                <Link key={idx} href={cap.path} className="clean-card p-6 flex flex-col justify-between group">
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-white group-hover:text-primary transition-colors">{cap.title}</h3>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed font-normal">{cap.desc}</p>
                    </div>
                  </div>
                  <div className="pt-4 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-300 group-hover:text-white">
                    <span>Try Feature</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}