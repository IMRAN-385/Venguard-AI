"use client";

import { useState } from "react";
import { FileText, Loader2, Download, Copy, CheckCircle2, Sparkles } from "lucide-react";
import { api } from "@/services/api";

const tones = ["Formal VC", "Analytical", "Bullish", "Contrarian", "Founder-friendly"];
const lengths = ["Brief (300w)", "Standard (800w)", "Deep-dive (2000w)"];

export default function GeneratorPage() {
  const [company, setCompany] = useState("");
  const [sector, setSector] = useState("Quantum");
  const [tone, setTone] = useState(tones[0]);
  const [length, setLength] = useState(lengths[1]);
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generate() {
    if (!company.trim()) return;
    setLoading(true);
    setOutput("");
    try {
      const { data } = await api.post("/ai/generate-memo", { company, sector, tone, length, notes });
      setOutput(data.memo ?? data.output ?? "");
    } catch {
      setOutput(
`INVESTMENT MEMORANDUM
Company: ${company}
Sector: ${sector} · Tone: ${tone} · Length: ${length}

EXECUTIVE SUMMARY
${company} is a ${sector.toLowerCase()}-sector startup demonstrating strong technical differentiation and defensible IP posture. Based on ingested cap-table data, GitHub telemetry, and patent filings, we rate this opportunity as a High-Conviction Watchlist candidate for institutional deployment.

KEY METRICS
· Verification score:   87 / 100
· Patent moat:          7 filings, 3 granted USPTO
· Team pedigree:        ex-DeepMind, ex-DARPA
· Burn multiple:        1.8x (healthy for stage)
· Runway:               18 months at current rate

RISK ASSESSMENT
Primary risk vectors are (1) regulatory uncertainty in target market, (2) 24-month tech-to-revenue timeline, and (3) concentrated customer pipeline. All manageable with disciplined milestone-gated tranches.

RECOMMENDATION
Proceed to partner meeting. Suggested check size: $2-4M at $${(Math.random() * 40 + 20).toFixed(0)}M pre-money.

[Simulated output — backend offline]`
      );
    } finally {
      setLoading(false);
    }
  }

  function copy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function download() {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${company.replace(/\s+/g, "-")}-memo.txt`;
    a.click();
  }

  return (
    <div className="container-x pt-10 pb-24">
      {/* Header */}
      <div className="mb-10">
        <p className="eyebrow mb-4">[ Agent 01 · Memo generator ]</p>
        <h1 className="display-serif text-display-lg mb-4">
          Institutional memos,<br />
          <span className="italic text-bone-200">in seconds.</span>
        </h1>
        <p className="text-bone-300 max-w-2xl">
          Feed the agent a company name and thesis notes. It ingests cap-table, GitHub, patent data, and drafts a source-cited investment memo in your chosen tone.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-5">
        {/* Left: form */}
        <div className="lg:col-span-5 panel p-8 h-fit">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-ink-800 border border-ink-600/60 flex items-center justify-center">
              <FileText className="w-5 h-5 text-accent" />
            </div>
            <h2 className="font-display text-2xl text-bone-50">Memo parameters</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="eyebrow block mb-2">Company name</label>
              <input
                className="field"
                placeholder="e.g. Neuralink Cortex Labs"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>

            <div>
              <label className="eyebrow block mb-2">Sector</label>
              <select className="field" value={sector} onChange={(e) => setSector(e.target.value)}>
                {["Quantum", "BioTech", "Fusion", "Robotics", "SpaceTech", "Neural", "Climate", "Defense"].map(s => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="eyebrow block mb-2">Tone</label>
              <div className="flex flex-wrap gap-2">
                {tones.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={`px-3 py-1.5 rounded-full text-xs border transition ${
                      tone === t
                        ? "bg-accent text-ink-950 border-accent"
                        : "text-bone-200 border-ink-600/60 hover:bg-ink-800"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="eyebrow block mb-2">Length</label>
              <div className="flex flex-wrap gap-2">
                {lengths.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLength(l)}
                    className={`px-3 py-1.5 rounded-full text-xs border transition ${
                      length === l
                        ? "bg-accent text-ink-950 border-accent"
                        : "text-bone-200 border-ink-600/60 hover:bg-ink-800"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="eyebrow block mb-2">Thesis notes (optional)</label>
              <textarea
                className="field resize-none"
                rows={4}
                placeholder="Any angle you want the agent to emphasize — regulatory risks, comparable exits, tech moat…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <button
              onClick={generate}
              disabled={!company.trim() || loading}
              className="btn-accent w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Generating memo…</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Generate memo</>
              )}
            </button>
          </div>
        </div>

        {/* Right: output */}
        <div className="lg:col-span-7 panel overflow-hidden flex flex-col min-h-[600px]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-ink-600/40 bg-ink-950/40">
            <div className="flex items-center gap-2 text-xs font-mono text-bone-300">
              <FileText className="w-3.5 h-3.5" />
              vanguard://memo/output
            </div>
            {output && (
              <div className="flex items-center gap-2">
                <button onClick={copy} className="btn-ghost !py-1.5 !px-3 text-xs">
                  {copied ? <><CheckCircle2 className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                </button>
                <button onClick={download} className="btn-ghost !py-1.5 !px-3 text-xs">
                  <Download className="w-3 h-3" /> Download
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-8">
            {loading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-3 bg-ink-700/50 rounded w-3/4" />
                <div className="h-3 bg-ink-700/50 rounded w-full" />
                <div className="h-3 bg-ink-700/50 rounded w-5/6" />
                <div className="h-3 bg-ink-700/50 rounded w-2/3" />
                <div className="h-3 bg-ink-700/50 rounded w-full" />
              </div>
            ) : output ? (
              <pre className="text-sm text-bone-100 whitespace-pre-wrap font-mono leading-relaxed">
                {output}
              </pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-full bg-ink-800 border border-ink-600/60 flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-bone-300" />
                </div>
                <p className="text-bone-300">Memo will appear here.</p>
                <p className="text-xs text-bone-400 mt-1">Fill in the form and hit Generate.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}