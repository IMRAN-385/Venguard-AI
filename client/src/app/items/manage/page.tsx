"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import { ShieldCheck, BarChart3, Eye, Edit3, Trash2, PlusCircle, Search, AlertTriangle, X, CheckCircle2, Cpu } from 'lucide-react';

export default function ManageAssetsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingAsset, setEditingAsset] = useState<any | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const { data: assets, isLoading, error } = useQuery({
    queryKey: ['assets', 'manage'],
    queryFn: async () => {
      const res = await api.get('/assets?limit=50');
      return res.data.assets || [];
    },
    enabled: !!user
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const res = await api.put(`/assets/${id}`, updates);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      setEditingAsset(null);
      setNotification('Startup asset updated successfully!');
      setTimeout(() => setNotification(''), 4000);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/assets/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      setDeletingId(null);
      setNotification('Startup asset permanently deleted from repository.');
      setTimeout(() => setNotification(''), 4000);
    }
  });

  if (authLoading || !user) return null;

  const filteredAssets = (assets || []).filter((a: any) =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.stage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAsset) return;
    const id = editingAsset._id || editingAsset.id;
    updateMutation.mutate({ id, updates: editingAsset });
  };

  return (
    <div className="w-full min-h-screen bg-navy-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-navy-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs font-semibold text-primary-light mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Institutional Portfolio Management</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Manage Startup Repository (`/items/manage`)</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Audit, edit metadata, or decommission assets across our autonomous deeptech deal-flow database.</p>
          </div>

          <Link href="/items/add" className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-bold text-xs shadow-md transition-all shrink-0">
            <PlusCircle className="w-4 h-4" />
            <span>Add New Startup Asset</span>
          </Link>
        </div>

        {notification && <div className="bg-secondary/20 border border-secondary/50 rounded-xl p-4 text-xs text-secondary flex items-center gap-2.5 font-bold animate-fadeIn"><CheckCircle2 className="w-5 h-5 text-secondary shrink-0" /><span>{notification}</span></div>}

        <div className="glass-panel rounded-2xl p-4 border border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input type="text" placeholder="Search assets by title, stage, or category..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-navy-950 border border-navy-700 focus:border-primary rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none" />
          </div>
          <span className="text-xs text-slate-400 font-medium">Showing <strong className="text-white">{filteredAssets.length}</strong> of <strong className="text-white">{assets?.length || 0}</strong> total assets</span>
        </div>

        <div className="glass-panel rounded-2xl border border-navy-800 overflow-hidden shadow-xl">
          {isLoading ? (
            <div className="p-12 text-center space-y-3 animate-pulse"><Cpu className="w-8 h-8 text-primary mx-auto animate-spin" /><span className="text-xs font-bold text-slate-300 block">Loading Portfolio Repository...</span></div>
          ) : error ? (
            <div className="p-8 text-center text-red-400 text-xs">⚠️ Could not load assets table. Please verify backend status.</div>
          ) : filteredAssets.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs space-y-3"><ShieldCheck className="w-10 h-10 text-slate-500 mx-auto" /><p className="font-bold text-white">No assets found</p><p>Try resetting your search query or add a new startup asset.</p></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-navy-950 border-b border-navy-800 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                    <th className="py-4 px-6">Asset Title & Founder</th>
                    <th className="py-4 px-4">Sector / Category</th>
                    <th className="py-4 px-4">Stage</th>
                    <th className="py-4 px-4">Valuation ($ USD)</th>
                    <th className="py-4 px-4">AI Score</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-800/80 text-xs">
                  {filteredAssets.map((asset: any) => {
                    const id = asset._id || asset.id;
                    const valuationInM = (Number(asset.valuation) / 1000000).toFixed(1);
                    return (
                      <tr key={id} className="hover:bg-navy-900/60 transition-colors group">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img src={asset.imageUrl} alt={asset.title} className="w-10 h-10 rounded-xl object-cover border border-navy-700 shrink-0" />
                            <div>
                              <Link href={`/items/${id}`} className="font-extrabold text-white hover:text-primary transition-colors block">{asset.title}</Link>
                              <span className="text-[10px] text-slate-400 block truncate max-w-xs">{asset.founder || 'Verified Founder'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4"><span className="px-2.5 py-1 rounded-lg bg-navy-950 border border-navy-700 font-bold text-slate-300 text-[11px]">{asset.category}</span></td>
                        <td className="py-4 px-4"><span className="px-2 py-0.5 rounded bg-primary/20 text-primary-light font-extrabold text-[10px] uppercase">{asset.stage}</span></td>
                        <td className="py-4 px-4 font-extrabold text-white">${valuationInM}M</td>
                        <td className="py-4 px-4"><span className="px-2.5 py-1 rounded-lg bg-secondary/20 text-secondary border border-secondary/40 font-extrabold text-[11px]">{asset.aiScore}/100</span></td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/items/${id}`} title="View details" className="p-2 rounded-lg bg-navy-950 hover:bg-primary/20 hover:text-primary text-slate-300 border border-navy-800 transition-colors"><Eye className="w-4 h-4" /></Link>
                            <button onClick={() => setEditingAsset(asset)} title="Edit asset" className="p-2 rounded-lg bg-navy-950 hover:bg-secondary/20 hover:text-secondary text-slate-300 border border-navy-800 transition-colors"><Edit3 className="w-4 h-4" /></button>
                            <button onClick={() => setDeletingId(id)} title="Delete asset" className="p-2 rounded-lg bg-navy-950 hover:bg-red-500/20 hover:text-red-400 text-slate-300 border border-navy-800 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {editingAsset && (
        <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="max-w-xl w-full bg-navy-900 border border-navy-700 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-navy-800 pb-3"><h3 className="font-extrabold text-base text-white">Edit Asset Metadata</h3><button onClick={() => setEditingAsset(null)} className="p-1 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button></div>
            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div><label className="block font-bold text-slate-300 mb-1">Startup Title</label><input type="text" required value={editingAsset.title} onChange={(e) => setEditingAsset({ ...editingAsset, title: e.target.value })} className="w-full p-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white focus:outline-none focus:border-primary" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block font-bold text-slate-300 mb-1">Valuation ($ USD)</label><input type="number" value={editingAsset.valuation} onChange={(e) => setEditingAsset({ ...editingAsset, valuation: Number(e.target.value) })} className="w-full p-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white focus:outline-none" /></div>
                <div><label className="block font-bold text-slate-300 mb-1">AI Safety Score (1-100)</label><input type="number" value={editingAsset.aiScore} onChange={(e) => setEditingAsset({ ...editingAsset, aiScore: Number(e.target.value) })} className="w-full p-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white focus:outline-none" /></div>
              </div>
              <div><label className="block font-bold text-slate-300 mb-1">Short Description</label><textarea rows={3} value={editingAsset.shortDescription} onChange={(e) => setEditingAsset({ ...editingAsset, shortDescription: e.target.value })} className="w-full p-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white focus:outline-none" /></div>
              <div className="flex gap-2 pt-2 border-t border-navy-800"><button type="button" onClick={() => setEditingAsset(null)} className="flex-1 py-2.5 rounded-xl bg-navy-800 text-slate-300 font-bold">Cancel</button><button type="submit" disabled={updateMutation.isPending} className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold shadow-md">{updateMutation.isPending ? 'Saving Updates...' : 'Save Updates'}</button></div>
            </form>
          </div>
        </div>
      )}

      {deletingId && (
        <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="max-w-sm w-full bg-navy-900 border border-red-500/40 rounded-3xl p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto"><AlertTriangle className="w-6 h-6" /></div>
            <h3 className="font-extrabold text-base text-white">Confirm Asset Deletion</h3>
            <p className="text-xs text-slate-300 leading-relaxed">Are you sure you want to remove this startup asset (`{deletingId.slice(0, 10)}...`) from the repository? This action cannot be undone.</p>
            <div className="flex gap-2 pt-2"><button type="button" onClick={() => setDeletingId(null)} className="flex-1 py-2.5 rounded-xl bg-navy-800 text-slate-300 text-xs font-bold">Cancel</button><button type="button" onClick={() => deleteMutation.mutate(deletingId)} disabled={deleteMutation.isPending} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md">{deleteMutation.isPending ? 'Deleting...' : 'Yes, Delete Asset'}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}