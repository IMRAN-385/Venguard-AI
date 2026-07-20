"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { BarChart3 } from 'lucide-react';

export const SectorChartSection: React.FC = () => {
  const [metricView, setMetricView] = useState<'valuation' | 'score'>('valuation');

  const chartData = [
    { sector: 'Generative AI', avgValuationM: 45.0, avgAiScore: 94, dealCount: 18, benchmarkMultiple: '14.2x ARR' },
    { sector: 'Quantum Computing', avgValuationM: 36.5, avgAiScore: 93, dealCount: 12, benchmarkMultiple: '12.8x ARR' },
    { sector: 'Biotech & Genomics', avgValuationM: 48.0, avgAiScore: 90, dealCount: 15, benchmarkMultiple: '9.4x ARR' },
    { sector: 'CleanTech & Fusion', avgValuationM: 96.0, avgAiScore: 92, dealCount: 9, benchmarkMultiple: '11.0x ARR' },
    { sector: 'Robotics & Automation', avgValuationM: 25.0, avgAiScore: 89, dealCount: 14, benchmarkMultiple: '8.5x ARR' },
  ];

  return (
    <section className="w-full bg-navy-950 border-b border-navy-800 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs font-semibold text-primary-light mb-3">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Sector Intelligence & Valuations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              DeepTech Valuation Multiples & AI Health Distribution
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-2xl">
              Compare average Series A/B valuations against institutional revenue multiples across verified autonomous asset categories.
            </p>
          </div>

          {/* Toggle controls */}
          <div className="flex items-center gap-2 bg-navy-900 p-1.5 rounded-xl border border-navy-800 shrink-0">
            <button
              onClick={() => setMetricView('valuation')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                metricView === 'valuation'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Average Valuation ($M)
            </button>
            <button
              onClick={() => setMetricView('score')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                metricView === 'score'
                  ? 'bg-secondary text-navy-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Average AI Score (1-100)
            </button>
          </div>
        </div>

        {/* Chart Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-8 bg-navy-900/80 rounded-2xl p-6 border border-navy-800 shadow-xl">
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                  <XAxis
                    dataKey="sector"
                    stroke="#64748B"
                    tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 600 }}
                  />
                  <YAxis
                    stroke="#64748B"
                    tick={{ fill: '#94A3B8', fontSize: 11 }}
                    domain={metricView === 'valuation' ? [0, 110] : [70, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#F8FAFC',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                    }}
                    formatter={(value: any) => [
                      metricView === 'valuation' ? `$${value}M USD` : `${value} / 100 Score`,
                      metricView === 'valuation' ? 'Avg Valuation' : 'Avg AI Health Score'
                    ]}
                  />
                  <Bar
                    dataKey={metricView === 'valuation' ? 'avgValuationM' : 'avgAiScore'}
                    radius={[8, 8, 0, 0]}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={metricView === 'valuation' ? (index % 2 === 0 ? '#3B82F6' : '#60A5FA') : '#10B981'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-navy-800 mt-2">
              <span>Data source: Vanguard AI Autonomous Real-Time Valuation Database</span>
              <span className="text-secondary font-bold">Updated Live</span>
            </div>
          </div>

          {/* Right side metric summary cards */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-navy-900/90 rounded-2xl p-5 border border-navy-800 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-slate-400">Top Growth Multiple</span>
                <span className="px-2 py-0.5 rounded bg-primary/20 text-primary-light font-bold text-[11px]">Generative AI</span>
              </div>
              <div className="text-2xl font-extrabold text-white">14.2x Projected ARR</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Generative AI and hybrid quantum compilation models continue to trade at premium multiples due to 40%+ quarterly top-line expansion.
              </p>
            </div>

            <div className="bg-navy-900/90 rounded-2xl p-5 border border-navy-800 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-slate-400">Highest Safety Hurdle</span>
                <span className="px-2 py-0.5 rounded bg-secondary/20 text-secondary font-bold text-[11px]">94 / 100 Score</span>
              </div>
              <div className="text-xl font-extrabold text-white">QuantumScale & Aetheria</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Our autonomous audit engine verified zero high-severity IP conflicts or cap-table overhangs across the top quartile of Series A allocations.
              </p>
            </div>

            <div className="bg-gradient-to-r from-primary/15 to-secondary/15 border border-primary/30 rounded-2xl p-4 text-xs text-slate-200 flex items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="font-bold text-white block">Need Custom Sector Analysis?</span>
                <span className="text-slate-400">Upload CSV financials to our Data Analyzer for instant benchmarking.</span>
              </div>
              <Link
                href="/ai/analyzer"
                className="px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold shrink-0 transition-all shadow-sm"
              >
                Analyze CSV
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};