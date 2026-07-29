"use client";

import { useState } from "react";
import { Sparkles, X } from "lucide-react";
import { CopilotDrawer } from "./CopilotDrawer";

export function CopilotFAB() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating action button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open Vanguard Copilot"
        className="fixed bottom-6 right-6 z-40 group"
      >
        <span className="absolute inset-0 rounded-full bg-accent/40 blur-xl group-hover:bg-accent/60 transition-all" />
        <span className="relative flex items-center gap-2 rounded-full bg-accent text-ink-950 pl-4 pr-5 py-3.5 shadow-panel hover:scale-105 transition-transform duration-200">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ink-950 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-ink-950" />
          </span>
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">Ask Copilot</span>
        </span>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-ink-950/70 backdrop-blur-sm animate-in fade-in duration-200"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-screen w-full sm:w-[480px] transform transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full bg-ink-900 border-l border-ink-600/50 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-ink-600/40">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-ink-950" />
              </div>
              <div>
                <div className="font-display text-lg text-bone-50">Vanguard Copilot</div>
                <div className="text-[10px] font-mono text-bone-300 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  online · agent 03
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-9 h-9 rounded-full border border-ink-600/60 flex items-center justify-center text-bone-200 hover:bg-ink-800 transition"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <CopilotDrawer />
        </div>
      </div>
    </>
  );
}