"use client";

import { useState } from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

export function NewsletterCallToAction() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section className="section">
      <div className="container-x">
        <div className="panel relative overflow-hidden">
          {/* Background wordmark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
            <span className="font-display text-[18rem] leading-none tracking-tighter">
              JOIN
            </span>
          </div>

          <div className="relative z-10 p-12 md:p-20">
            <div className="grid lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7">
                <p className="eyebrow mb-6">[ Weekly diligence brief ]</p>
                <h2 className="display-serif text-display-lg mb-6">
                  The Vanguard<br />
                  <span className="italic text-bone-200">Deal Memo.</span>
                </h2>
                <p className="text-bone-200 text-lg leading-relaxed max-w-lg">
                  Every Friday: 3 verified deeptech deals, 1 sector deep-dive, and a curated LLM benchmark — from our agents, straight to your inbox.
                </p>
              </div>

              <div className="lg:col-span-5">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@fund.com"
                    className="field text-base"
                  />
                  <button type="submit" className="btn-accent w-full justify-center">
                    {submitted ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Subscribed
                      </>
                    ) : (
                      <>
                        Subscribe to the brief <ArrowUpRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <p className="text-xs text-bone-400 text-center">
                    No spam. Unsubscribe anytime. Read by 4,200+ investors.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}