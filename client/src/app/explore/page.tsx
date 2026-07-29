"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { api } from "@/services/api";
import { AssetCard } from "@/components/AssetCard";
import { AssetCardSkeleton } from "@/components/AssetCardSkeleton";
import { CopilotFAB } from "@/components/CopilotFAB";
import type { Asset } from "@/components/FeaturedAssets";

const sectors = ["All", "Quantum", "BioTech", "Fusion", "Robotics", "SpaceTech", "Neural", "Climate", "Defense"];
const stages = ["All", "Pre-Seed", "Seed", "Series A", "Series B", "Series C+"];
const sorts = [
  { id: "newest",    label: "Newest first" },
  { id: "valuation", label: "Valuation ↓" },
  { id: "risk",      label: "Risk score ↑" },
  { id: "verified",  label: "Verified first" },
];

const PAGE_SIZE = 12;

async function fetchAll(): Promise<Asset[]> {
  const { data } = await api.get("/assets");
  return data.assets || data;
}

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("All");
  const [stage, setStage] = useState("All");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["all-assets"],
    queryFn: fetchAll,
    retry: 1,
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    let arr = [...data];
    if (query.trim()) {
      const q = query.toLowerCase();
      arr = arr.filter(
        (a) =>
          a.title?.toLowerCase().includes(q) ||
          a.shortDescription?.toLowerCase().includes(q) ||
          a.sector?.toLowerCase().includes(q)
      );
    }
    if (sector !== "All") arr = arr.filter((a) => a.sector === sector);
    if (stage !== "All")  arr = arr.filter((a) => a.stage === stage);

    switch (sort) {
      case "valuation": arr.sort((a, b) => (b.valuation ?? 0) - (a.valuation ?? 0)); break;
      case "risk":      arr.sort((a, b) => (a.riskScore ?? 0) - (b.riskScore ?? 0)); break;
      case "verified":  arr.sort((a, b) => Number(b.verified) - Number(a.verified)); break;
    }
    return arr;
  }, [data, query, sector, stage, sort]);

  const paged = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = paged.length < filtered.length;
  const activeFilters = (sector !== "All" ? 1 : 0) + (stage !== "All" ? 1 : 0);

  function clearFilters() {
    setQuery(""); setSector("All"); setStage("All"); setSort("newest"); setPage(1);
  }

  return (
    <div className="container-x pt-10 pb-24">
      {/* Header */}
      <div className="mb-10">
        <p className="eyebrow mb-4">[ Verified deal-flow ]</p>
        <h1 className="display-serif text-display-lg mb-4">
          Explore the<br />
          <span className="italic text-bone-200">deeptech network.</span>
        </h1>
        <p className="text-bone-300 max-w-2xl">
          {filtered.length} verified startups across {sectors.length - 1} frontier sectors. Every entry is cross-checked by the agent mesh.
        </p>
      </div>

      {/* Search + controls */}
      <div className="panel p-4 mb-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-bone-300 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Search by name, sector, thesis…"
            className="field pl-11 text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`btn-ghost !py-3 ${activeFilters ? "border-accent/60 text-accent" : ""}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters {activeFilters > 0 && <span className="ml-1 text-xs">({activeFilters})</span>}
          </button>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="field !py-3 !w-auto text-sm"
          >
            {sorts.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {/* Filter drawer */}
      {showFilters && (
        <div className="panel p-6 mb-6 grid md:grid-cols-2 gap-6">
          <div>
            <label className="eyebrow block mb-3">Sector</label>
            <div className="flex flex-wrap gap-2">
              {sectors.map((s) => (
                <button
                  key={s}
                  onClick={() => { setSector(s); setPage(1); }}
                  className={`px-3 py-1.5 rounded-full text-xs border transition ${
                    sector === s
                      ? "bg-accent text-ink-950 border-accent"
                      : "text-bone-200 border-ink-600/60 hover:bg-ink-800"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="eyebrow block mb-3">Stage</label>
            <div className="flex flex-wrap gap-2">
              {stages.map((s) => (
                <button
                  key={s}
                  onClick={() => { setStage(s); setPage(1); }}
                  className={`px-3 py-1.5 rounded-full text-xs border transition ${
                    stage === s
                      ? "bg-accent text-ink-950 border-accent"
                      : "text-bone-200 border-ink-600/60 hover:bg-ink-800"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {activeFilters > 0 && (
            <div className="md:col-span-2 flex justify-end">
              <button onClick={clearFilters} className="btn-link">
                <X className="w-4 h-4" /> Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Result count */}
      <div className="flex items-center justify-between mb-6 px-1">
        <p className="text-sm text-bone-300 font-mono">
          {isLoading ? "loading…" : `${filtered.length} result${filtered.length === 1 ? "" : "s"}`}
        </p>
        {(query || activeFilters > 0) && (
          <button onClick={clearFilters} className="text-xs text-accent hover:underline font-mono">
            reset
          </button>
        )}
      </div>

      {/* Grid */}
      {isError ? (
        <div className="panel p-16 text-center">
          <p className="text-bone-200 mb-2">Backend offline — showing empty state.</p>
          <p className="text-xs text-bone-400 font-mono">start: cd server && npm run dev</p>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => <AssetCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="panel p-16 text-center">
          <p className="font-display text-2xl text-bone-50 mb-2">No matches</p>
          <p className="text-bone-300 mb-6">Try widening your filters or search terms.</p>
          <button onClick={clearFilters} className="btn-ghost">Clear filters</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {paged.map((asset) => <AssetCard key={asset._id} asset={asset} />)}
          </div>

          {hasMore && (
            <div className="text-center mt-10">
              <button onClick={() => setPage((p) => p + 1)} className="btn-ghost">
                Load more ({filtered.length - paged.length} remaining)
              </button>
            </div>
          )}
        </>
      )}

      <CopilotFAB />
    </div>
  );
}