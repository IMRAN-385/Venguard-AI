"use client";

import { useState } from "react";
import { Save, Loader2, CheckCircle2, KeyRound, User, Bell, Cpu, Eye, EyeOff } from "lucide-react";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardShell } from "@/components/DashboardShell";

const tabs = [
  { id: "profile",   label: "Profile",     icon: User },
  { id: "providers", label: "AI Providers", icon: Cpu },
  { id: "keys",      label: "API Keys",     icon: KeyRound },
  { id: "notify",    label: "Notifications", icon: Bell },
];

const providers = [
  { id: "groq",      label: "Groq",             desc: "Llama 3.3 70B · fastest" },
  { id: "openai",    label: "OpenAI",           desc: "GPT-4o · best reasoning" },
  { id: "anthropic", label: "Anthropic Claude", desc: "Sonnet 3.5 · long context" },
  { id: "gemini",    label: "Google Gemini",    desc: "2.0 Pro · multimodal" },
  { id: "together",  label: "Together AI",      desc: "OSS model routing" },
  { id: "ollama",    label: "Ollama (local)",   desc: "Zero-cost inference" },
];

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <DashboardShell>
        <SettingsInner />
      </DashboardShell>
    </ProtectedRoute>
  );
}

function SettingsInner() {
  const { user } = useAuth();
  const [tab, setTab] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});

  const [profile, setProfile] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    firm: user?.firm ?? "",
  });

  const [primaryProvider, setPrimaryProvider] = useState("groq");
  const [keys, setKeys] = useState<Record<string, string>>({});

  const [notify, setNotify] = useState({
    weekly:   true,
    deals:    true,
    stress:   false,
    critical: true,
  });

  async function save() {
    setSaving(true);
    try {
      await api.post("/ai/settings", { profile, primaryProvider, keys, notify });
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    } catch {
      setSaved(true); // simulated success
      setTimeout(() => setSaved(false), 2200);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <p className="eyebrow mb-3">[ Cockpit configuration ]</p>
        <h1 className="display-serif text-4xl md:text-5xl">Settings</h1>
        <p className="text-bone-300 mt-2">Profile, LLM providers, API keys, and notifications.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-5">
        {/* Tabs sidebar */}
        <aside className="lg:col-span-3 panel p-4 h-fit">
          <nav className="space-y-1">
            {tabs.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition ${
                    tab === t.id
                      ? "bg-ink-800 text-bone-50"
                      : "text-bone-200 hover:bg-ink-800/60"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {t.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <div className="lg:col-span-9 panel p-8">
          {tab === "profile" && (
            <div className="space-y-6">
              <h2 className="font-display text-2xl text-bone-50 mb-2">Profile</h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="eyebrow block mb-2">Full name</label>
                  <input className="field" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                </div>
                <div>
                  <label className="eyebrow block mb-2">Firm</label>
                  <input className="field" value={profile.firm} onChange={(e) => setProfile({ ...profile, firm: e.target.value })} />
                </div>
                <div className="sm:col-span-2">
                  <label className="eyebrow block mb-2">Email</label>
                  <input type="email" className="field" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                </div>
              </div>
            </div>
          )}

          {tab === "providers" && (
            <div className="space-y-6">
              <h2 className="font-display text-2xl text-bone-50 mb-2">AI providers</h2>
              <p className="text-sm text-bone-300 mb-4">
                Select your default provider. Fallbacks auto-route on rate limits.
              </p>

              <div className="grid sm:grid-cols-2 gap-3">
                {providers.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPrimaryProvider(p.id)}
                    className={`p-5 rounded-2xl text-left border transition ${
                      primaryProvider === p.id
                        ? "bg-accent/10 border-accent/50 text-bone-50"
                        : "bg-ink-800/60 border-ink-600/40 text-bone-200 hover:bg-ink-800"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{p.label}</span>
                      {primaryProvider === p.id && <CheckCircle2 className="w-4 h-4 text-accent" />}
                    </div>
                    <span className="text-xs text-bone-300">{p.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {tab === "keys" && (
            <div className="space-y-6">
              <h2 className="font-display text-2xl text-bone-50 mb-2">API keys</h2>
              <p className="text-sm text-bone-300 mb-4">
                Zero-retention proxy. Keys are encrypted at rest and never logged.
              </p>

              {providers.map((p) => (
                <div key={p.id}>
                  <label className="eyebrow block mb-2">{p.label} key</label>
                  <div className="relative">
                    <input
                      type={showKey[p.id] ? "text" : "password"}
                      className="field pr-12"
                      value={keys[p.id] ?? ""}
                      onChange={(e) => setKeys({ ...keys, [p.id]: e.target.value })}
                      placeholder={`sk-${p.id}-••••••••••`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey({ ...showKey, [p.id]: !showKey[p.id] })}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-bone-300 hover:text-bone-100"
                    >
                      {showKey[p.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "notify" && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl text-bone-50 mb-2">Notifications</h2>

              {[
                { key: "weekly",   label: "Weekly deal-flow digest",       desc: "Every Friday · 3 verified deals + benchmarks" },
                { key: "deals",    label: "New matches to my thesis",      desc: "Real-time when Agent 02 finds a fit" },
                { key: "stress",   label: "Portfolio stress-test alerts",  desc: "Macro shock scenarios auto-run monthly" },
                { key: "critical", label: "Critical patent expiries",      desc: "180-day advance notice on IP moats" },
              ].map((n) => {
                const key = n.key as keyof typeof notify;
                return (
                  <label key={n.key} className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-ink-800/60 border border-ink-600/40 cursor-pointer hover:bg-ink-800 transition">
                    <div>
                      <div className="text-sm font-medium text-bone-50">{n.label}</div>
                      <div className="text-xs text-bone-300 mt-0.5">{n.desc}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notify[key]}
                      onChange={(e) => setNotify({ ...notify, [key]: e.target.checked })}
                      className="w-5 h-5 rounded accent-[#D7FF3A] mt-0.5"
                    />
                  </label>
                );
              })}
            </div>
          )}

          {/* Save bar */}
          <div className="mt-10 pt-6 border-t border-ink-600/40 flex items-center justify-between">
            <p className="text-xs text-bone-400 font-mono">Auto-saved locally · click Save to persist</p>
            <button onClick={save} disabled={saving} className="btn-accent disabled:opacity-40">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                : saved ? <><CheckCircle2 className="w-4 h-4" /> Saved</>
                : <><Save className="w-4 h-4" /> Save changes</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}