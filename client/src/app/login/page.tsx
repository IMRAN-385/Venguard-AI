"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AuthShell } from "@/components/AuthShell";
import { GoogleButton } from "@/components/GoogleButton";

const DEMO_EMAIL = "demo.investor@vanguard-ai.io";
const DEMO_PASSWORD = "Vanguard2026!";
export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) return setError("Email and password required.");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/portfolio");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid credentials.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function fillDemo() {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setError("");
  }

  return (
    <AuthShell
      eyebrow="[ Institutional access ]"
      title="Welcome back."
      subtitle="Sign in to your Vanguard cockpit."
      footer={
        <p className="text-sm text-bone-300">
          New allocator?{" "}
          <Link href="/register" className="text-accent hover:underline">Request access</Link>
        </p>
      }
    >
      <form onSubmit={handleLogin} className="space-y-5">
        {/* Demo autofill */}
        <button
          type="button"
          onClick={fillDemo}
          className="w-full flex items-center justify-between p-4 rounded-2xl bg-accent/5 border border-accent/30 hover:bg-accent/10 transition group"
        >
          <div className="flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-ink-950" />
            </div>
            <div>
              <div className="text-sm text-bone-50 font-medium">Try demo account</div>
              <div className="text-[11px] text-bone-300 font-mono">auto-fills credentials</div>
            </div>
          </div>
          <span className="text-xs text-accent font-mono group-hover:underline">use →</span>
        </button>

        <GoogleButton label="Continue with Google" onSuccess={() => router.push("/portfolio")} />

        <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest text-bone-400">
          <div className="flex-1 h-px bg-ink-600/40" />
          or with email
          <div className="flex-1 h-px bg-ink-600/40" />
        </div>

        {/* Email */}
        <div>
          <label className="eyebrow block mb-2">Email</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-bone-300 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@fund.com"
              className="field pl-11"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="eyebrow">Password</label>
            <button type="button" className="text-[11px] text-bone-300 hover:text-accent font-mono">forgot?</button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-bone-300 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="field pl-11"
              required
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-orange-500/10 border border-orange-500/30">
            <AlertCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-orange-200">{error}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn-accent w-full justify-center disabled:opacity-40"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</> : "Sign In"}
        </button>
      </form>
    </AuthShell>
  );
}