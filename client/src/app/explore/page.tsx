"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { AssetCard } from '../../components/AssetCard';
import { AssetCardSkeleton } from '../../components/AssetCardSkeleton';
import { Search, SlidersHorizontal, Cpu, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stageFilter, setStageFilter] = useState('All Stages');
  const [minScoreFilter, setMinScoreFilter] = useState<number>(0);
  const [sortOption, setSortOption] = useState('recently_added');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  const { data, isLoading, error } = useQuery({
    queryKey: ['assets', 'explore', searchQuery, categoryFilter, stageFilter, minScoreFilter, sortOption, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(itemsPerPage),
      });

      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (categoryFilter !== 'All') params.append('category', categoryFilter);
      if (stageFilter !== 'All Stages') params.append('stage', stageFilter);
      if (minScoreFilter > 0) params.append('minScore', String(minScoreFilter));
      if (sortOption) params.append('sort', sortOption);

      const response = await api.get(`/assets?${params.toString()}`);
      return response.data;
    },
    placeholderData: (previousData) => previousData,
  });

  const categories = ['All', 'Generative AI', 'Quantum Computing', 'Biotech & Genomics', 'Robotics & Automation', 'CleanTech & Fusion'];
  const stages = ['All Stages', 'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Growth'];
  const scores = [
    { label: 'All AI Scores', value: 0 },
    { label: 'High Safety (90+ Score)', value: 90 },
    { label: 'Moderate Growth (85+ Score)', value: 85 },
    { label: 'Early High Upside (80+ Score)', value: 80 },
  ];

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('All');
    setStageFilter('All Stages');
    setMinScoreFilter(0);
    setSortOption('recently_added');
    setCurrentPage(1);
  };

  return (
    <div className="w-full min-h-screen bg-navy-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 pb-6 border-b border-navy-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs font-semibold text-primary-light mb-2">
              <Cpu className="w-3.5 h-3.5" />
              <span>Verified Deal-Flow Index</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Explore Autonomous Startup Assets</h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">Filter by sector, valuation stage, and live AI health score across our repository of SOC2-verified deeptech assets.</p>
          </div>
          <div className="text-right text-xs text-slate-400">
            <span className="font-bold text-white">{data?.total || 0}</span> verified assets available across all filters
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-navy-800 shadow-xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-4 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input type="text" placeholder="Search by name, patent, or technology..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} className="w-full pl-10 pr-4 py-2.5 bg-navy-950 border border-navy-700 focus:border-primary rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all" />
            </div>

            <div className="md:col-span-3">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sector / Category</label>
              <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }} className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white focus:outline-none focus:border-primary cursor-pointer">
                {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Stage</label>
              <select value={stageFilter} onChange={(e) => { setStageFilter(e.target.value); setCurrentPage(1); }} className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white focus:outline-none focus:border-primary cursor-pointer">
                {stages.map((st) => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">AI Safety Score</label>
              <select value={minScoreFilter} onChange={(e) => { setMinScoreFilter(Number(e.target.value)); setCurrentPage(1); }} className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white focus:outline-none focus:border-primary cursor-pointer">
                {scores.map((sc) => <option key={sc.value} value={sc.value}>{sc.label}</option>)}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-navy-800/80 text-xs">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-primary" />
              <span className="font-semibold text-slate-300">Sort Assets By:</span>
              <select value={sortOption} onChange={(e) => { setSortOption(e.target.value); setCurrentPage(1); }} className="bg-navy-950 border border-navy-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-primary cursor-pointer font-semibold">
                <option value="recently_added">Recently Added</option>
                <option value="highest_score">Highest AI Health Score</option>
                <option value="lowest_valuation">Lowest Valuation ($)</option>
                <option value="highest_valuation">Highest Valuation ($)</option>
                <option value="most_reviews">Most Due Diligence Reviews</option>
              </select>
            </div>
            <button onClick={handleResetFilters} className="text-xs text-secondary hover:text-secondary-light font-semibold underline transition-colors">Reset All Filters</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            [...Array(8)].map((_, idx) => <AssetCardSkeleton key={idx} />)
          ) : error ? (
            <div className="col-span-full bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center text-red-400">⚠️ Failed to fetch assets. Please check your backend status.</div>
          ) : data?.assets && data.assets.length > 0 ? (
            data.assets.map((asset: any) => <AssetCard key={asset._id || asset.id} asset={asset} />)
          ) : (
            <div className="col-span-full bg-navy-900 rounded-2xl p-12 text-center space-y-3">
              <ShieldCheck className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-white">No matching startup assets found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">Try broadening your search query or selecting 'All Categories' and 'All Stages'.</p>
              <button onClick={handleResetFilters} className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold transition-all">Reset Filters</button>
            </div>
          )}
        </div>

        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between pt-6 border-t border-navy-800">
            <span className="text-xs text-slate-400">Page <strong className="text-white">{data.page}</strong> of <strong className="text-white">{data.totalPages}</strong></span>
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage <= 1 || isLoading} className="px-4 py-2 rounded-xl bg-navy-900 border border-navy-700 hover:bg-navy-800 disabled:opacity-40 text-xs font-bold text-white transition-all flex items-center gap-1.5"><ArrowLeft className="w-3.5 h-3.5" /><span>Previous</span></button>
              <button onClick={() => setCurrentPage((p) => Math.min(data.totalPages, p + 1))} disabled={currentPage >= data.totalPages || isLoading} className="px-4 py-2 rounded-xl bg-navy-900 border border-navy-700 hover:bg-navy-800 disabled:opacity-40 text-xs font-bold text-white transition-all flex items-center gap-1.5"><span>Next</span><ArrowRight className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}