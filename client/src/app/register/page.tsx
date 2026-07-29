"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Building2, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AuthShell } from "@/components/AuthShell";
import { GoogleButton } from "@/components/GoogleButton";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", firm: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordChecks = [
    { label: "8+ characters",       ok: form.password.length >= 8 },
    { label: "Uppercase letter",    ok: /[A-Z]/.test(form.password) },
    { label: "Number or symbol",    ok: /[0-9!@#$%^&*]/.test(form.password) },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password) return setError("All required fields must be filled.");
    if (form.password.length < 8) return setError("Password must be at least 8 characters.");

    setLoading(true);
    try {
      await register(form.email, form.password, form.name);
      router.push("/portfolio");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <AuthShell
      eyebrow="[ Request access ]"
      title="Join the network."
      subtitle="Create your Vanguard investor account."
      footer={
        <p className="text-sm text-bone-300">
          Already onboarded?{" "}
          <Link href="/login" className="text-accent hover:underline">Sign in</Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <GoogleButton label="Sign up with Google" onSuccess={() => router.push("/portfolio")} />

        <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest text-bone-400">
          <div className="flex-1 h-px bg-ink-600/40" />
          or with email
          <div className="flex-1 h-px bg-ink-600/40" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="eyebrow block mb-2">Full name</label>
            <div className="relative">
              <User className="w-4 h-4 text-bone-300 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Ada Lovelace"
                className="field pl-11"
                required
              />
            </div>
          </div>
          <div>
            <label className="eyebrow block mb-2">Firm (optional)</label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-bone-300 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                value={form.firm}
                onChange={(e) => update("firm", e.target.value)}
                placeholder="Meridian Ventures"
                className="field pl-11"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="eyebrow block mb-2">Work email</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-bone-300 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="you@fund.com"
              className="field pl-11"
              required
            />
          </div>
        </div>

        <div>
          <label className="eyebrow block mb-2">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-bone-300 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              placeholder="••••••••"
              className="field pl-11"
              required
            />
          </div>

          {form.password.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {passwordChecks.map((c) => (
                <div
                  key={c.label}
                  className={`flex items-center gap-1.5 text-[11px] ${c.ok ? "text-accent" : "text-bone-400"}`}
                >
                  <CheckCircle2 className={`w-3 h-3 ${c.ok ? "opacity-100" : "opacity-30"}`} />
                  {c.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-orange-500/10 border border-orange-500/30">
            <AlertCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-orange-200">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-accent w-full justify-center disabled:opacity-40"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account…</> : "Create account"}
        </button>

        <p className="text-[11px] text-bone-400 text-center leading-relaxed">
          By continuing you agree to Vanguard's{" "}
          <Link href="/docs" className="text-bone-200 hover:text-accent underline">Terms</Link>{" "}
          and{" "}
          <Link href="/docs" className="text-bone-200 hover:text-accent underline">Privacy Policy</Link>.
        </p>
      </form>
    </AuthShell>
  );
}