"use client";

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does Vanguard AI generate autonomous Due Diligence Memorandums?',
      a: 'Vanguard AI deploys specialized multi-agent LLM pipelines that programmatically read cap tables, verify patent filings against the USPTO/EPO registries, benchmark gross margins against sector medians, and synthesize executive summaries formatted to institutional venture standards within seconds.'
    },
    {
      q: 'What LLM models power the Vanguard Copilot and recommendation engines?',
      a: 'Our architecture supports dual execution: high-speed live API integrations for Groq (Llama-3.3-70B), OpenAI (GPT-4o), Gemini 1.5 Pro, and Claude 3.5 Sonnet, alongside our built-in Vanguard Autonomous High-Fidelity Engine that ensures 100% operational uptime and programmatic financial accuracy even when third-party API keys are not configured.'
    },
    {
      q: 'Can I upload our internal startup CSV financial sheets for analysis?',
      a: 'Yes. Our AI Data Analyzer ingests CSV and JSON financial statements, calculates monthly cash burn rates, projects operational runway buffers, identifies unusual customer acquisition cost inflation, and exports downloadable audit summaries with interactive Recharts trends.'
    },
    {
      q: 'How does the Smart Recommendation Engine match startups to my investor profile?',
      a: 'When you register or update your Investor Profile (target check size, risk tolerance, preferred deeptech sectors, ESG requirements), our autonomous scoring engine computes an exact matching percentage and generates explicit reasoning explaining why each target fits or violates your investment thesis.'
    },
    {
      q: 'Is our portfolio data and due diligence inquiry history secure?',
      a: 'Absolutely. All investor inquiries run inside SOC2 Type II compliance boundaries. We never train public base models on your proprietary syndicate notes or internal valuation spreadsheets.'
    }
  ];

  const toggleAccordion = (index: number) => setOpenIndex(openIndex === index ? null : index);

  return (
    <section className="w-full bg-navy-950 border-b border-navy-800 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs font-semibold text-primary-light mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Everything You Need to Know About Autonomous Due Diligence</h2>
          <p className="text-sm text-slate-400 mt-2">Got questions about our multi-agent architecture or syndicate workflows? We've got answers.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className={`border rounded-2xl transition-all duration-300 overflow-hidden ${isOpen ? 'bg-navy-900 border-primary/50 shadow-lg' : 'bg-navy-900/60 border-navy-800 hover:border-navy-700'}`}>
                <button onClick={() => toggleAccordion(idx)} className="w-full px-6 py-5 text-left flex items-center justify-between gap-4">
                  <span className={`font-bold text-sm sm:text-base transition-colors ${isOpen ? 'text-primary-light' : 'text-white'}`}>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? 'transform rotate-180 text-primary' : ''}`} />
                </button>
                {isOpen && <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal border-t border-navy-800/60 animate-fadeIn">{faq.a}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};