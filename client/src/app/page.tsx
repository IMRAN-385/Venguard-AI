"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import api from '../services/api';
import { Hero } from '../components/Hero';
import { LiveAgentFeed } from '../components/LiveAgentFeed';
import { AssetCard } from '../components/AssetCard';
import { AssetCardSkeleton } from '../components/AssetCardSkeleton';
import { SectorChartSection } from '../components/SectorChartSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { FaqAccordion } from '../components/FaqAccordion';
import { NewsletterCallToAction } from '../components/NewsletterCallToAction';
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
      title: 'AI Due Diligence Memo Generator',
      desc: 'Create institutional investment memos, risk reports, and executive summaries in seconds. Fully adjustable word lengths and conservative/aggressive VC tones.',
      path: '/ai/generator',
      icon: FileText,
      badge: 'Feature A'
    },
    {
      title: 'Smart Matching & Recommendation Engine',
      desc: 'Matches your personal check size, risk profile, and preferred deeptech sectors against real verified startup cap-tables with exact % match reasoning.',
      path: '/portfolio',
      icon: Sparkles,
      badge: 'Feature B'
    },
    {
      title: 'Vanguard Copilot with Tool Calling',
      desc: 'An embedded conversational agent that searches startups, calculates 5-year ROI projections, and runs recession stress tests right inside your chat window.',
      path: '/ai/copilot',
      icon: Cpu,
      badge: 'Feature C'
    },
    {
      title: 'Financial & Cap-Table Data Analyzer',
      desc: 'Upload CSV or JSON financial balance sheets or test built-in SaaS burn datasets to get instant KPI breakdowns, trend charts, and anomaly red-flag alerts.',
      path: '/ai/analyzer',
      icon: BarChart3,
      badge: 'Feature D'
    },
    {
      title: 'Autonomous Tagging & Bulk Classifier',
      desc: 'Automatically classifies pitch descriptions into structured tags (#DeepTech, #Patent-Protected, #ESG-Verified) with editable labels and bulk classification.',
      path: '/items/add',
      icon: Layers,
      badge: 'Feature E'
    },
    {
      title: 'Multi-LLM Live API Integration',
      desc: 'Enter your live API keys for Groq, OpenAI, Gemini, or Claude directly into the settings, or rely on our bulletproof Vanguard High-Fidelity Simulation engine.',
      path: '/settings',
      icon: Database,
      badge: 'Live Keys'
    }
  ];

  return (
    <div className="w-full">
      <Hero />
      <LiveAgentFeed />

      {/* Core Listing / Card Section (Featured Startups) */}
      <section className="w-full bg-navy-950 py-16 px-4 sm:px-6 lg:px-8 border-b border-navy-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs font-semibold text-primary-light mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Deal-Flow</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">High-Conviction Autonomous Startups</h2>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">Every asset below is verified via USPTO patent cross-referencing and banking API burn-rate synthesis.</p>
            </div>
            <Link href="/explore" className="flex items-center gap-2 text-xs font-bold text-primary hover:text-primary-light px-4 py-2 rounded-xl bg-navy-900 border border-navy-800 transition-colors shrink-0">
              <span>Explore All Verified Assets</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              [...Array(8)].map((_, idx) => <AssetCardSkeleton key={idx} />)
            ) : error ? (
              <div className="col-span-full bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center text-red-400">⚠️ Unable to load featured startups. Please check backend connection.</div>
            ) : data && data.length > 0 ? (
              data.map((asset: any) => <AssetCard key={asset._id || asset.id} asset={asset} />)
            ) : (
              <div className="col-span-full bg-navy-900 rounded-2xl p-8 text-center text-slate-400">No startup assets found.</div>
            )}
          </div>
        </div>
      </section>

      {/* AI Capabilities Showcase */}
      <section className="w-full bg-navy-900/60 py-20 px-4 sm:px-6 lg:px-8 border-b border-navy-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-secondary/15 border border-secondary/40 text-xs font-semibold text-secondary mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Agent AI Suite</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Six Autonomous Intelligence Features Built In</h2>
            <p className="text-sm sm:text-base text-slate-400 mt-3 leading-relaxed">Go beyond simple text generation. Our application integrates programmatic tool execution, Recharts data visualization, context-aware matching, and multi-provider LLM support.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {capabilities.map((cap, idx) => {
              const Icon = cap.icon;
              return (
                <Link key={idx} href={cap.path} className="bg-navy-900 rounded-2xl p-6 border border-navy-800 hover:border-primary/50 transition-all duration-300 flex flex-col justify-between group shadow-lg hover:shadow-[0_10px_30px_rgba(59,130,246,0.15)]">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-navy-950 border border-navy-700 text-[10px] font-bold text-secondary uppercase tracking-wider">{cap.badge}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{cap.title}</h3>
                    <p className="text-xs text-slate-300 mt-2.5 leading-relaxed font-normal">{cap.desc}</p>
                  </div>
                  <div className="pt-4 mt-6 border-t border-navy-800 flex items-center justify-between text-xs font-bold text-primary-light group-hover:translate-x-1 transition-transform">
                    <span>Explore Feature</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <SectorChartSection />
      <TestimonialsSection />
      <FaqAccordion />
      <NewsletterCallToAction />
    </div>
  );
}