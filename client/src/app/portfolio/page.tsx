"use client";

import Link from "next/link";
import { TrendingUp, TrendingDown, DollarSign, Target, ArrowUpRight, PieChart as PieIcon } from "lucide-react";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardShell } from "@/components/DashboardShell";
import { useAuth } from "@/context/AuthContext";

const kpis = [
  { label: "Portfolio value",   value: "$18.4M", delta: "+12.4%", positive: true,  icon: DollarSign },
  { label: "Active positions",  value: "24",     delta: "+3",     positive: true,  icon: Target },
  { label: "MTD performance",   value: "+4.2%",  delta: "+1.1%",  positive: true,  icon: TrendingUp },
  { label: "Watchlist risk",    value: "Med",    delta: "-2pts",  positive: true,  icon: TrendingDown },
];

const allocation = [
  { name: "Quantum",   value: 32, fill: "#D7FF3A" },
  { name: "BioTech",   value: 24, fill: "#EDEDE6" },
  { name: "Fusion",    value: 18, fill: "#C8C8BF" },
  { name: "Robotics",  value: 14, fill: "#8A8A80" },
  { name: "Neural",    value: 12, fill: "#5A5A54" },
];

const performance = [
  { month: "Jan", nav: 14.2, bench: 14.0 },
  { month: "Feb", nav: 14.8, bench: 14.3 },
  { month: "Mar", nav: 15.4, bench: 14.5 },
  { month: "Apr", nav: 16.1, bench: 14.8 },
  { month: "May", nav: 17.3, bench: 15.1 },
  { month: "Jun", nav: 18.4, bench: 15.4 },
];

const holdings = [
  { name: "Neuralink Cortex Labs",  sector: "Neural",   value: "$4.2M", change: "+18%" },
  { name: "AtomFusion Reactors",    sector: "Fusion",   value: "$3.8M", change: "+24%" },
  { name: "Quantum Bio Systems",    sector: "BioTech",  value: "$2.9M", change: "-4%"  },
  { name: "Helion Compute",         sector: "Quantum",  value: "$2.4M", change: "+11%" },
  { name: "Boreal Robotics Inc",    sector: "Robotics", value: "$2.1M", change: "+7%"  },
];

const tooltipStyle = {
  background: "#17171C",
  border: "1px solid #2A2A32",
  borderRadius: "12px",
  padding: "8px 12px",
  color: "#FAFAF7",
  fontSize: "12px",
};

export default function PortfolioPage() {
  return (
    <ProtectedRoute>
      <DashboardShell>
        <PortfolioInner />
      </DashboardShell>
    </ProtectedRoute>
  );
}

function PortfolioInner() {
  const { user } = useAuth();

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="eyebrow mb-3">[ Investor cockpit ]</p>
        <h1 className="display-serif text-4xl md:text-5xl mb-2">
          Welcome back, <span className="italic text-bone-200">{user?.name?.split(" ")[0] ?? "Analyst"}</span>.
        </h1>
        <p className="text-bone-300">Live snapshot of your deeptech allocations · updated 42 seconds ago.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="panel p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="eyebrow">{k.label}</span>
                <Icon className={`w-4 h-4 ${k.positive ? "text-accent" : "text-orange-400"}`} />
              </div>
              <div className="font-display text-4xl text-bone-50 mb-1">{k.value}</div>
              <div className={`text-xs font-mono ${k.positive ? "text-accent" : "text-orange-400"}`}>
                {k.delta} vs last period
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-12 gap-5 mb-6">
        {/* Performance line */}
        <div className="lg:col-span-8 panel p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display text-2xl text-bone-50">NAV vs benchmark</h3>
              <p className="text-xs text-bone-300 font-mono mt-1">6M · $M</p>
            </div>
            <span className="tag-accent">Outperforming +19.4%</span>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A32" vertical={false} />
                <XAxis dataKey="month" stroke="#8A8A80" fontSize={12} />
                <YAxis stroke="#8A8A80" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12, color: "#8A8A80" }} />
                <Line type="monotone" dataKey="nav"   stroke="#D7FF3A" strokeWidth={2.5} dot={{ fill: "#D7FF3A" }} name="Your NAV" />
                <Line type="monotone" dataKey="bench" stroke="#8A8A80" strokeWidth={2}   dot={false} strokeDasharray="4 4" name="Benchmark" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Allocation pie */}
        <div className="lg:col-span-4 panel p-8">
          <div className="flex items-center gap-2 mb-6">
            <PieIcon className="w-4 h-4 text-accent" />
            <h3 className="font-display text-2xl text-bone-50">Allocation</h3>
          </div>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={allocation} dataKey="value" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {allocation.map((e) => <Cell key={e.name} fill={e.fill} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {allocation.map((a) => (
              <div key={a.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: a.fill }} />
                  <span className="text-bone-200">{a.name}</span>
                </div>
                <span className="text-bone-400 font-mono">{a.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top holdings */}
      <div className="panel p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-2xl text-bone-50">Top holdings</h3>
          <Link href="/items/manage" className="btn-link">
            Manage all <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-2">
          {holdings.map((h, i) => (
            <div key={h.name} className="flex items-center justify-between p-4 rounded-2xl bg-ink-800/60 border border-ink-600/40 hover:bg-ink-800 transition">
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-bone-400 w-6">0{i + 1}</span>
                <div>
                  <div className="text-sm font-medium text-bone-50">{h.name}</div>
                  <div className="text-xs text-bone-300">{h.sector}</div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-sm text-bone-100 font-mono">{h.value}</span>
                <span className={`text-xs font-mono ${h.change.startsWith("-") ? "text-orange-400" : "text-accent"}`}>
                  {h.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}