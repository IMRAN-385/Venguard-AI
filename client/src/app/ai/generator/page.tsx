"use client";

import { useState, FormEvent } from "react";
import { FileText, Wand2, Copy, Check, Loader2 } from "lucide-react";
import api from "@/services/api";

export default function GeneratorPage() {
  const [assetName, setAssetName] = useState("");
  const [sector, setSector] = useState("");
  const [tone, setTone] = useState<"formal" | "concise" | "bullish">("formal");
  const [memo, setMemo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (e: FormEvent) => {
    e.preventDefault();
    if (!assetName.trim()) return;

    setIsLoading(true);
    setError("");
    setMemo("");

    try {
      const { data } = await api.post("/ai/generator", {
        assetName,
        sector,
        tone,
      });
      setMemo(data.memo);
    } catch {
      setError("Couldn't generate the memo. Check the connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(memo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#080612] text-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
            <FileText className="w-5 h-5 text-violet-400" />
          </div>
          <h1 className="text-2xl font-semibold">Memo Generator</h1>
        </div>
        <p className="text-white/50 mb-10 ml-[52px]">
          Give an asset and sector — get a structured investment memo, ready to review or export.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Form */}
          <form
            onSubmit={handleGenerate}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md h-fit space-y-5"
          >
            <div>
              <label className="text-sm text-white/60 mb-1.5 block">Asset name</label>
              <input
                required
                value={assetName}
                onChange={(e) => setAssetName(e.target.value)}
                placeholder="e.g. Grameenphone Ltd."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500/50"
              />
            </div>

            <div>
              <label className="text-sm text-white/60 mb-1.5 block">Sector</label>
              <input
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                placeholder="e.g. Telecom"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500/50"
              />
            </div>

            <div>
              <label className="text-sm text-white/60 mb-2 block">Tone</label>
              <div className="flex gap-2">
                {(["formal", "concise", "bullish"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={`flex-1 rounded-lg py-2 text-xs font-medium capitalize transition-colors border ${
                      tone === t
                        ? "bg-violet-600/30 border-violet-500/50 text-white"
                        : "bg-white/5 border-white/10 text-white/50 hover:text-white/80"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !assetName.trim()}
              className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 rounded-xl py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4" />
              )}
              {isLoading ? "Generating..." : "Generate memo"}
            </button>

            {error && <p className="text-sm text-red-400">{error}</p>}
          </form>

          {/* Output */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md min-h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-white/50">Output</span>
              {memo && (
                <button
                  onClick={handleCopy}
                  className="text-xs flex items-center gap-1.5 text-white/50 hover:text-white transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </>
                  )}
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="flex-1 flex items-center justify-center text-white/30 text-sm">
                Drafting the memo...
              </div>
            ) : memo ? (
              <div className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap flex-1 overflow-y-auto">
                {memo}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-white/30 text-sm text-center px-8">
                Fill in the asset details and generate to see the memo here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}