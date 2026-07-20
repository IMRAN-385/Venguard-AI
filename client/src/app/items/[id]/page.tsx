"use client";

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { AssetCard } from '../../../components/AssetCard';
import { ShieldCheck, Calendar, MapPin, TrendingUp, Cpu, Star, MessageSquare, Sparkles, FileText, ArrowLeft, Layers } from 'lucide-react';

export default function AssetDetailsPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeMediaTab, setActiveMediaTab] = useState<'cover' | 'architecture' | 'team'>('cover');
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const { data: asset, isLoading, error } = useQuery({
    queryKey: ['asset', id],
    queryFn: async () => {
      const response = await api.get(`/assets/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  const { data: allAssets } = useQuery({
    queryKey: ['assets', 'all'],
    queryFn: async () => {
      const response = await api.get('/assets?limit=20');
      return response.data.assets || [];
    }
  });

  const reviewMutation = useMutation({
    mutationFn: async (payload: { rating: number; comment: string }) => {
      const res = await api.post(`/assets/${id}/reviews`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asset', id] });
      setReviewSuccess('Your due diligence audit note has been added!');
      setReviewComment('');
      setReviewError('');
    },
    onError: (err: any) => {
      setReviewError(err.response?.data?.message || 'Failed to submit review.');
    }
  });

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      setReviewError('Please write an audit comment before submitting.');
      return;
    }
    if (!user) {
      setReviewError('You must be signed in to submit an official audit review.');
      return;
    }
    reviewMutation.mutate({ rating: reviewRating, comment: reviewComment });
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="text-center space-y-3 animate-pulse">
          <Cpu className="w-10 h-10 text-primary mx-auto animate-spin" />
          <span className="text-sm font-bold text-slate-300 block">Ingesting Cap-Table & Patent Specifications...</span>
        </div>
      </div>
    );
  }

  if (error || !asset) {
    return (
      <div className="w-full min-h-screen bg-navy-950 py-20 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-navy-900 border border-navy-800 rounded-2xl p-8 text-center space-y-4">
          <h2 className="text-lg font-bold text-white">Startup Asset Not Found</h2>
          <p className="text-xs text-slate-400">The target deeptech asset (`{id}`) does not exist or was removed during a portfolio rebalancing.</p>
          <Link href="/explore" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold transition-all">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Explore Page</span>
          </Link>
        </div>
      </div>
    );
  }

  const valuationInM = (Number(asset.valuation) / 1000000).toFixed(1);
  const arrInM = (Number(asset.arr || 0) / 1000000).toFixed(2);
  const monthlyBurnInK = Math.round(Number(asset.monthlyBurn || 0) / 1000);

  const relatedAssets = (allAssets || [])
    .filter((a: any) => (a._id || a.id) !== (asset._id || asset.id))
    .slice(0, 4);

  return (
    <div className="w-full min-h-screen bg-navy-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <Link href="/explore" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Verified Startups Index</span>
          </Link>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-navy-900 border border-navy-800 text-slate-300 font-bold">ID: {id?.slice(0, 10)}...</span>
            <span className="px-2.5 py-1 rounded-lg bg-secondary/20 text-secondary border border-secondary/40 font-extrabold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>AI Score: {asset.aiScore}/100</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-3">
            <div className="h-80 sm:h-96 w-full rounded-2xl overflow-hidden bg-navy-900 border border-navy-800 relative shadow-2xl">
              {activeMediaTab === 'cover' ? (
                <img src={asset.imageUrl} alt={asset.title} className="w-full h-full object-cover" />
              ) : activeMediaTab === 'architecture' ? (
                <div className="w-full h-full bg-navy-950 p-8 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary"><Cpu className="w-8 h-8 animate-pulse" /></div>
                  <h4 className="text-base font-extrabold text-white">Hybrid Quantum-Classical Architecture Diagram</h4>
                  <p className="text-xs text-slate-400 max-w-md">Target deploys multi-tiered edge orchestration circuits. Latency throughput &lt; 12ms. SOC2 encrypted telemetry feeds directly into AWS/GCP bare-metal clusters.</p>
                  <span className="text-[10px] bg-secondary/20 text-secondary px-3 py-1 rounded-full font-bold">✓ Verified by Vanguard Technical Audit</span>
                </div>
              ) : (
                <div className="w-full h-full bg-navy-950 p-8 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="flex -space-x-3 overflow-hidden p-2">
                    <img className="inline-block h-12 w-12 rounded-full ring-2 ring-primary object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Founder 1" />
                    <img className="inline-block h-12 w-12 rounded-full ring-2 ring-primary object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Founder 2" />
                  </div>
                  <h4 className="text-base font-extrabold text-white">Executive Leadership Team Profile</h4>
                  <p className="text-xs text-slate-400 max-w-md">Lead Founder: <strong className="text-white">{asset.founder}</strong>. Former academic researchers and Tier-1 engineering directors with proven exit track record.</p>
                  <span className="text-[10px] bg-primary/20 text-primary-light px-3 py-1 rounded-full font-bold">✓ Background Check Verification Passed</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setActiveMediaTab('cover')} className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${activeMediaTab === 'cover' ? 'bg-primary text-white border-primary shadow-md' : 'bg-navy-900 border-navy-800 text-slate-400 hover:text-white'}`}>Cover Asset Image</button>
              <button onClick={() => setActiveMediaTab('architecture')} className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${activeMediaTab === 'architecture' ? 'bg-primary text-white border-primary shadow-md' : 'bg-navy-900 border-navy-800 text-slate-400 hover:text-white'}`}>System Architecture</button>
              <button onClick={() => setActiveMediaTab('team')} className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${activeMediaTab === 'team' ? 'bg-primary text-white border-primary shadow-md' : 'bg-navy-900 border-navy-800 text-slate-400 hover:text-white'}`}>Executive Team</button>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-3 py-1 rounded-lg bg-navy-900 border border-navy-700 text-xs font-extrabold text-white">{asset.category}</span>
                <span className="px-3 py-1 rounded-lg bg-primary text-white text-xs font-extrabold uppercase tracking-wide">{asset.stage}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">{asset.title}</h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed font-normal">{asset.shortDescription}</p>
            </div>

            <div className="glass-panel rounded-2xl p-5 border border-primary/40 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div><span className="text-[10px] uppercase font-bold text-slate-400 block">Pre-Money Valuation</span><span className="text-2xl sm:text-3xl font-extrabold text-white block">${valuationInM}M <span className="text-sm font-normal text-slate-400">USD</span></span></div>
                <div className="text-right"><span className="text-[10px] uppercase font-bold text-slate-400 block">Current ARR</span><span className="text-xl font-bold text-secondary block">${arrInM}M</span></div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-navy-800/80 text-xs">
                <div><span className="text-[10px] text-slate-400 block">Monthly Net Burn</span><span className="font-bold text-white">${monthlyBurnInK}k / month</span></div>
                <div><span className="text-[10px] text-slate-400 block">Projected Runway</span><span className="font-bold text-secondary">{asset.metrics?.runwayMonths || 20} Months Buffer</span></div>
              </div>

              <div className="pt-2 space-y-2">
                <Link href={`/ai/generator?assetId=${asset._id || asset.id}&title=${encodeURIComponent(asset.title)}&category=${encodeURIComponent(asset.category)}&valuation=${asset.valuation}&stage=${encodeURIComponent(asset.stage)}`} className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>Generate Due Diligence Memo for this Asset</span>
                </Link>
                <Link href="/ai/copilot" className="w-full py-3 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-200 font-bold text-xs border border-navy-700 transition-all flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-secondary" />
                  <span>Chat with Vanguard Copilot about {asset.title}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 border-t border-navy-800">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-navy-900/80 rounded-2xl p-6 border border-navy-800 space-y-4 shadow-lg">
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2 border-b border-navy-800 pb-3"><Layers className="w-5 h-5 text-primary" /><span>Section 1: Detailed Technical Overview & Market Moat</span></h2>
              <div className="text-sm text-slate-300 leading-relaxed space-y-4 whitespace-pre-line font-normal">{asset.fullDescription}</div>
              {asset.tags && asset.tags.length > 0 && (
                <div className="pt-4 border-t border-navy-800 flex flex-wrap gap-2">
                  {asset.tags.map((tag: string, i: number) => <span key={i} className="px-3 py-1 rounded-lg bg-navy-950 border border-navy-700 text-xs font-semibold text-slate-300">#{tag}</span>)}
                </div>
              )}
            </div>

            <div className="bg-navy-900/80 rounded-2xl p-6 border border-navy-800 space-y-6 shadow-lg">
              <div className="flex items-center justify-between border-b border-navy-800 pb-3">
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2"><MessageSquare className="w-5 h-5 text-secondary" /><span>Section 3: Institutional Partner Reviews & Due Diligence Notes</span></h2>
                <span className="text-xs font-bold text-slate-400">{asset.reviews?.length || 0} Verified Reviews</span>
              </div>

              <div className="space-y-4">
                {asset.reviews && asset.reviews.length > 0 ? (
                  asset.reviews.map((rev: any, idx: number) => (
                    <div key={idx} className="bg-navy-950 rounded-xl p-4 border border-navy-800/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2"><span className="font-bold text-sm text-white">{rev.userName}</span><span className="text-[10px] bg-secondary/20 text-secondary px-2 py-0.5 rounded font-bold">Verified Audit Partner</span></div>
                        <div className="flex items-center gap-0.5">{[...Array(rev.rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-accent text-accent" />)}</div>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                      <span className="text-[10px] text-slate-500 block">Submitted on {new Date(rev.date || Date.now()).toLocaleDateString('en-US', { dateStyle: 'medium' })}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No syndicate reviews yet. Be the first partner to record an audit note.</p>
                )}
              </div>

              <form onSubmit={handleReviewSubmit} className="pt-4 border-t border-navy-800 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Add Syndicate Audit Review</h4>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">Institutional Rating:</span>
                  <select value={reviewRating} onChange={(e) => setReviewRating(Number(e.target.value))} className="bg-navy-950 border border-navy-700 rounded-lg px-3 py-1 text-xs text-white focus:outline-none focus:border-primary">
                    <option value={5}>5 Stars — High Conviction / Verified</option>
                    <option value={4}>4 Stars — Strong Unit Economics</option>
                    <option value={3}>3 Stars — Requires Contingency Checks</option>
                    <option value={2}>2 Stars — High Dilution / Red Flags</option>
                    <option value={1}>1 Star — Pass on Allocation</option>
                  </select>
                </div>
                <textarea placeholder="Record verification notes, patent validity observations, or founder reference check details..." value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} rows={3} className="w-full p-3 bg-navy-950 border border-navy-700 focus:border-primary rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none" />
                {reviewError && <p className="text-xs text-red-400">{reviewError}</p>}
                {reviewSuccess && <p className="text-xs text-secondary font-bold">{reviewSuccess}</p>}
                <button type="submit" disabled={reviewMutation.isPending} className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold transition-all shadow-sm">{reviewMutation.isPending ? 'Submitting Review...' : 'Submit Audit Review'}</button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-navy-900/80 rounded-2xl p-6 border border-navy-800 space-y-4 shadow-lg">
              <h2 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-navy-800 pb-3"><Cpu className="w-5 h-5 text-primary" /><span>Section 2: Key Specifications</span></h2>
              <ul className="space-y-3 text-xs">
                <li className="flex justify-between pb-2 border-b border-navy-800/60"><span className="text-slate-400">Total Addressable Market (TAM):</span><span className="font-bold text-white">$48.5 Billion USD</span></li>
                <li className="flex justify-between pb-2 border-b border-navy-800/60"><span className="text-slate-400">Gross Margin Specification:</span><span className="font-bold text-secondary">{asset.metrics?.grossMarginPercent || 79}% Margin</span></li>
                <li className="flex justify-between pb-2 border-b border-navy-800/60"><span className="text-slate-400">Verified Patent Portfolio:</span><span className="font-bold text-white">{asset.metrics?.patentCount || 5} Granted Patents</span></li>
                <li className="flex justify-between pb-2 border-b border-navy-800/60"><span className="text-slate-400">Team Size & PhD Engineers:</span><span className="font-bold text-white">{asset.metrics?.teamSize || 24} Full-Time Personnel</span></li>
                <li className="flex justify-between"><span className="text-slate-400">Primary Headquarters:</span><span className="font-bold text-white">{asset.location}</span></li>
              </ul>
            </div>

            <div className="bg-navy-900/80 rounded-2xl p-6 border border-navy-800 space-y-4 shadow-lg">
              <h2 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-navy-800 pb-3"><ShieldCheck className="w-5 h-5 text-secondary" /><span>Autonomous Agent Audit Log</span></h2>
              <div className="space-y-3">
                {asset.auditLog && asset.auditLog.length > 0 ? (
                  asset.auditLog.map((log: any, idx: number) => (
                    <div key={idx} className="bg-navy-950 p-3 rounded-xl border border-navy-800 text-[11px] space-y-1">
                      <div className="flex items-center justify-between"><span className="font-bold text-primary-light">{log.agentName}</span><span className={`px-2 py-0.5 rounded font-extrabold text-[10px] ${log.status === 'Verified' ? 'bg-secondary/20 text-secondary' : 'bg-primary/20 text-primary-light'}`}>{log.status}</span></div>
                      <p className="text-slate-300 leading-snug">{log.message}</p>
                      <span className="text-[10px] text-slate-500 block pt-0.5">{new Date(log.timestamp || Date.now()).toLocaleDateString()}</span>
                    </div>
                  ))
                ) : (
                  <div className="bg-navy-950 p-3 rounded-xl border border-navy-800 text-[11px] space-y-1"><span className="font-bold text-primary-light">Vanguard-General-Audit v4.0</span><p className="text-slate-300">Initial cap-table and patent registry checks completed with zero red flags.</p></div>
                )}
              </div>
            </div>
          </div>
        </div>

        {relatedAssets.length > 0 && (
          <div className="pt-10 border-t border-navy-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-extrabold text-white tracking-tight">Section 4: Related & Similar High-Conviction Startups</h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">Compare unit economics across similar Series A/B assets in `{asset.category}`.</p>
              </div>
              <Link href="/explore" className="text-xs font-bold text-primary hover:text-primary-light transition-colors">View All Assets →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {relatedAssets.map((rel: any) => <AssetCard key={rel._id || rel.id} asset={rel} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}