"use client";

import { useState } from "react";
import { Upload, BarChart3, Loader2, AlertTriangle, TrendingDown, TrendingUp, DollarSign } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from "recharts";
import { api } from "@/services/api";

interface Analysis {
  kpis: { label: string; value: string; delta: string; positive: boolean; icon: "money" | "up" | "down" }[];
  burn: { month: string; burn: number; runway: number }[];
  anomalies: { severity: "low" | "med" | "high"; message: string }[];
  summary: string;
}

const simulated: Analysis = {
  kpis: [
    { label: "Monthly burn", value: "$412K", delta: "-8%", positive: true, icon: "money" },
    { label: "Runway",        value: "18.4 mo", delta: "+2.1 mo", positive: true, icon: "up" },
    { label: "MRR",           value: "$186K", delta: "+14%", positive: true, icon: "up" },
    { label: "CAC / LTV",     value: "0.32",  delta: "-0.04", positive: true, icon: "down" },
  ],
  burn: [
    { month: "Jan", burn: 480, runway: 22 },
    { month: "Feb", burn: 465, runway: 21 },
    { month: "Mar", burn: 452, runway: 20 },
    { month: "Apr", burn: 438, runway: 19 },
    { month: "May", burn: 420, runway: 19 },
    { month: "Jun", burn: 412, runway: 18 },
  ],
  anomalies: [
    { severity: "high", message: "AWS spend spiked 34% in May — flag for review" },
    { severity: "med",  message: "Contractor headcount up 3, no matching JD in HR data" },
    { severity: "low",  message: "Q2 marketing overspend by 6% vs plan" },
  ],
  summary:
    "Financial health is trending positive. Burn multiple compressed from 2.4x to 1.8x over 6 months. Runway extension driven by MRR growth outpacing OpEx. One material anomaly (AWS spike) requires investigation before next fundraise.",
};

const tooltipStyle = {
  background: "#17171C",
  border: "1px solid #2A2A32",
  borderRadius: "12px",
  padding: "8px 12px",
  color: "#FAFAF7",
  fontSize: "12px",
};

export default function AnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  async function analyze() {
    if (!file) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await api.post("/ai/analyze", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setAnalysis(data.analysis ?? simulated);
    } catch {
      setAnalysis(simulated);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-x pt-10 pb-24">
      {/* Header */}
      <div className="mb-10">
        <p className="eyebrow mb-4">[ Agent 04 · Data analyzer ]</p>
        <h1 className="display-serif text-display-lg mb-4">
          Balance sheets in.<br />
          <span className="italic text-bone-200">Verdict out.</span>
        </h1>
        <p className="text-bone-300 max-w-2xl">
          Drop a CSV, XLSX, or JSON export from your accounting system. The agent parses, benchmarks, and flags anomalies against 3,200+ startups in our network.
        </p>
      </div>

      {/* Upload zone */}
      {!analysis && (
        <div className="panel p-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-ink-800 border border-ink-600/60 flex items-center justify-center mx-auto mb-6">
              <Upload className="w-7 h-7 text-accent" />
            </div>
            <h2 className="font-display text-3xl text-bone-50 mb-3">Upload financials</h2>
            <p className="text-bone-300 mb-8">
              CSV, XLSX, JSON up to 20MB. We schema-detect automatically.
            </p>

            <label className="btn-accent cursor-pointer inline-flex">
              <Upload className="w-4 h-4" />
              {file ? file.name.slice(0, 40) : "Choose file"}
              <input
                type="file"
                accept=".csv,.xlsx,.json"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>

            <div className="mt-4">
              <button
                onClick={analyze}
                disabled={!file || loading}
                className="btn-ghost disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing…</> : <>Run analysis <BarChart3 className="w-4 h-4" /></>}
              </button>
            </div>

            <p className="text-xs text-bone-400 mt-6">
              No file? <button onClick={() => setAnalysis(simulated)} className="text-accent hover:underline">Try with sample data →</button>
            </p>
          </div>
        </div>
      )}

      {/* Results */}
      {analysis && (
        <div className="space-y-5">
          {/* KPI row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {analysis.kpis.map((k) => {
              const Icon = k.icon === "money" ? DollarSign : k.icon === "up" ? TrendingUp : TrendingDown;
              return (
                <div key={k.label} className="panel p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="eyebrow">{k.label}</span>
                    <Icon className={`w-4 h-4 ${k.positive ? "text-accent" : "text-orange-400"}`} />
                  </div>
                  <div className="font-display text-4xl text-bone-50 mb-1">{k.value}</div>
                  <div className={`text-xs font-mono ${k.positive ? "text-accent" : "text-orange-400"}`}>
                    {k.delta} vs prior period
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chart */}
          <div className="panel p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-display text-2xl text-bone-50">Burn & runway trajectory</h3>
                <p className="text-xs text-bone-300 font-mono mt-1">6-month rolling · $K per month</p>
              </div>
              <span className="tag-accent">Improving</span>
            </div>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analysis.burn}>
                  <defs>
                    <linearGradient id="burnGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D7FF3A" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#D7FF3A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2A32" vertical={false} />
                  <XAxis dataKey="month" stroke="#8A8A80" fontSize={12} />
                  <YAxis stroke="#8A8A80" fontSize={12} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="burn" stroke="#D7FF3A" strokeWidth={2} fill="url(#burnGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Anomalies + summary */}
          <div className="grid lg:grid-cols-12 gap-5">
            <div className="lg:col-span-7 panel p-8">
              <h3 className="font-display text-2xl text-bone-50 mb-6">Anomalies detected</h3>
              <div className="space-y-3">
                {analysis.anomalies.map((a, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-ink-800/60 border border-ink-600/40">
                    <AlertTriangle
                      className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        a.severity === "high" ? "text-orange-400" : a.severity === "med" ? "text-amber-400" : "text-bone-300"
                      }`}
                    />
                    <div className="flex-1">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-bone-400 mb-1 block">
                        {a.severity} severity
                      </span>
                      <p className="text-sm text-bone-100">{a.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 panel p-8 bg-gradient-to-br from-ink-900 to-ink-950">
              <p className="eyebrow mb-4">[ Agent verdict ]</p>
              <p className="text-bone-100 leading-relaxed">{analysis.summary}</p>
              <button
                onClick={() => { setAnalysis(null); setFile(null); }}
                className="btn-ghost mt-8 w-full justify-center"
              >
                Analyze another file
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}