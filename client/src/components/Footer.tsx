"use client";

import React from 'react';
import Link from 'next/link';
import { Shield, Mail, MapPin, Phone, Globe, Award, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-navy-950 border-t border-navy-800 text-slate-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-navy-800/80">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <Shield className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                VANGUARD <span className="text-primary font-bold">AI</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Vanguard AI is the premier autonomous due diligence and investment intelligence platform. We combine multi-agent LLM workflows with verifiable deeptech cap-table and patent audits to empower institutional venture capital syndicates globally.
            </p>
            <div className="flex items-center gap-3 text-xs font-semibold text-secondary bg-secondary/10 border border-secondary/30 px-3 py-1.5 rounded-lg w-fit">
              <Award className="w-4 h-4" />
              <span>SOC2 Type II Certified Autonomous Engine</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Platform Intelligence</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/explore" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <span>Explore Startups</span>
                </Link>
              </li>
              <li>
                <Link href="/ai/copilot" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span>Vanguard Copilot</span>
                </Link>
              </li>
              <li>
                <Link href="/ai/generator" className="hover:text-primary transition-colors">
                  Due Diligence Generator
                </Link>
              </li>
              <li>
                <Link href="/ai/analyzer" className="hover:text-primary transition-colors">
                  Cap-Table Data Analyzer
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-primary transition-colors">
                  Smart Matches Engine
                </Link>
              </li>
            </ul>
          </div>

          {/* Institutional & Legal */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Institutional</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">About Vanguard</Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-primary transition-colors">Agent Architecture</Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-primary transition-colors">Syndicate Pricing</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">Contact Intelligence Team</Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Global Headquarters</h4>
            <div className="flex items-start gap-2.5 text-xs text-slate-300">
              <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block">Chattogram / Dhaka R&D Hub</span>
                <span>Agrabad Tech & Innovation Tower, Chattogram, Bangladesh (GMT+6)</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300 pt-1">
              <Mail className="w-4 h-4 text-primary shrink-0" />
              <a href="mailto:intelligence@vanguard-ai.io" className="hover:text-white transition-colors">
                intelligence@vanguard-ai.io
              </a>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <Phone className="w-4 h-4 text-primary shrink-0" />
              <span>+880 (17) 9840-2026</span>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              <span className="text-[11px] font-medium text-slate-400">All Autonomous Agents Operational</span>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Vanguard AI Institutional Platform. Built with Next.js & Multi-Agent LLMs.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacy Protocol</span>
            <span className="hover:text-slate-400 cursor-pointer">SOC2 Compliance</span>
            <span className="hover:text-slate-400 cursor-pointer flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" />
              <span>Asia/Dhaka HQ</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};