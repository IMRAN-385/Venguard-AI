"use client";

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, MapPin, Calendar, TrendingUp, ArrowRight } from 'lucide-react';

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
    arr?: number;
    monthlyBurn?: number;
  };
}

export const AssetCard: React.FC<AssetCardProps> = ({ asset }) => {
  const assetId = asset._id || asset.id || 'unknown';
  const valuationInM = (Number(asset.valuation) / 1000000).toFixed(1);

  // Score color badge
  const getScoreBadge = (score: number) => {
    if (score >= 92) return 'bg-secondary/20 text-secondary border-secondary/40';
    if (score >= 85) return 'bg-primary/20 text-primary-light border-primary/40';
    return 'bg-accent/20 text-accent border-accent/40';
  };

  return (
    <div className="h-[480px] w-full bg-navy-900/90 rounded-2xl border border-navy-800 hover:border-primary/50 transition-all duration-300 flex flex-col justify-between group overflow-hidden shadow-lg hover:shadow-[0_10px_30px_rgba(59,130,246,0.15)] relative">
      
      {/* Top Half: Image & Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-navy-950 shrink-0">
        <img
          src={asset.imageUrl || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80'}
          alt={asset.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/30 to-transparent" />

        {/* Category & Stage pill */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-2.5 py-1 rounded-lg bg-navy-950/85 backdrop-blur-md border border-navy-700 text-[11px] font-bold text-white shadow-sm">
            {asset.category}
          </span>
          <span className="px-2 py-1 rounded-lg bg-primary/80 backdrop-blur-md text-[10px] font-extrabold text-white shadow-sm uppercase tracking-wide">
            {asset.stage}
          </span>
        </div>

        {/* AI Health Score badge */}
        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg border backdrop-blur-md text-xs font-extrabold flex items-center gap-1 shadow-md ${getScoreBadge(Number(asset.aiScore))}`}>
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{asset.aiScore}/100</span>
        </div>
      </div>

      {/* Middle: Title & Short Description */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/items/${assetId}`} className="group-hover:text-primary transition-colors">
            <h3 className="font-extrabold text-base text-white line-clamp-1 tracking-tight">
              {asset.title}
            </h3>
          </Link>
          <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed font-normal">
            {asset.shortDescription}
          </p>
        </div>

        {/* Meta Info Grid */}
        <div className="grid grid-cols-2 gap-2 pt-3 mt-3 border-t border-navy-800/80 text-[11px] text-slate-300">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <TrendingUp className="w-3.5 h-3.5 text-secondary shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block">Valuation</span>
              <span className="font-bold text-white">${valuationInM}M USD</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-hidden">
            <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block">Founded</span>
              <span className="font-bold text-white">{asset.foundedYear || 2024}</span>
            </div>
          </div>

          <div className="col-span-2 flex items-center gap-1.5 pt-1 overflow-hidden">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-300 truncate font-medium">{asset.location || 'Global Remote'}</span>
          </div>
        </div>
      </div>

      {/* Bottom: View Details Action Button */}
      <div className="p-4 pt-0 shrink-0">
        <Link
          href={`/items/${assetId}`}
          className="w-full py-2.5 rounded-xl bg-navy-800 hover:bg-primary text-white text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 border border-navy-700 hover:border-primary group-hover:shadow-[0_0_15px_rgba(59,130,246,0.25)]"
        >
          <span>View Due Diligence & Details</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

    </div>
  );
};