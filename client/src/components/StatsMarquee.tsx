"use client";

const stats = [
  { label: "Memos generated", value: "12,847" },
  { label: "Startups verified", value: "3,204" },
  { label: "Patent filings ingested", value: "148K+" },
  { label: "GitHub repos analyzed", value: "27K" },
  { label: "Avg. diligence time", value: "4.2 min" },
  { label: "Institutional LPs", value: "89" },
  { label: "Sectors covered", value: "22" },
  { label: "Uptime SLA", value: "99.97%" },
];

export function StatsMarquee() {
  return (
    <section className="py-12 border-y border-ink-600/40 bg-ink-900/50 overflow-hidden">
      <div className="flex gap-16 animate-marquee whitespace-nowrap">
        {[...stats, ...stats].map((s, i) => (
          <div key={i} className="flex items-baseline gap-3 flex-shrink-0">
            <span className="font-display text-3xl text-bone-50">{s.value}</span>
            <span className="text-xs uppercase tracking-widest text-bone-300">
              {s.label}
            </span>
            <span className="text-accent ml-4">✦</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
      `}</style>
    </section>
  );
}