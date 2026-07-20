"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, CheckCircle2, Sparkles, Award, ArrowRight } from 'lucide-react';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const tiers = [
    {
      name: 'Solo Analyst Tier',
      desc: 'Ideal for independent angel investors and technical due diligence consultants.',
      priceMonthly: 199,
      priceAnnual: 149,
      features: [
        'Up to 50 Autonomous Due Diligence Memos / mo',
        'Vanguard Copilot with Tool Calling',
        'CSV & Financial Sheet Analyzer (Up to 10 MB)',
        'Access to 4,000+ Verified DeepTech Assets',
        'Standard SOC2 Encryption Boundary'
      ],
      cta: 'Start Analyst Trial',
      highlighted: false
    },
    {
      name: 'Vanguard Pro Syndicate',
      desc: 'Our flagship tier for lead general partners and institutional seed/Series A funds.',
      priceMonthly: 499,
      priceAnnual: 399,
      features: [
        'Unlimited Autonomous Due Diligence Memos',
        'Real-Time Cap-Table & Burn Stress Testing',
        'AI Smart Matching & Personalized Ranking Engine',
        'Multi-LLM Live API Key Customization (`/settings`)',
        'Custom Memo Branding & Word Export (.docx/.pdf)',
        'Dedicated 24/7 Priority Intelligence Support'
      ],
      cta: 'Join Vanguard Pro',
      highlighted: true
    },
    {
      name: 'Enterprise Fund & Global Family Office',
      desc: 'Tailored for multi-billion dollar venture funds requiring custom on-premise deployments.',
      priceMonthly: 1499,
      priceAnnual: 1199,
      features: [
        'Everything in Vanguard Pro Syndicate',
        'Dedicated Cloud / On-Premise Instance',
        'Custom Fine-Tuning on Internal Fund Deal-Flow History',
        'Private API Endpoint & Webhook Integration',
        'Full HIPAA & Custom Governance Compliance Audit',
        'Assigned Dedicated Chief AI Investment Architect'
      ],
      cta: 'Contact Global Headquarters',
      highlighted: false
    }
  ];

  return (
    <div className="w-full min-h-screen bg-navy-950 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-secondary/15 border border-secondary/40 text-xs font-semibold text-secondary">
            <Award className="w-3.5 h-3.5" />
            <span>Institutional Subscription Tiers</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">Transparent Pricing for High-Conviction Venture Funds</h1>
          <p className="text-sm sm:text-base text-slate-300">Choose the intelligence tier that fits your syndicate check size and deal-flow volume.</p>

          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={`text-xs font-bold ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-400'}`}>Monthly Billing</span>
            <button onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')} className="w-12 h-6 rounded-full bg-navy-800 border border-navy-700 p-1 flex items-center transition-all cursor-pointer relative">
              <div className={`w-4 h-4 rounded-full bg-primary shadow-md transition-transform duration-300 ${billingCycle === 'annual' ? 'translate-x-6 bg-secondary' : 'translate-x-0'}`} />
            </button>
            <span className={`text-xs font-bold flex items-center gap-1.5 ${billingCycle === 'annual' ? 'text-white' : 'text-slate-400'}`}>
              <span>Annual Billing</span>
              <span className="bg-secondary/20 text-secondary text-[10px] px-2 py-0.5 rounded-full uppercase font-extrabold">Save 25%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier, idx) => {
            const price = billingCycle === 'annual' ? tier.priceAnnual : tier.priceMonthly;
            return (
              <div key={idx} className={`rounded-3xl p-8 border transition-all duration-300 flex flex-col justify-between relative shadow-xl ${tier.highlighted ? 'bg-gradient-to-b from-navy-900 via-navy-900/95 to-navy-900 border-primary shadow-[0_0_40px_rgba(59,130,246,0.25)] scale-105 z-10' : 'bg-navy-900/80 border-navy-800 hover:border-navy-700'}`}>
                {tier.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-extrabold text-[11px] uppercase tracking-wider shadow-md flex items-center gap-1"><Sparkles className="w-3 h-3" /><span>Most Popular Syndicate Tier</span></div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-extrabold text-white">{tier.name}</h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">{tier.desc}</p>
                  </div>
                  <div className="flex items-baseline gap-1"><span className="text-4xl font-extrabold text-white">${price}</span><span className="text-xs text-slate-400 font-bold">/ partner / month</span></div>

                  <div className="pt-6 border-t border-navy-800 space-y-3">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Included Platform Capabilities:</span>
                    <ul className="space-y-3 text-xs text-slate-300">
                      {tier.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5"><CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${tier.highlighted ? 'text-secondary' : 'text-primary'}`} /><span className="leading-snug">{feat}</span></li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-8">
                  <Link href={tier.name.includes('Enterprise') ? '/contact' : '/register'} className={`w-full py-3.5 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-md ${tier.highlighted ? 'bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white shadow-[0_0_20px_rgba(59,130,246,0.35)]' : 'bg-navy-800 hover:bg-navy-700 text-slate-200 border border-navy-700'}`}>
                    <span>{tier.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}