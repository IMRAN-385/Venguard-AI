"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Shield, Mail, Lock, LogIn, Sparkles, AlertCircle, Globe, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { login, demoLogin, googleLogin, error, clearError } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('elena.rostova@vc-syndicate.io');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsSubmitting(true);
    const success = await login({ email, password });
    setIsSubmitting(false);
    if (success) router.push('/explore');
  };

  const handleDemoLogin = async () => {
    setEmail('demo.investor@vanguard-ai.io');
    setPassword('Vanguard2026!');
    setIsSubmitting(true);
    const success = await demoLogin();
    setIsSubmitting(false);
    if (success) router.push('/explore');
  };

  const handleGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmailInput) return;
    setIsSubmitting(true);
    const success = await googleLogin(googleEmailInput, 'Verified Google Partner Account');
    setIsSubmitting(false);
    setShowGoogleModal(false);
    if (success) router.push('/explore');
  };

  return (
    <div className="w-full min-h-[85vh] bg-navy-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-md w-full glass-panel rounded-3xl p-8 border border-primary/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <Shield className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">VANGUARD <span className="text-primary font-bold">AI</span></span>
          </Link>
          <h1 className="text-2xl font-extrabold text-white tracking-tight pt-2">Sign In to Autonomous Intelligence</h1>
          <p className="text-xs text-slate-400">Access institutional due diligence tools, cap-table simulations, and multi-LLM workflows.</p>
        </div>

        {error && (
          <div className="bg-red-500/15 border border-red-500/40 rounded-xl p-3 text-xs text-red-300 flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1"><span className="font-bold block">Authentication Notice</span><span>{error}</span></div>
          </div>
        )}

        <div className="bg-secondary/15 border border-secondary/40 rounded-2xl p-4 text-center space-y-2.5">
          <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-secondary">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>Instant Syndicate Access (No Signup Required)</span>
          </div>
          <button onClick={handleDemoLogin} disabled={isSubmitting} className="w-full py-2.5 rounded-xl bg-secondary hover:bg-secondary-dark text-navy-950 font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2">
            <span>Auto-Fill & Sign In as Demo Lead Partner</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <span className="text-[10px] text-slate-400 block">Auto-fills (`demo.investor@vanguard-ai.io` / `Vanguard2026!`)</span>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-navy-800"></div>
          <span className="flex-shrink mx-4 text-slate-500 text-[11px] uppercase font-bold tracking-wider">Or Use Standard Credentials</span>
          <div className="flex-grow border-t border-navy-800"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Institutional Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input type="email" required placeholder="partner@fund.vc" value={email} onChange={(e) => { setEmail(e.target.value); clearError(); }} className="w-full pl-10 pr-4 py-3 bg-navy-950 border border-navy-700 focus:border-primary rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300">Security Password</label>
              <span className="text-[11px] text-primary hover:underline cursor-pointer">Forgot access key?</span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input type="password" required placeholder="••••••••••••" value={password} onChange={(e) => { setPassword(e.target.value); clearError(); }} className="w-full pl-10 pr-4 py-3 bg-navy-950 border border-navy-700 focus:border-primary rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all" />
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-bold text-xs shadow-[0_0_20px_rgba(59,130,246,0.35)] transition-all flex items-center justify-center gap-2">
            <LogIn className="w-4 h-4" />
            <span>{isSubmitting ? 'Authenticating Token...' : 'Sign In to Dashboard'}</span>
          </button>
        </form>

        <div className="pt-2">
          <button onClick={() => setShowGoogleModal(true)} type="button" className="w-full py-3 rounded-xl bg-navy-950 hover:bg-navy-800 border border-navy-700 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2.5 shadow-inner">
            <Globe className="w-4 h-4 text-red-400" />
            <span>Continue with Google Account</span>
          </button>
        </div>

        <div className="text-center pt-2 border-t border-navy-800 text-xs text-slate-400">
          Not part of the syndicate yet? <Link href="/register" className="text-primary font-bold hover:underline">Register Institutional Account</Link>
        </div>
      </div>

      {showGoogleModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="max-w-sm w-full bg-navy-900 border border-navy-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 border-b border-navy-800 pb-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md"><Globe className="w-6 h-6 text-blue-600" /></div>
              <div><h3 className="font-extrabold text-base text-white">Sign in with Google</h3><span className="text-[11px] text-slate-400 block">oauth.google.com — Verified Partner Protocol</span></div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">Select or enter your Google Verified Partner email to instantly authenticate via JWT:</p>
            <form onSubmit={handleGoogleSubmit} className="space-y-3">
              <input type="email" required value={googleEmailInput} onChange={(e) => setGoogleEmailInput(e.target.value)} placeholder="partner@fund.vc" className="w-full px-3 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white focus:outline-none focus:border-primary" />
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowGoogleModal(false)} className="flex-1 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-300 text-xs font-bold">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold shadow-md">Confirm & Sign In</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}