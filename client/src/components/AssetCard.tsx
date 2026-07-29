"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import type { Asset } from "./FeaturedAssets";

interface Props {
  asset: Asset;
}

function fmt(v: number) {
  if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(1)}B`;
  if (v >= 1_000_000)     return `$${(v / 1_000_000).toFixed(0)}M`;
  if (v >= 1_000)         return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v}`;
}

export function AssetCard({ asset }: Props) {
  const riskBand =
    asset.riskScore < 30 ? "Low" : asset.riskScore < 65 ? "Med" : "High";
  const riskColor =
    asset.riskScore < 30
      ? "text-accent"
      : asset.riskScore < 65
      ? "text-bone-100"
      : "text-orange-400";

  return (
    <Link
      href={`/items/${asset._id}`}
      className="group card-item p-4 flex flex-col h-full"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-ink-950 mb-4">
        {asset.image ? (
          <Image
            src={asset.image}
            alt={asset.title}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-display text-4xl text-bone-400">
            {asset.title.charAt(0)}
          </div>
        )}

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="tag bg-ink-950/80 backdrop-blur-sm">{asset.sector}</span>
          {asset.verified && (
            <span className="tag-accent flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Verified
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display text-xl text-bone-50 leading-tight group-hover:text-accent transition-colors">
            {asset.title}
          </h3>
          <ArrowUpRight className="w-4 h-4 text-bone-300 group-hover:text-accent flex-shrink-0 mt-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>

        <p className="text-sm text-bone-300 leading-relaxed line-clamp-2 mb-4">
          {asset.shortDescription}
        </p>

        {/* Meta */}
        <div className="mt-auto pt-4 border-t border-ink-600/40 grid grid-cols-3 gap-2 text-xs">
          <div>
            <div className="text-bone-400 uppercase tracking-wider text-[10px] mb-1">Stage</div>
            <div className="text-bone-100 font-medium">{asset.stage}</div>
          </div>
          <div>
            <div className="text-bone-400 uppercase tracking-wider text-[10px] mb-1">Val</div>
            <div className="text-bone-100 font-medium">{fmt(asset.valuation)}</div>
          </div>
          <div>
            <div className="text-bone-400 uppercase tracking-wider text-[10px] mb-1">Risk</div>
            <div className={`font-medium ${riskColor}`}>{riskBand}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}