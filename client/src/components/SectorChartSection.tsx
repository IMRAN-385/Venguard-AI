"use client";

import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const sectorData = [
  { sector: "Quantum",   deals: 42, fill: "#D7FF3A" },
  { sector: "BioTech",   deals: 38, fill: "#EDEDE6" },
  { sector: "Fusion",    deals: 29, fill: "#C8C8BF" },
  { sector: "Robotics",  deals: 24, fill: "#8A8A80" },
  { sector: "SpaceTech", deals: 18, fill: "#5A5A54" },
  { sector: "Neural",    deals: 15, fill: "#3A3A44" },
];

const radialData = [
  { name: "Verified", value: 82, fill: "#D7FF3A" },
];

const tooltipStyle = {
  background: "#17171C",
  border: "1px solid #2A2A32",
  borderRadius: "12px",
  padding: "8px 12px",
  color: "#FAFAF7",
  fontSize: "12px",
  fontFamily: "JetBrains Mono, monospace",
};

export function SectorChartSection() {
  return (
    <section className="section">
      <div className="container-x">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <p className="eyebrow mb-4">[ Sector intelligence ]</p>
            <h2 className="display-serif text-display-lg max-w-2xl">
              Where capital<br />
              <span className="italic text-bone-200">meets frontier tech.</span>
            </h2>
          </div>
          <p className="text-bone-300 text-sm max-w-sm">
            Live sector breakdown from the last 90 days of verified deal-flow across the Vanguard mesh.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-5">
          {/* Left: Bar chart */}
          <div className="lg:col-span-8 panel p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-display text-2xl text-bone-50">Deal flow by sector</h3>
                <p className="text-xs text-bone-300 mt-1 font-mono">last 90 days · n = 166</p>
              </div>
              <span className="tag-accent">Live</span>
            </div>

            <div className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sectorData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2A32" vertical={false} />
                  <XAxis
                    dataKey="sector"
                    tick={{ fill: "#8A8A80", fontSize: 12, fontFamily: "Inter" }}
                    axisLine={{ stroke: "#2A2A32" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#8A8A80", fontSize: 12, fontFamily: "Inter" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#1F1F26" }} />
                  <Bar dataKey="deals" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right: Radial verification rate */}
          <div className="lg:col-span-4 panel p-8 flex flex-col">
            <div className="mb-4">
              <h3 className="font-display text-2xl text-bone-50">Verification rate</h3>
              <p className="text-xs text-bone-300 mt-1 font-mono">agent-cross-checked</p>
            </div>

            <div className="flex-1 flex items-center justify-center relative">
              <div className="w-full h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    innerRadius="70%"
                    outerRadius="100%"
                    data={radialData}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                    <RadialBar background={{ fill: "#1F1F26" }} dataKey="value" cornerRadius={20} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="font-display text-6xl text-bone-50">82<span className="text-accent">%</span></span>
                <span className="text-xs text-bone-300 uppercase tracking-widest mt-1">Verified</span>
              </div>
            </div>

            <div className="pt-6 border-t border-ink-600/40 flex items-center justify-between text-xs text-bone-300">
              <span>3,204 startups</span>
              <span className="font-mono">+12% MoM</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}