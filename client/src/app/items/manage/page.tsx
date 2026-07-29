"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit3, Trash2, ExternalLink, ShieldCheck, Loader2, Search } from "lucide-react";
import { useState } from "react";
import { api } from "@/services/api";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardShell } from "@/components/DashboardShell";
import type { Asset } from "@/components/FeaturedAssets";

async function fetchMine(): Promise<Asset[]> {
  const { data } = await api.get("/assets?mine=true");
  return data.assets ?? data;
}

export default function ManageAssetsPage() {
  return (
    <ProtectedRoute>
      <DashboardShell>
        <ManageInner />
      </DashboardShell>
    </ProtectedRoute>
  );
}

function ManageInner() {
  const qc = useQueryClient();
  const [query, setQuery] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["my-assets"],
    queryFn: fetchMine,
    retry: 1,
  });

  const del = useMutation({
    mutationFn: (id: string) => api.delete(`/assets/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-assets"] }),
  });

  const filtered = (data ?? []).filter((a) =>
    a.title?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <p className="eyebrow mb-3">[ Investor cockpit ]</p>
          <h1 className="display-serif text-4xl md:text-5xl">Manage assets</h1>
          <p className="text-bone-300 mt-2">
            {filtered.length} asset{filtered.length === 1 ? "" : "s"} in your portfolio.
          </p>
        </div>
        <Link href="/items/add" className="btn-accent">
          <Plus className="w-4 h-4" /> Add asset
        </Link>
      </div>

      {/* Search */}
      <div className="panel p-4 mb-6">
        <div className="relative">
          <Search className="w-4 h-4 text-bone-300 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your assets…"
            className="field pl-11"
          />
        </div>
      </div>

      {/* Table */}
      <div className="panel overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center">
            <Loader2 className="w-6 h-6 text-accent animate-spin mx-auto" />
          </div>
        ) : isError ? (
          <div className="p-16 text-center">
            <p className="text-bone-200 mb-1">Couldn't load your assets.</p>
            <p className="text-xs text-bone-400 font-mono">Backend may be offline.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <p className="font-display text-2xl text-bone-50 mb-2">No assets yet</p>
            <p className="text-bone-300 mb-6">Start by adding your first startup.</p>
            <Link href="/items/add" className="btn-accent inline-flex">
              <Plus className="w-4 h-4" /> Add first asset
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink-600/40">
                  <th className="text-left px-6 py-4 eyebrow">Startup</th>
                  <th className="text-left px-6 py-4 eyebrow">Sector</th>
                  <th className="text-left px-6 py-4 eyebrow">Stage</th>
                  <th className="text-left px-6 py-4 eyebrow">Valuation</th>
                  <th className="text-left px-6 py-4 eyebrow">Status</th>
                  <th className="text-right px-6 py-4 eyebrow">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a._id} className="border-b border-ink-600/20 hover:bg-ink-800/40 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-ink-800 flex-shrink-0">
                          {a.image ? (
                            <Image src={a.image} alt={a.title} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-display text-lg text-bone-400">
                              {a.title?.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-bone-50 truncate">{a.title}</div>
                          <div className="text-xs text-bone-400 truncate max-w-xs">{a.shortDescription}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><span className="tag">{a.sector}</span></td>
                    <td className="px-6 py-4 text-sm text-bone-100">{a.stage}</td>
                    <td className="px-6 py-4 text-sm text-bone-100 font-mono">
                      ${(a.valuation ?? 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      {a.verified ? (
                        <span className="tag-accent flex items-center gap-1 w-fit">
                          <ShieldCheck className="w-3 h-3" /> Verified
                        </span>
                      ) : (
                        <span className="tag">Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/items/${a._id}`}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-bone-300 hover:bg-ink-800 hover:text-accent transition"
                          title="View"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-bone-300 hover:bg-ink-800 hover:text-accent transition"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete ${a.title}?`)) del.mutate(a._id);
                          }}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-bone-300 hover:bg-orange-500/10 hover:text-orange-400 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}