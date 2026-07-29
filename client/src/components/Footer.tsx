import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";

const columns = [
  {
    title: "Platform",
    links: [
      { label: "Explore Startups", href: "/explore" },
      { label: "Vanguard Copilot", href: "/ai/copilot" },
      { label: "Data Analyzer", href: "/ai/analyzer" },
      { label: "Memo Generator", href: "/ai/generator" },
    ],
  },
  {
    title: "Institutional",
    links: [
      { label: "About Vanguard", href: "/about" },
      { label: "Pricing", href: "/pricing" },
      { label: "Documentation", href: "/docs" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Investor",
    links: [
      { label: "Portfolio", href: "/portfolio" },
      { label: "Manage Assets", href: "/items/manage" },
      { label: "Settings", href: "/settings" },
      { label: "Sign In", href: "/login" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-ink-600/40 mt-24">
      <div className="container-x py-20">
        {/* Top: giant wordmark */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 pb-16 border-b border-ink-600/40">
          <div>
            <p className="eyebrow mb-6">[ End of transmission ]</p>
            <h2 className="display-serif text-display-lg max-w-2xl">
              Fund the future.<br />
              <span className="italic text-bone-200">Verified by agents.</span>
            </h2>
          </div>
          <Link href="/register" className="btn-accent whitespace-nowrap">
            Request Access <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-16">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <span className="text-ink-950 font-bold text-sm">V</span>
              </div>
              <span className="font-display text-xl">
                Vanguard<span className="text-accent">.</span>
              </span>
            </Link>
            <p className="text-sm text-bone-300 leading-relaxed max-w-xs">
              Autonomous deeptech due diligence — programmatic, verifiable, institutional.
            </p>
           <div className="flex items-center gap-3 mt-6">
  <a
    href="#"
    className="w-9 h-9 rounded-full border border-ink-600/60 flex items-center justify-center text-bone-200 hover:bg-ink-800 transition"
  >
    <FaGithub className="w-4 h-4" />
  </a>

  <a
    href="#"
    className="w-9 h-9 rounded-full border border-ink-600/60 flex items-center justify-center text-bone-200 hover:bg-ink-800 transition"
  >
    <FaXTwitter className="w-4 h-4" />
  </a>

  <a
    href="#"
    className="w-9 h-9 rounded-full border border-ink-600/60 flex items-center justify-center text-bone-200 hover:bg-ink-800 transition"
  >
    <FaLinkedin className="w-4 h-4" />
  </a>
</div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="eyebrow mb-5">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-bone-200 hover:text-accent transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-ink-600/40 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-xs text-bone-400 font-mono">
            © 2026 Vanguard AI · Autonomous Due Diligence Platform v4.2
          </p>
          <div className="flex items-center gap-6 text-xs text-bone-400">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              6 agents online · Chattogram HQ
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}