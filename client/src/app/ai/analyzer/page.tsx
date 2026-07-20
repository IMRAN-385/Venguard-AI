"use client";

import { useState, useCallback } from "react";
import { UploadCloud, BarChart3, Loader2, FileSpreadsheet, X } from "lucide-react";
import api from "@/services/api";

interface AnalysisResult {
  summary: string;
  insights: string[];
  metrics: { label: string; value: string }[];
}

export default function AnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

  const handleFile = (f: File | null) => {
    if (!f) return;
    setFile(f);
    setResult(null);
    setError("");
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0] ?? null);
  }, []);

  const handleAnalyze = async () => {
    if (!file) return;
    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await api.post("/ai/analyzer", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(data);
    } catch {
      setError("Couldn't analyze this file. Make sure it's a valid CSV or XLSX.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080612] text-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-violet-400" />
          </div>
          <h1 className="text-2xl font-semibold">Data Analyzer</h1>
        </div>
        <p className="text-white/50 mb-10 ml-[52px]">
          Upload a CSV or spreadsheet of asset data — get a plain-English breakdown and key metrics.
        </p>

        {/* Upload zone */}
        {!file ? (
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl py-16 cursor-pointer transition-colors ${
              isDragging
                ? "border-violet-500/60 bg-violet-600/10"
                : "border-white/15 bg-white/5 hover:border-white/25"
            }`}
          >
            <UploadCloud className="w-8 h-8 text-white/40" />
            <div className="text-center">
              <p className="text-sm text-white/70">Drag a file here, or click to browse</p>
              <p className="text-xs text-white/40 mt-1">CSV, XLS, or XLSX up to 10MB</p>
            </div>
            <input
              type="file"
              accept=".csv,.xls,.xlsx"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />
          </label>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between backdrop-blur-md">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-5 h-5 text-violet-400" />
              <div>
                <p className="text-sm">{file.name}</p>
                <p className="text-xs text-white/40">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!result && (
                <button
                  onClick={handleAnalyze}
                  disabled={isLoading}
                  className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isLoading ? "Analyzing..." : "Analyze"}
                </button>
              )}
              <button
                onClick={() => {
                  setFile(null);
                  setResult(null);
                }}
                className="text-white/40 hover:text-white/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {error && <p className="text-sm text-red-400 mt-4">{error}</p>}

        {/* Results */}
        {result && (
          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {result.metrics.map((m) => (
                <div
                  key={m.label}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 text-center backdrop-blur-md"
                >
                  <p className="text-lg font-semibold text-violet-300">{m.value}</p>
                  <p className="text-xs text-white/50 mt-1">{m.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
              <h3 className="text-sm text-white/50 mb-2">Summary</h3>
              <p className="text-sm text-white/80 leading-relaxed">{result.summary}</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
              <h3 className="text-sm text-white/50 mb-3">Key insights</h3>
              <ul className="space-y-2">
                {result.insights.map((insight, i) => (
                  <li key={i} className="flex gap-2 text-sm text-white/80">
                    <span className="text-violet-400 mt-0.5">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}