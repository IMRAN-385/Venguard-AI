"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle2, Mail, MapPin, MessageSquare, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { CopilotFAB } from "@/components/CopilotFAB";

const topics = ["Institutional demo", "Partnership", "Press", "Support", "Careers"];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "", email: "", firm: "", topic: topics[0], message: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSent(true);
      setLoading(false);
    }, 900);
  }

  return (
    <div className="container-x pt-10 pb-24">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <p className="eyebrow mb-4">[ Get in touch ]</p>
        <h1 className="display-serif text-display-xl mb-6">
          Let's talk<br />
          <span className="italic text-bone-200">diligence.</span>
        </h1>
        <p className="text-lg text-bone-200">
          Book a walkthrough, ask about enterprise, or just say hi. We respond within 24 hours.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-5">
        {/* Left: info */}
        <div className="lg:col-span-4 space-y-4">
          {[
            { icon: Mail,          label: "Email",         value: "hello@vanguard-ai.io",     href: "mailto:hello@vanguard-ai.io" },
            { icon: MessageSquare, label: "Sales",         value: "sales@vanguard-ai.io",     href: "mailto:sales@vanguard-ai.io" },
            { icon: MapPin,        label: "Global HQ",     value: "Chattogram · Dhaka R&D",   href: null },
          ].map((c) => {
            const Icon = c.icon;
            const El = c.href ? "a" : "div";
            return (
              <El
                key={c.label}
                {...(c.href ? { href: c.href } : {})}
                className={`panel p-6 flex items-start gap-4 ${c.href ? "hover:bg-ink-800 transition" : ""}`}
              >
                <div className="w-11 h-11 rounded-2xl bg-ink-800 border border-ink-600/60 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <div className="eyebrow mb-1">{c.label}</div>
                  <div className="text-sm text-bone-50">{c.value}</div>
                </div>
              </El>
            );
          })}

          <div className="panel p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
              </span>
              <span className="text-xs font-mono uppercase tracking-widest text-bone-200">
                24/7 agent uptime
              </span>
            </div>
            <p className="text-xs text-bone-300 leading-relaxed">
              Prefer async? Open the Copilot in the bottom-right corner — it can route your question directly to a human on our team.
            </p>
          </div>
        </div>

        {/* Right: form */}
        <div className="lg:col-span-8 panel p-8 md:p-10">
          {sent ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-ink-950" />
              </div>
              <h2 className="font-display text-3xl text-bone-50 mb-2">Message received</h2>
              <p className="text-bone-300 mb-8">Our team will respond within 24 hours.</p>
              <div className="flex justify-center gap-3">
                <button onClick={() => { setSent(false); setForm({ name: "", email: "", firm: "", topic: topics[0], message: "" }); }} className="btn-ghost">
                  Send another
                </button>
                <Link href="/" className="btn-accent">
                  Back to home <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <h2 className="font-display text-2xl text-bone-50 mb-2">Send a message</h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="eyebrow block mb-2">Your name</label>
                  <input required className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ada Lovelace" />
                </div>
                <div>
                  <label className="eyebrow block mb-2">Firm</label>
                  <input className="field" value={form.firm} onChange={(e) => setForm({ ...form, firm: e.target.value })} placeholder="Meridian Ventures" />
                </div>
              </div>

              <div>
                <label className="eyebrow block mb-2">Work email</label>
                <input required type="email" className="field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@fund.com" />
              </div>

              <div>
                <label className="eyebrow block mb-2">Topic</label>
                <div className="flex flex-wrap gap-2">
                  {topics.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm({ ...form, topic: t })}
                      className={`px-3 py-1.5 rounded-full text-xs border transition ${
                        form.topic === t
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
                <label className="eyebrow block mb-2">Message</label>
                <textarea
                  required
                  rows={5}
                  className="field resize-none"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us about your firm, deal-flow, or what you'd like to see in a demo…"
                />
              </div>

              <button type="submit" disabled={loading} className="btn-accent w-full justify-center disabled:opacity-40">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</> : <>Send message <Send className="w-4 h-4" /></>}
              </button>
              <p className="text-[10px] font-mono text-bone-400 text-center">
                By submitting you agree to Vanguard's privacy policy.
              </p>
            </form>
          )}
        </div>
      </div>

      <CopilotFAB />
    </div>
  );
}