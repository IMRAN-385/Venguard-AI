"use client";

import React, { useState } from 'react';
import { Mail, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export const NewsletterCallToAction: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid institutional or personal email address.');
      return;
    }
    setError('');
    setSubscribed(true);
    setEmail('');
  };

  return (
    <section className="w-full bg-navy-950 py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-primary/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto bg-gradient-to-r from-navy-900 via-navy-900/90 to-navy-900 rounded-3xl p-8 sm:p-12 border border-primary/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 border border-secondary/40 text-xs font-semibold text-secondary">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Autonomous Deal-Flow Intelligence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">Get Real-Time Alerts When DeepTech Startups Enter Series A</h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">Subscribe to our autonomous deal-flow dispatch. Every Monday morning, our AI engine synthesizes top patent approvals, cap-table changes, and valuation alerts directly to your inbox.</p>
          </div>

          <div className="lg:col-span-5 w-full">
            {subscribed ? (
              <div className="bg-secondary/15 border border-secondary/40 rounded-2xl p-6 text-center space-y-2 animate-fadeIn">
                <CheckCircle2 className="w-10 h-10 text-secondary mx-auto" />
                <h3 className="font-extrabold text-lg text-white">Syndicate Dispatch Activated!</h3>
                <p className="text-xs text-slate-300">We've added your email to our VIP institutional dispatch list. You will receive our next autonomous due diligence digest on Monday at 08:00 GMT.</p>
                <button onClick={() => setSubscribed(false)} className="text-xs text-secondary underline font-bold pt-2 block mx-auto">Subscribe another email</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input type="email" placeholder="Enter institutional email (e.g., partner@fund.vc)..." value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-navy-950 border border-navy-700 focus:border-primary rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner" />
                </div>
                {error && <p className="text-xs text-red-400 pl-1">{error}</p>}
                <button type="submit" className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-bold text-sm shadow-[0_0_20px_rgba(59,130,246,0.35)] transition-all flex items-center justify-center gap-2">
                  <span>Subscribe to Autonomous Dispatch</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[11px] text-slate-400 text-center">🔒 Zero spam guarantee. Unsubscribe with 1-click at any time. SOC2 Encrypted.</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};