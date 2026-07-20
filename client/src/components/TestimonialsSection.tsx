"use client";

import React from 'react';
import { Star, Quote, Award, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      id: 'test_1',
      quote: 'Vanguard AI Autonomous Due Diligence reduced our Series A technical audit timeframe from 3 weeks to 18 seconds. The patent verification accuracy and burn rate simulations are institutional-grade.',
      author: 'Dame Alistair Sterling',
      role: 'Managing Partner, Helios DeepTech Ventures',
      location: 'London / Zurich',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      verifiedTier: 'Tier-1 Institutional Fund'
    },
    {
      id: 'test_2',
      quote: 'The ability to chat directly with Vanguard Copilot and execute live ROI calculations over complex cap tables gives our syndicate an unfair advantage during competitive term sheet negotiations.',
      author: 'Elena Rostova',
      role: 'Lead General Partner, Apex AI Syndicate',
      location: 'San Francisco, CA',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      verifiedTier: 'Syndicate Lead ($140M AUM)'
    },
    {
      id: 'test_3',
      quote: 'We uploaded our portfolio companies’ CSV financial reports into the Data Analyzer and discovered a $45,000 monthly cloud compute redundancy within minutes. Vanguard AI pays for itself 50x over.',
      author: 'Dr. Tanvir Rahman',
      role: 'Head of Research, Chattogram Innovation Hub',
      location: 'Chattogram, Bangladesh',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      verifiedTier: 'Regional Venture Syndicate'
    }
  ];

  return (
    <section className="w-full bg-navy-950 border-b border-navy-800 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-secondary/15 border border-secondary/40 text-xs font-semibold text-secondary mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Institutional VC Partner Endorsements</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Trusted by Global Tier-1 Venture Capital & Angel Syndicates</h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3 leading-relaxed">Discover why institutional partners across North America, Europe, and Asia rely on our autonomous deeptech workflows before signing term sheets.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-navy-900/90 rounded-2xl p-6 border border-navy-800 hover:border-primary/40 transition-all duration-300 flex flex-col justify-between shadow-xl relative group">
              <Quote className="w-10 h-10 text-primary/10 absolute top-4 right-4 pointer-events-none group-hover:text-primary/20 transition-colors" />
              <div>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed font-normal italic">"{t.quote}"</p>
              </div>
              <div className="pt-6 mt-6 border-t border-navy-800 flex items-center gap-3.5">
                <img src={t.avatar} alt={t.author} className="w-11 h-11 rounded-full object-cover border-2 border-primary/40 shadow-md shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-white truncate">{t.author}</span>
                    <span title="Verified Fund Partner"><ShieldCheck className="w-4 h-4 text-secondary shrink-0" /></span>
                  </div>
                  <span className="text-xs text-slate-400 block truncate">{t.role}</span>
                  <span className="text-[10px] text-primary-light font-semibold block">{t.verifiedTier}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 bg-navy-900/60 border border-navy-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4">
          <div className="space-y-1">
            <span className="text-base font-extrabold text-white block">98.4% Prediction Accuracy on Series A/B Rounds</span>
            <span className="text-xs text-slate-400">Our autonomous risk models have evaluated over 4,200 deeptech transactions with zero false-positive IP clearances.</span>
          </div>
          <Link href="/docs" className="px-5 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-200 text-xs font-bold border border-navy-700 transition-colors shrink-0">
            Review Audit Methodology →
          </Link>
        </div>
      </div>
    </section>
  );
};