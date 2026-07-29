"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ArrowUpRight, Sparkles } from "lucide-react";
import { CopilotFAB } from "@/components/CopilotFAB";

const tiers = [
  {
    name: "Analyst",
    price: { monthly: 199, yearly: 179 },
    tagline: "For solo GPs and independent analysts",
    features: [
      "500 memos / month",
      "3 AI providers included",
      "Explore + Copilot access",
      "CSV analyzer (10 uploads/mo)",
      "Email support · 24h SLA",
    ],
    cta: "Start Analyst",
    highlight: false,
  },
  {
    name: "Firm",
    price: { monthly: 1499, yearly: 1349 },
    tagline: "For syndicates and small institutional funds",
    features: [
      "10 seats · unlimited memos",
      "All 6 LLM providers",
      "Full agent mesh access",
      "Portfolio dashboards + stress tests",
      "Priority Slack channel",
      "Custom sector taxonomies",
      "SOC 2 audit export",
    ],
    cta: "Start Firm",
    highlight: true,
  },
  {
    name: "Institutional",
    price: { monthly: null, yearly: null },
    tagline: "For LPs, family offices, and sovereign funds",
    features: [
      "Unlimited seats",
      "Private VPC deployment",
      "Custom agent orchestration",
      "SSO · SAML · SCIM",
      "Dedicated solutions architect",
      "Bring-your-own LLM keys",
      "White-glove onboarding",
    ],
    cta: "Contact sales",
    highlight: false,
  },
];

const compare = [
  { row: "Startups in network",     analyst: "3,204",       firm: "3,204 + private",     inst: "Unlimited · custom" },
  { row: "Agent mesh access",       analyst: "Copilot only", firm: "All 6 agents",        inst: "All 6 + custom agents" },
  { row: "LLM providers",           analyst: "3",            firm: "6",                    inst: "6 + BYO" },
  { row: "Data room ingestion",     analyst: "10 files/mo",  firm: "Unlimited",           inst: "Unlimited · private" },
  { row: "Audit trail retention",   analyst: "30 days",      firm: "1 year",              inst: "7 years" },
  { row: "SSO",                     analyst: "—",            firm: "Google",              inst: "SAML · SCIM · Okta" },
  { row: "Support SLA",             analyst: "24h email",    firm: "Priority Slack",      inst: "Dedicated architect" },
];

export default function PricingPage() {
  const [yearly, setYearly] = useState(true);

  return (
    <div className="container-x pt-10 pb-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <p className="eyebrow mb-4">[ Institutional pricing ]</p>
        <h1 className="display-serif text-display-xl mb-6">
          Priced for<br />
          <span className="italic text-bone-200">allocators.</span>
        </h1>
        <p className="text-lg text-bone-200 leading-relaxed">
          No usage traps, no per-agent surcharges. Choose a tier that matches your firm size — upgrade as your book grows.
        </p>

        {/* Billing toggle */}
        <div className="inline-flex items-center gap-1 p-1 rounded-full bg-ink-800 border border-ink-600/40 mt-8">
          <button
            onClick={() => setYearly(false)}
            className={`px-5 py-2 rounded-full text-sm transition ${!yearly ? "bg-accent text-ink-950" : "text-bone-200"}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setYearly(true)}
            className={`px-5 py-2 rounded-full text-sm transition flex items-center gap-2 ${yearly ? "bg-accent text-ink-950" : "text-bone-200"}`}
          >
            Yearly <span className="text-[10px] font-mono">save 10%</span>
          </button>
        </div>
      </div>

      {/* Tiers */}
      <div className="grid lg:grid-cols-3 gap-5 mb-20">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={`panel p-8 flex flex-col ${
              t.highlight ? "ring-2 ring-accent/60 relative" : ""
            }`}
          >
            {t.highlight && (
              <span className="absolute -top-3 left-8 tag-accent flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Most popular
              </span>
            )}

            <h3 className="font-display text-2xl text-bone-50 mb-1">{t.name}</h3>
            <p className="text-sm text-bone-300 mb-6">{t.tagline}</p>

            <div className="mb-6">
              {t.price.monthly !== null ? (
                <>
                  <span className="font-display text-6xl text-bone-50">
                    ${yearly ? t.price.yearly : t.price.monthly}
                  </span>
                  <span className="text-sm text-bone-300 ml-2">/mo</span>
                  {yearly && (
                    <p className="text-xs font-mono text-accent mt-1">billed annually</p>
                  )}
                </>
              ) : (
                <>
                  <span className="font-display text-4xl text-bone-50">Custom</span>
                  <p className="text-xs font-mono text-bone-300 mt-1">contact for quote</p>
                </>
              )}
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-bone-200">
                  <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href={t.price.monthly ? "/register" : "/contact"}
              className={t.highlight ? "btn-accent w-full justify-center" : "btn-ghost w-full justify-center"}
            >
              {t.cta} <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>

      {/* Compare table */}
      <div className="mb-16">
        <div className="text-center mb-10">
          <p className="eyebrow mb-3">[ Feature comparison ]</p>
          <h2 className="display-serif text-display-md">Everything, side by side.</h2>
        </div>

        <div className="panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-600/40 bg-ink-950/40">
                  <th className="text-left px-6 py-5 eyebrow">Feature</th>
                  <th className="text-left px-6 py-5 eyebrow">Analyst</th>
                  <th className="text-left px-6 py-5 eyebrow text-accent">Firm</th>
                  <th className="text-left px-6 py-5 eyebrow">Institutional</th>
                </tr>
              </thead>
              <tbody>
                {compare.map((c, i) => (
                  <tr key={i} className="border-b border-ink-600/20 last:border-0">
                    <td className="px-6 py-4 text-bone-200">{c.row}</td>
                    <td className="px-6 py-4 text-bone-300">{c.analyst}</td>
                    <td className="px-6 py-4 text-bone-50 font-medium">{c.firm}</td>
                    <td className="px-6 py-4 text-bone-100">{c.inst}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FAQ mini */}
      <div className="panel p-12 text-center">
        <p className="eyebrow mb-3">[ Still deciding ]</p>
        <h2 className="display-serif text-display-md mb-4">Talk to our team.</h2>
        <p className="text-bone-300 max-w-lg mx-auto mb-8">
          15-minute call. We'll help you size the right tier and walk you through a live agent workflow with your own thesis.
        </p>
        <Link href="/contact" className="btn-accent">
          Book a walkthrough <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      <CopilotFAB />
    </div>
  );
}