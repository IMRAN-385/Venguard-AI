"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import { PlusCircle, Sparkles, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function AddAssetPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [valuation, setValuation] = useState<number>(30000000);
  const [stage, setStage] = useState('Series A');
  const [category, setCategory] = useState('Generative AI');
  const [location, setLocation] = useState('San Francisco, CA / Global Remote');
  const [aiScore, setAiScore] = useState<number>(90);
  const [arr, setArr] = useState<number>(3500000);
  const [monthlyBurn, setMonthlyBurn] = useState<number>(250000);
  const [imageUrl, setImageUrl] = useState('');
  const [tags, setTags] = useState<string[]>(['Generative AI', 'Autonomous-Verified']);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiEnhancing, setIsAiEnhancing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) return null;

  const presetImages = [
    { label: 'DeepTech / Quantum Cover', url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80' },
    { label: 'Biopharma / Lab Cover', url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80' },
    { label: 'Robotics / Automation Cover', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80' },
    { label: 'CleanTech / Fusion Cover', url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80' },
  ];

  const handleAiAutoEnhance = async () => {
    if (!title || !shortDescription) {
      setErrorMsg('Please enter at least a Startup Title and Short Description before running AI enhancement.');
      return;
    }
    setErrorMsg('');
    setIsAiEnhancing(true);

    try {
      const response = await api.post('/ai/classify', {
        title,
        description: fullDescription || shortDescription,
        category
      });
      const { tags: aiTags, enhancedDescription } = response.data;
      if (aiTags && aiTags.length > 0) setTags(aiTags);
      if (enhancedDescription) setFullDescription(enhancedDescription);
    } catch (err) {
      setErrorMsg('Could not reach AI classification endpoint. Please check connection.');
    } finally {
      setIsAiEnhancing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!title || !shortDescription) {
      setErrorMsg('Please fill out Title and Short Description.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/assets', {
        title,
        shortDescription,
        fullDescription: fullDescription || shortDescription,
        valuation: Number(valuation),
        stage,
        category,
        location,
        aiScore: Number(aiScore),
        arr: Number(arr),
        monthlyBurn: Number(monthlyBurn),
        imageUrl: imageUrl || presetImages[0].url,
        tags
      });

      setSuccessMsg('Startup asset successfully onboarded to Vanguard AI repository!');
      setTimeout(() => router.push('/items/manage'), 1500);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Error submitting startup asset.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-navy-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-navy-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs font-semibold text-primary-light mb-2">
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Institutional Asset Onboarding</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Add Verified Startup Asset</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Submit your portfolio company or target pitch deck metadata into our autonomous due diligence engine.</p>
          </div>

          <button type="button" onClick={handleAiAutoEnhance} disabled={isAiEnhancing} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-secondary/20 to-primary/20 hover:from-secondary/30 hover:to-primary/30 border border-secondary/50 text-secondary font-bold text-xs shadow-md transition-all shrink-0">
            {isAiEnhancing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>AI Auto-Enhance & Tag Asset (`Feature E`)</span>
          </button>
        </div>

        {errorMsg && <div className="bg-red-500/15 border border-red-500/40 rounded-xl p-3 text-xs text-red-300 flex items-start gap-2.5"><AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" /><span>{errorMsg}</span></div>}
        {successMsg && <div className="bg-secondary/20 border border-secondary/50 rounded-xl p-4 text-xs text-secondary flex items-center gap-2.5 font-bold"><CheckCircle2 className="w-5 h-5 text-secondary shrink-0" /><span>{successMsg} Redirecting to Manage Assets...</span></div>}

        <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-6 sm:p-8 border border-navy-800 shadow-xl space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Startup Title / Company Name *</label>
              <input type="text" required placeholder="e.g., QuantumScale Neural Labs" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 bg-navy-950 border border-navy-700 focus:border-primary rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Short Description (for Card Grid View) *</label>
              <input type="text" required placeholder="e.g., Fault-tolerant quantum-classical hybrid compiler reducing LLM training latency by 72%." value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} className="w-full px-4 py-3 bg-navy-950 border border-navy-700 focus:border-primary rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Full Pitch Description & Technical Overview</label>
              <textarea rows={5} placeholder="Detailed explanation of the startup's problem, proprietary solution, founder background, and verified commercial traction..." value={fullDescription} onChange={(e) => setFullDescription(e.target.value)} className="w-full p-4 bg-navy-950 border border-navy-700 focus:border-primary rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Pre-Money Valuation ($ USD) *</label>
              <input type="number" required value={valuation} onChange={(e) => setValuation(Number(e.target.value))} className="w-full px-4 py-3 bg-navy-950 border border-navy-700 focus:border-primary rounded-xl text-xs text-white focus:outline-none transition-all" />
              <span className="text-[10px] text-slate-400 mt-1 block">Formatted: ${(valuation / 1000000).toFixed(1)}M USD</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Funding Stage *</label>
              <select value={stage} onChange={(e) => setStage(e.target.value)} className="w-full px-4 py-3 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white focus:outline-none focus:border-primary cursor-pointer">
                <option value="Pre-Seed">Pre-Seed</option>
                <option value="Seed">Seed</option>
                <option value="Series A">Series A</option>
                <option value="Series B">Series B</option>
                <option value="Growth">Growth</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Sector / Category *</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white focus:outline-none focus:border-primary cursor-pointer">
                <option value="Generative AI">Generative AI</option>
                <option value="Quantum Computing">Quantum Computing</option>
                <option value="Biotech & Genomics">Biotech & Genomics</option>
                <option value="Robotics & Automation">Robotics & Automation</option>
                <option value="CleanTech & Fusion">CleanTech & Fusion</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Headquarters / Location *</label>
              <input type="text" required value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-4 py-3 bg-navy-950 border border-navy-700 focus:border-primary rounded-xl text-xs text-white focus:outline-none transition-all" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Initial AI Safety Score (1-100) *</label>
              <input type="number" min="1" max="100" value={aiScore} onChange={(e) => setAiScore(Number(e.target.value))} className="w-full px-4 py-3 bg-navy-950 border border-navy-700 focus:border-primary rounded-xl text-xs text-white focus:outline-none transition-all" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div><label className="block text-xs font-bold text-slate-300 mb-1.5">Current ARR ($)</label><input type="number" value={arr} onChange={(e) => setArr(Number(e.target.value))} className="w-full px-3 py-3 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white focus:outline-none" /></div>
              <div><label className="block text-xs font-bold text-slate-300 mb-1.5">Monthly Burn ($)</label><input type="number" value={monthlyBurn} onChange={(e) => setMonthlyBurn(Number(e.target.value))} className="w-full px-3 py-3 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white focus:outline-none" /></div>
            </div>

            <div className="sm:col-span-2 space-y-2">
              <label className="block text-xs font-bold text-slate-300">Cover Image URL (Optional)</label>
              <input type="text" placeholder="https://..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full px-4 py-3 bg-navy-950 border border-navy-700 focus:border-primary rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all" />
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-[11px] text-slate-400 font-semibold py-1">Quick Presets:</span>
                {presetImages.map((preset, idx) => <button key={idx} type="button" onClick={() => setImageUrl(preset.url)} className="px-2.5 py-1 rounded-lg bg-navy-900 border border-navy-700 hover:border-primary text-[10px] text-slate-300 transition-colors">{preset.label}</button>)}
              </div>
            </div>
          </div>

          <div className="p-4 bg-navy-950/80 rounded-2xl border border-navy-800 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Assigned AI Tags</span>
            <div className="flex flex-wrap gap-2">{tags.map((tag, idx) => <span key={idx} className="px-3 py-1 rounded-lg bg-navy-900 border border-navy-700 text-xs font-bold text-secondary">#{tag}</span>)}</div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-extrabold text-sm shadow-[0_0_25px_rgba(59,130,246,0.35)] transition-all flex items-center justify-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            <span>{isSubmitting ? 'Onboarding Asset...' : 'Submit Startup Asset to Repository'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}