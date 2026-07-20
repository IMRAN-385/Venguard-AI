"use client";

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Award, ArrowRight, SlidersHorizontal, RefreshCw, CheckCircle2, Cpu } from 'lucide-react';

export default function PortfolioPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [refinementFilter, setRefinementFilter] = useState<'all' | 'high_safety' | 'seed_upside' | 'high_runway'>('all');
  const [isRefining, setIsRefining] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['ai-recommendations', user?.investorProfile],
    queryFn: async () => {
      const res = await api.post('/ai/recommend', {
        investorProfile: user?.investorProfile
      });
      return res.data;
    },
    enabled: !!user
  });

  if (authLoading || !user) return null;

  const handleRefine = () => {
    setIsRefining(true);
    setTimeout(() => {
      refetch();
      setIsRefining(false);
    }, 600);
  };

  const recommendations = data?.recommendations || [];
  const summaryText = data?.summary || 'Analyzing portfolio alignment across verified startup cap-tables...';

  const filteredRecs = recommendations.filter((rec: any) => {
    if (refinementFilter === 'high_safety') return rec.aiScore >= 90;
    if (refinementFilter === 'seed_upside') return rec.stage === 'Seed' || rec.stage === 'Pre-Seed';
    if (refinementFilter === 'high_runway') return (rec.metrics?.runwayMonths || 20) >= 22;
    return true;
  });

  return (
    <div className="w-full min-h-screen bg-navy-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-navy-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/15 border border-secondary/40 text-xs font-semibold text-secondary mb-2">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>AI Feature B: Smart Recommendation Engine</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Personalized Syndicate Matches & AI Reasoning</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Continuously computes matching scores based on your `<span className="text-white font-bold">{user.investorProfile?.riskTolerance || 'Moderate'}</span>` risk profile and preferred sectors (`{(user.investorProfile?.preferredSectors || ['Generative AI']).join(', ')}`).
            </p>
          </div>
          <button onClick={handleRefine} disabled={isRefining || isLoading} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 border border-navy-700 text-slate-200 text-xs font-bold transition-all">
            <RefreshCw className={`w-3.5 h-3.5 ${isRefining ? 'animate-spin' : ''}`} />
            <span>Refine AI Matches</span>
          </button>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-primary/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shrink-0">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-extrabold text-primary-light uppercase tracking-wider block">Autonomous Portfolio Assessment</span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-3xl">{summaryText}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-navy-950 p-1.5 rounded-xl border border-navy-800 shrink-0 text-xs font-bold">
            <SlidersHorizontal className="w-4 h-4 text-primary ml-2" />
            {(['all', 'high_safety', 'seed_upside', 'high_runway'] as const).map((filterOpt) => (
              <button key={filterOpt} onClick={() => setRefinementFilter(filterOpt)} className={`px-3 py-1.5 rounded-lg transition-colors capitalize ${refinementFilter === filterOpt ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>
                {filterOpt === 'all' ? 'All Matches' : filterOpt === 'high_safety' ? 'High Safety (90+)' : filterOpt === 'seed_upside' ? 'Seed Upside' : '22m+ Runway'}
              </button>
            ))}
          </div>
        </div>

        {isLoading || isRefining ? (
          <div className="py-20 text-center space-y-4 animate-pulse">
            <Cpu className="w-10 h-10 text-primary mx-auto animate-spin" />
            <span className="text-sm font-bold text-slate-300 block">AI Smart Engine is scoring assets against your hurdle rates...</span>
          </div>
        ) : error ? (
          <div className="p-8 bg-red-500/10 border border-red-500/30 rounded-2xl text-center text-red-400 text-xs">⚠️ Could not load recommendations. Please verify backend service connection.</div>
        ) : filteredRecs.length === 0 ? (
          <div className="p-12 bg-navy-900 rounded-2xl text-center text-slate-400 text-xs space-y-3">
            <Award className="w-10 h-10 text-slate-500 mx-auto" />
            <p className="font-bold text-white text-base">No matches found for this sub-filter</p>
            <p>Try switching to 'All Matches' to see your complete ranking.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecs.map((asset: any) => {
              const id = asset._id || asset.id;
              const valuationInM = (Number(asset.valuation) / 1000000).toFixed(1);
              const matchScore = asset.matchScore || 88;

              return (
                <div key={id} className="bg-navy-900/90 rounded-2xl border border-navy-800 hover:border-primary/50 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl group">
                  <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 p-4 border-b border-navy-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-secondary/20 border border-secondary/40 flex items-center justify-center text-secondary font-extrabold text-xs">{matchScore}%</div>
                      <div>
                        <span className="text-xs font-bold text-white block">AI Alignment Match</span>
                        <span className="text-[10px] text-slate-400">Context-Aware Score</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-primary/20 text-primary-light font-extrabold text-[10px] uppercase tracking-wide">{asset.stage}</span>
                  </div>

                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{asset.category}</span>
                        <span className="text-xs font-bold text-white">${valuationInM}M USD</span>
                      </div>
                      <Link href={`/items/${id}`} className="group-hover:text-primary transition-colors">
                        <h3 className="font-extrabold text-lg text-white line-clamp-1">{asset.title}</h3>
                      </Link>
                      <p className="text-xs text-slate-300 mt-2 line-clamp-2 font-normal leading-relaxed">{asset.shortDescription}</p>
                    </div>

                    <div className="bg-navy-950 p-3.5 rounded-xl border border-secondary/30 text-xs space-y-1.5 shadow-inner mt-4">
                      <div className="flex items-center gap-1.5 text-secondary font-bold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Why {matchScore}% Match:</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed font-normal">{asset.aiReasoning}</p>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <Link href={`/items/${id}`} className="w-full py-2.5 rounded-xl bg-navy-800 hover:bg-primary text-white text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 border border-navy-700 hover:border-primary">
                      <span>Review Due Diligence Dossier</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}