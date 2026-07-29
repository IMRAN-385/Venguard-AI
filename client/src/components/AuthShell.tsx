import Link from "next/link";
import { ShieldCheck } from "lucide-react";

interface Props {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const trustPoints = [
  { label: "SOC 2 Type II compliant" },
  { label: "End-to-end encrypted data rooms" },
  { label: "Zero-retention LLM proxying" },
  { label: "Enterprise SSO on the Institutional plan" },
];

export function AuthShell({ eyebrow, title, subtitle, children, footer }: Props) {
  return (
    <div className="container-x pt-10 pb-24">
      <div className="panel overflow-hidden">
        <div className="grid lg:grid-cols-12 min-h-[720px]">
          {/* Left: form */}
          <div className="lg:col-span-6 p-8 md:p-14 flex flex-col">
            <Link href="/" className="flex items-center gap-2.5 mb-12">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <span className="text-ink-950 font-bold text-sm">V</span>
              </div>
              <span className="font-display text-xl">
                Vanguard<span className="text-accent">.</span>
              </span>
            </Link>

            <div className="mb-8">
              <p className="eyebrow mb-4">{eyebrow}</p>
              <h1 className="display-serif text-4xl md:text-5xl mb-3">{title}</h1>
              <p className="text-bone-300">{subtitle}</p>
            </div>

            <div className="flex-1">{children}</div>

            {footer && <div className="mt-8 pt-6 border-t border-ink-600/40">{footer}</div>}
          </div>

          {/* Right: brand panel */}
          <div className="relative hidden lg:block lg:col-span-6 border-l border-ink-600/40 bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950 overflow-hidden">
            {/* Ghost wordmark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none select-none">
              <span className="font-display text-[16rem] leading-none tracking-tighter">V</span>
            </div>

            <div className="relative z-10 h-full p-14 flex flex-col justify-between">
              <div>
                <p className="eyebrow mb-8">[ What you're joining ]</p>
                <h2 className="display-serif text-4xl mb-6">
                  The verification<br />
                  <span className="italic text-bone-200">layer for capital.</span>
                </h2>
                <p className="text-bone-200 leading-relaxed max-w-md">
                  3,204 verified startups. 12,847 memos generated. 89 institutional LPs. And a mesh of 6 autonomous agents working around the clock.
                </p>
              </div>

              <div>
                <ul className="space-y-3 mb-10">
                  {trustPoints.map((p) => (
                    <li key={p.label} className="flex items-center gap-3 text-sm text-bone-100">
                      <ShieldCheck className="w-4 h-4 text-accent flex-shrink-0" />
                      {p.label}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-3 pt-6 border-t border-ink-600/40">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                  </span>
                  <span className="text-xs font-mono text-bone-200">
                    6 agents online · streaming · v4.2
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}