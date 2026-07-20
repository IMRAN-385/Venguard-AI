"use client";

import { useState, FormEvent } from "react";
import { Mail, MapPin, Send, CheckCircle2 } from "lucide-react";
import api from "@/services/api";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await api.post("/contact", form);
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#080612] text-white py-20 px-4">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
        {/* Left: Info */}
        <div>
          <p className="text-violet-400 text-sm font-medium tracking-wide uppercase mb-3">
            Contact Desk
          </p>
          <h1 className="text-4xl font-semibold mb-4">Let's talk strategy.</h1>
          <p className="text-white/60 leading-relaxed mb-10">
            Questions about a portfolio, integration, or partnership — reach the
            Vanguard team directly and we'll get back within a business day.
          </p>

          <div className="space-y-5">
            <div className="flex items-center gap-3 text-white/70">
              <Mail className="w-4 h-4 text-violet-400" />
              <span>desk@vanguardai.com</span>
            </div>
            <div className="flex items-center gap-3 text-white/70">
              <MapPin className="w-4 h-4 text-violet-400" />
              <span>Chattogram, Bangladesh</span>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
          {status === "sent" ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-10">
              <CheckCircle2 className="w-10 h-10 text-violet-400 mb-4" />
              <h3 className="text-lg font-medium mb-1">Message sent</h3>
              <p className="text-white/50 text-sm">
                We'll reply to {form.email || "your inbox"} soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm text-white/60 mb-1.5 block">Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500/50"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-sm text-white/60 mb-1.5 block">Email</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500/50"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="text-sm text-white/60 mb-1.5 block">Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-violet-500/50"
                  placeholder="How can we help?"
                />
              </div>
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 rounded-xl py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4" />
                {status === "sending" ? "Sending..." : "Send message"}
              </button>
              {status === "error" && (
                <p className="text-sm text-red-400">Couldn't send — please try again.</p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}