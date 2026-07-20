"use client";

import React from 'react';
import { ShieldCheck, Cpu, RefreshCw, Sparkles } from 'lucide-react';

export const LiveAgentFeed: React.FC = () => {
  const feedItems = [
    {
      id: 'feed_1',
      agent: 'Vanguard-IP-Audit-Agent v4.2',
      action: 'Verified 3 new hybrid tensor compilation patents for',
      target: 'QuantumScale Neural Labs',
      status: 'Verified',
      time: '2 mins ago',
      icon: ShieldCheck,
      color: 'text-secondary'
    },
    {
      id: 'feed_2',
      agent: 'Vanguard-CapTable-Auditor v3.9',
      action: 'Recalculated 24-month operating runway reserve for',
      target: 'CogniMesh Autonomous Robotics',
      status: 'Pass',
      time: '7 mins ago',
      icon: Cpu,
      color: 'text-primary-light'
    },
    {
      id: 'feed_3',
      agent: 'Vanguard-Bio-Regulatory-Agent v3.8',
      action: 'Confirmed Phase 1 EMA safety dossier verification for',
      target: 'Aetheria Synthetic Biology',
      status: 'Verified',
      time: '14 mins ago',
      icon: ShieldCheck,
      color: 'text-secondary'
    },
    {
      id: 'feed_4',
      agent: 'Vanguard-Financial-Anomaly-Detector',
      action: 'Simulated +25% cloud infrastructure cost inflation for',
      target: 'Helios Plasma Fusion Power',
      status: 'Pass',
      time: '22 mins ago',
      icon: RefreshCw,
      color: 'text-primary'
    }
  ];

  return (
    <section className="w-full bg-navy-950 border-b border-navy-800 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left Label */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-secondary/20 border border-secondary/40 flex items-center justify-center text-secondary">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              Live Autonomous Agent Feed
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            </span>
            <span className="text-[11px] text-slate-400">Continuous 24/7 DeepTech Due Diligence Execution</span>
          </div>
        </div>

        {/* Ticker / Feed Cards */}
        <div className="flex-1 w-full md:w-auto overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {feedItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="bg-navy-900/90 border border-navy-800 rounded-xl p-3 hover:border-primary/40 transition-all shadow-sm flex items-start gap-2.5"
                >
                  <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${item.color}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                      <span className="font-semibold text-slate-300 truncate">{item.agent}</span>
                      <span>{item.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
                      {item.action} <span className="font-bold text-white">{item.target}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};