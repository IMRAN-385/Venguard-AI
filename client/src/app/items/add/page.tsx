"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Loader2, CheckCircle2, Upload, Sparkles } from "lucide-react";
import { api } from "@/services/api";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardShell } from "@/components/DashboardShell";

const sectors = ["Quantum", "BioTech", "Fusion", "Robotics", "SpaceTech", "Neural", "Climate", "Defense"];
const stages  = ["Pre-Seed", "Seed", "Series A", "Series B", "Series C+"];

interface FormState {
  title: string;
  sector: string;
  stage: string;
  valuation: string;
  shortDescription: string;
  longDescription: string;
  image: string;
  patents: string;
  founded: string;
  hq: string;
  website: string;
}

const initialForm: FormState = {
  title: "", sector: sectors[0], stage: stages[0], valuation: "",
  shortDescription: "", longDescription: "", image: "",
  patents: "", founded: "", hq: "", website: "",
};

export default function AddAssetPage() {
  return (
    <ProtectedRoute>
      <DashboardShell>
        <AddAssetInner />
      </DashboardShell>
    </ProtectedRoute>
  );
}

function AddAssetInner() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function update<K extends keyof FormState>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function autoClassify() {
    if (!form.shortDescription.trim()) return;
    setAiLoading(true);
    try {
      const { data } = await api.post("/ai/classify", { text: form.shortDescription });
      if (data.sector) update("sector", data.sector);
    } catch {
      // simulated
      const guess = sectors[Math.floor(Math.random() * sectors.length)];
      update("sector", guess);
    } finally {
      setAiLoading(false);
    }
  }

  async function submit() {
    setLoading(true);
    try {
      await api.post("/assets", {
        ...form,
        valuation: Number(form.valuation) || 0,
        patents:   Number(form.patents)   || 0,
        founded:   Number(form.founded)   || new Date().getFullYear(),
      });
      setSuccess(true);
      setTimeout(() => router.push("/items/manage"), 1500);
    } catch {
      alert("Failed to create asset — backend offline.");
    } finally {
      setLoading(false);
    }
  }

  const canNext =
    (step === 1 && form.title && form.shortDescription) ||
    (step === 2 && form.valuation && form.stage) ||
    step === 3;

  if (success) {
    return (
      <div className="panel p-16 text-center">
        <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-ink-950" />
        </div>
        <h2 className="font-display text-3xl text-bone-50 mb-2">Asset submitted</h2>
        <p className="text-bone-300">Redirecting to Manage Assets…</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="eyebrow mb-3">[ Add to network ]</p>
        <h1 className="display-serif text-4xl md:text-5xl mb-3">List a new asset.</h1>
        <p className="text-bone-300 max-w-2xl">
          Submit a startup for agent verification. Auto-classification runs on save.
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex-1 flex items-center gap-2">
            <div
              className={`flex-1 h-1 rounded-full transition ${
                step >= s ? "bg-accent" : "bg-ink-700"
              }`}
            />
            <span className={`text-[10px] font-mono ${step >= s ? "text-accent" : "text-bone-400"}`}>
              0{s}
            </span>
          </div>
        ))}
      </div>

      <div className="panel p-8 md:p-12">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl text-bone-50">Basics</h2>

            <div>
              <label className="eyebrow block mb-2">Company name</label>
              <input className="field" value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Neuralink Cortex Labs" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="eyebrow">One-line pitch</label>
                <button
                  onClick={autoClassify}
                  disabled={!form.shortDescription || aiLoading}
                  className="text-[11px] text-accent hover:underline font-mono disabled:opacity-40 flex items-center gap-1"
                >
                  {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  auto-classify sector
                </button>
              </div>
              <textarea
                rows={2}
                className="field resize-none"
                value={form.shortDescription}
                onChange={(e) => update("shortDescription", e.target.value)}
                placeholder="Frontier BCI platform for high-throughput neural interfaces."
              />
            </div>

            <div>
              <label className="eyebrow block mb-2">Long description</label>
              <textarea
                rows={5}
                className="field resize-none"
                value={form.longDescription}
                onChange={(e) => update("longDescription", e.target.value)}
                placeholder="Thesis, tech moat, team pedigree, traction…"
              />
            </div>

            <div>
              <label className="eyebrow block mb-2">Hero image URL</label>
              <div className="flex gap-2">
                <input
                  className="field flex-1"
                  value={form.image}
                  onChange={(e) => update("image", e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                />
                <button type="button" className="btn-ghost">
                  <Upload className="w-4 h-4" /> Upload
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl text-bone-50">Financials & stage</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="eyebrow block mb-2">Sector</label>
                <select className="field" value={form.sector} onChange={(e) => update("sector", e.target.value)}>
                  {sectors.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="eyebrow block mb-2">Stage</label>
                <select className="field" value={form.stage} onChange={(e) => update("stage", e.target.value)}>
                  {stages.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="eyebrow block mb-2">Valuation (USD)</label>
                <input
                  type="number"
                  className="field"
                  value={form.valuation}
                  onChange={(e) => update("valuation", e.target.value)}
                  placeholder="45000000"
                />
              </div>
              <div>
                <label className="eyebrow block mb-2">Patents filed</label>
                <input
                  type="number"
                  className="field"
                  value={form.patents}
                  onChange={(e) => update("patents", e.target.value)}
                  placeholder="7"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl text-bone-50">Company details</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="eyebrow block mb-2">Founded</label>
                <input
                  type="number"
                  className="field"
                  value={form.founded}
                  onChange={(e) => update("founded", e.target.value)}
                  placeholder="2021"
                />
              </div>
              <div>
                <label className="eyebrow block mb-2">HQ</label>
                <input
                  className="field"
                  value={form.hq}
                  onChange={(e) => update("hq", e.target.value)}
                  placeholder="San Francisco, CA"
                />
              </div>
              <div className="md:col-span-2">
                <label className="eyebrow block mb-2">Website</label>
                <input
                  className="field"
                  value={form.website}
                  onChange={(e) => update("website", e.target.value)}
                  placeholder="https://neuralink.com"
                />
              </div>
            </div>

            {/* Review */}
            <div className="mt-8 p-6 rounded-2xl bg-ink-800/60 border border-ink-600/40">
              <p className="eyebrow mb-3">Review summary</p>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <span className="text-bone-400">Name</span>          <span className="text-bone-100">{form.title || "—"}</span>
                <span className="text-bone-400">Sector · Stage</span> <span className="text-bone-100">{form.sector} · {form.stage}</span>
                <span className="text-bone-400">Valuation</span>      <span className="text-bone-100">${Number(form.valuation || 0).toLocaleString()}</span>
                <span className="text-bone-400">HQ</span>              <span className="text-bone-100">{form.hq || "—"}</span>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-ink-600/40">
          <button
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="btn-ghost disabled:opacity-30"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {step < 3 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext}
              className="btn-accent disabled:opacity-40"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={loading}
              className="btn-accent disabled:opacity-40"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : <>Submit for verification <CheckCircle2 className="w-4 h-4" /></>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}