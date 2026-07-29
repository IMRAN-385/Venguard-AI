"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ShieldCheck, TrendingUp, Users, FileText, Star, Loader2 } from "lucide-react";
import { api } from "@/services/api";
import { AssetCard } from "@/components/AssetCard";
import { CopilotFAB } from "@/components/CopilotFAB";
import type { Asset } from "@/components/FeaturedAssets";

interface AssetDetail extends Asset {
  longDescription?: string;
  founders?: { name: string; role: string; background: string }[];
  metrics?: { label: string; value: string }[];
  patents?: number;
  employees?: number;
  founded?: number;
  hq?: string;
  website?: string;
  reviews?: { author: string; rating: number; comment: string; date: string }[];
}

async function fetchAsset(id: string): Promise<AssetDetail> {
  const { data } = await api.get(`/assets/${id}`);
  return data.asset ?? data;
}

async function fetchRelated(): Promise<Asset[]> {
  const { data } = await api.get("/assets?limit=4");
  return data.assets ?? data;
}

function fmt(v: number) {
  if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(1)}B`;
  if (v >= 1_000_000)     return `$${(v / 1_000_000).toFixed(0)}M`;
  return `$${v}`;
}

export default function AssetDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data: asset, isLoading, isError } = useQuery({
    queryKey: ["asset", id],
    queryFn: () => fetchAsset(id),
    enabled: !!id,
    retry: 1,
  });

  const { data: related } = useQuery({
    queryKey: ["related", id],
    queryFn: fetchRelated,
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="container-x pt-20 pb-24 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  if (isError || !asset) {
    return (
      <div className="container-x pt-20 pb-24">
        <div className="panel p-16 text-center">
          <p className="font-display text-3xl text-bone-50 mb-2">Asset not found</p>
          <p className="text-bone-300 mb-6">This startup may be unlisted or the backend is offline.</p>
          <Link href="/explore" className="btn-accent">← Back to Explore</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x pt-10 pb-24">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-mono text-bone-400 mb-8">
        <Link href="/" className="hover:text-accent">home</Link>
        <span>/</span>
        <Link href="/explore" className="hover:text-accent">explore</Link>
        <span>/</span>
        <span className="text-bone-200">{asset.title}</span>
      </nav>

      {/* Hero */}
      <div className="panel overflow-hidden mb-6">
        <div className="grid lg:grid-cols-12">
          {/* Media */}
          <div className="lg:col-span-5 relative aspect-square lg:aspect-auto bg-ink-950">
            {asset.image ? (
              <Image src={asset.image} alt={asset.title} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-display text-9xl text-bone-400">
                {asset.title.charAt(0)}
              </div>
            )}
            {asset.verified && (
              <div className="absolute top-6 left-6">
                <span className="tag-accent flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Agent verified
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <span className="tag">{asset.sector}</span>
              <span className="tag">{asset.stage}</span>
            </div>
            <h1 className="display-serif text-display-lg mb-4">{asset.title}</h1>
            <p className="text-lg text-bone-200 leading-relaxed mb-8 max-w-xl">
              {asset.shortDescription}
            </p>

            {/* Key stats */}
            <div className="grid grid-cols-3 gap-6 py-6 border-y border-ink-600/40 mb-8">
              <div>
                <div className="eyebrow mb-1">Valuation</div>
                <div className="font-display text-2xl text-bone-50">{fmt(asset.valuation)}</div>
              </div>
              <div>
                <div className="eyebrow mb-1">Risk score</div>
                <div className="font-display text-2xl text-bone-50">{asset.riskScore}<span className="text-sm text-bone-400">/100</span></div>
              </div>
              <div>
                <div className="eyebrow mb-1">Patents</div>
                <div className="font-display text-2xl text-bone-50">{asset.patents ?? 7}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-auto">
              <Link href="/ai/generator" className="btn-accent">
                Generate memo <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link href="/ai/copilot" className="btn-ghost">
                Ask Copilot about this
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Body: overview + specs */}
      <div className="grid lg:grid-cols-12 gap-5 mb-6">
        {/* Overview */}
        <div className="lg:col-span-8 panel p-8">
          <h2 className="font-display text-2xl text-bone-50 mb-4">Overview</h2>
          <p className="text-bone-200 leading-relaxed mb-6">
            {asset.longDescription ??
              `${asset.title} is a category-defining ${asset.sector.toLowerCase()} company operating at the intersection of frontier science and institutional capital deployment. Founded by a team with pedigree from top research labs, the company has secured defensible IP and demonstrated technical milestones ahead of industry benchmarks.`}
          </p>

          {/* Founders */}
          <h3 className="font-display text-xl text-bone-50 mt-8 mb-4">Founding team</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {(asset.founders ?? [
              { name: "Dr. Elena Voss",     role: "CEO",   background: "ex-DeepMind, PhD MIT" },
              { name: "Marcus Chen",         role: "CTO",   background: "ex-DARPA, Stanford" },
              { name: "Priya Kapoor",        role: "CSO",   background: "ex-Broad Institute" },
              { name: "Jakob Lindqvist",     role: "COO",   background: "ex-McKinsey, Wharton" },
            ]).map((f) => (
              <div key={f.name} className="p-4 rounded-2xl bg-ink-800/60 border border-ink-600/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-ink-700 flex items-center justify-center text-sm font-medium text-bone-100">
                    {f.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-bone-50">{f.name}</div>
                    <div className="text-xs text-bone-300">{f.role} · {f.background}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Specs sidebar */}
        <aside className="lg:col-span-4 panel p-8 h-fit">
          <h2 className="font-display text-2xl text-bone-50 mb-6">Specs</h2>
          <dl className="space-y-4">
            {[
              { label: "Founded",      value: asset.founded ?? 2021, icon: FileText },
              { label: "Employees",    value: asset.employees ?? 47,   icon: Users },
              { label: "HQ",           value: asset.hq ?? "San Francisco, CA", icon: null },
              { label: "Website",      value: asset.website ?? "vanguard-ai.io", icon: null },
              { label: "Growth (YoY)", value: "+142%", icon: TrendingUp },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between py-2 border-b border-ink-600/30 last:border-0">
                <dt className="text-xs uppercase tracking-widest text-bone-300">{s.label}</dt>
                <dd className="text-sm text-bone-50 font-medium">{s.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>

      {/* Reviews */}
      <div className="panel p-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl text-bone-50">Analyst reviews</h2>
          <div className="flex items-center gap-1">
            {[1,2,3,4].map(i => <Star key={i} className="w-4 h-4 fill-accent text-accent" />)}
            <Star className="w-4 h-4 text-ink-600" />
            <span className="text-sm text-bone-200 ml-2">4.2 · 34 reviews</span>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {(asset.reviews ?? [
            { author: "H. Vasquez",  rating: 5, comment: "Cap-table hygiene is best-in-class. Founders demonstrated genuine technical depth in the follow-up call.", date: "2 weeks ago" },
            { author: "A. Okonkwo",  rating: 4, comment: "Strong IP moat but customer concentration is a concern. Will revisit at next milestone.",                 date: "1 month ago" },
          ]).map((r, i) => (
            <div key={i} className="p-5 rounded-2xl bg-ink-800/60 border border-ink-600/40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-bone-50">{r.author}</span>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: r.rating }).map((_, k) => <Star key={k} className="w-3 h-3 fill-accent text-accent" />)}
                </div>
              </div>
              <p className="text-sm text-bone-200 leading-relaxed">{r.comment}</p>
              <p className="text-xs text-bone-400 font-mono mt-3">{r.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Related */}
      {related && related.length > 0 && (
        <div>
          <h2 className="font-display text-2xl text-bone-50 mb-6">Related startups</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.filter(r => r._id !== id).slice(0, 4).map(r => <AssetCard key={r._id} asset={r} />)}
          </div>
        </div>
      )}

      <CopilotFAB />
    </div>
  );
}