import Link from "next/link";
import { ArrowUpRight, Home, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-x pt-10 pb-24 min-h-[80vh] flex items-center">
      <div className="panel overflow-hidden w-full">
        <div className="grid lg:grid-cols-12">
          {/* Left: message */}
          <div className="lg:col-span-7 p-12 md:p-20 flex flex-col justify-center">
            <p className="eyebrow mb-6">[ Signal lost ]</p>
            <h1 className="display-serif text-display-xl mb-6">
              404<span className="text-accent">.</span>
            </h1>
            <h2 className="display-serif text-3xl md:text-4xl mb-4">
              This page isn't<br />
              <span className="italic text-bone-200">on our network.</span>
            </h2>
            <p className="text-bone-300 max-w-md mb-8">
              The route you're looking for is either unverified, deprecated, or was never part of the Vanguard mesh.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/" className="btn-accent">
                <Home className="w-4 h-4" /> Back to home
              </Link>
              <Link href="/explore" className="btn-ghost">
                <Compass className="w-4 h-4" /> Explore startups
              </Link>
            </div>

            <p className="mt-10 text-xs font-mono text-bone-400">
              error_code: VG_404_NO_ROUTE · timestamp: {new Date().toISOString().slice(0, 19)}Z
            </p>
          </div>

          {/* Right: visual */}
          <div className="relative hidden lg:block lg:col-span-5 border-l border-ink-600/40 bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none select-none">
              <span className="font-display text-[24rem] leading-none">?</span>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-64 h-64">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="absolute inset-0 rounded-full border border-bone-200/10"
                    style={{ transform: `scale(${1 - i * 0.2})` }}
                  />
                ))}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-bone-300 mb-2">
                      no agent match
                    </div>
                    <div className="font-display text-6xl text-bone-50">
                      ∅
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-6 right-6 text-[10px] font-mono text-bone-400">
              //vanguard/routing/miss
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}