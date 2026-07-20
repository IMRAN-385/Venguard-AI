"use client";

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, TrendingUp, Calendar, ArrowRight } from 'lucide-react';

export interface AssetCardProps {
  asset: {
    _id?: string;
    id?: string;
    title: string;
    shortDescription: string;
    valuation: number;
    foundedYear: number;
    aiScore: number;
    location: string;
    category: string;
    stage: string;
    imageUrl: string;
  };
}

export const AssetCard: React.FC<AssetCardProps> = ({ asset }) => {
  const assetId = asset._id || asset.id || 'unknown';
  const valuationInM = (Number(asset.valuation) / 1000000).toFixed(1);

  return (
    <div className="h-[460px] w-full clean-card flex flex-col justify-between group overflow-hidden relative">
      
      {/* Top Image & Clean Pill Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900 shrink-0">
        <img
          src={asset.imageUrl || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80'}
          alt={asset.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />

        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-800 text-[11px] font-medium text-slate-200">
            {asset.category}
          </span>
        </div>

        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 backdrop-blur-md text-emerald-400 text-xs font-semibold flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{asset.aiScore}</span>
        </div>
      </div>

      {/* Middle Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-semibold text-primary">{asset.stage}</span>
            <span>{asset.location || 'Global'}</span>
          </div>
          <Link href={`/items/${assetId}`} className="group-hover:text-primary transition-colors">
            <h3 className="font-bold text-base text-white line-clamp-1 tracking-tight">
              {asset.title}
            </h3>
          </Link>
          <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed font-normal">
            {asset.shortDescription}
          </p>
        </div>

        {/* Clean Metrics Row */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800/80 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-500 block">Valuation</span>
              <span className="font-semibold text-white">${valuationInM}M</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-500 block">Founded</span>
              <span className="font-semibold text-white">{asset.foundedYear || 2024}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Clean Bottom Button */}
      <div className="p-5 pt-0 shrink-0">
        <Link
          href={`/items/${assetId}`}
          className="w-full py-2.5 rounded-xl bg-slate-900/80 hover:bg-primary text-slate-200 hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 border border-slate-800 hover:border-primary"
        >
          <span>Due Diligence Dossier</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

    </div>
  );
};