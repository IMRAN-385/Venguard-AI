"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Shield, User, Mail, Lock, UserPlus, AlertCircle, Award, CheckSquare, Square } from 'lucide-react';

export default function RegisterPage() {
  const { register, error, clearError } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [riskTolerance, setRiskTolerance] = useState<'Conservative' | 'Moderate' | 'Aggressive'>('Moderate');
  const [selectedSectors, setSelectedSectors] = useState<string[]>(['Generative AI', 'Quantum Computing']);
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableSectors = ['Generative AI', 'Quantum Computing', 'Biotech & Genomics', 'Robotics & Automation', 'CleanTech & Fusion'];

  const toggleSector = (sector: string) => {
    if (selectedSectors.includes(sector)) {
      setSelectedSectors(selectedSectors.filter(s => s !== sector));
    } else {
      setSelectedSectors([...selectedSectors, sector]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    clearError();

    if (!name.trim() || !email.trim() || !password) {
      setValidationError('All account fields are required.');
      return;
    }
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match. Please verify.');
      return;
    }

    setIsSubmitting(true);
    const success = await register({
      name,
      email,
      password,
      riskTolerance,
      preferredSectors: selectedSectors.length > 0 ? selectedSectors : ['Generative AI']
    });
    setIsSubmitting(false);

    if (success) {
      router.push('/portfolio');
    }
  };

  return (
    <div className="w-full min-h-[90vh] bg-navy-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[300px] bg-secondary/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-2xl w-full glass-panel rounded-3xl p-8 sm:p-10 border border-primary/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md"><Shield className="w-6 h-6" /></div>
            <span className="font-extrabold text-xl tracking-tight text-white">VANGUARD <span className="text-primary font-bold">AI</span></span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight pt-2">Register Institutional Account & Investor Profile</h1>
          <p className="text-xs text-slate-400 max-w-md mx-auto">Your risk profile directly informs our Autonomous Smart Recommendation Engine (`Feature B`).</p>
        </div>

        {(validationError || error) && (
          <div className="bg-red-500/15 border border-red-500/40 rounded-xl p-3 text-xs text-red-300 flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1"><span className="font-bold block">Registration Error</span><span>{validationError || error}</span></div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Full Name & Institutional Title</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input type="text" required placeholder="e.g., Marcus Vance (Senior Venture Partner)" value={name} onChange={(e) => { setName(e.target.value); setValidationError(''); }} className="w-full pl-10 pr-4 py-3 bg-navy-950 border border-navy-700 focus:border-primary rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all" />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Institutional Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input type="email" required placeholder="e.g., marcus@vanguard-ai.io" value={email} onChange={(e) => { setEmail(e.target.value); setValidationError(''); }} className="w-full pl-10 pr-4 py-3 bg-navy-950 border border-navy-700 focus:border-primary rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Password (Min 6 chars)</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input type="password" required placeholder="••••••••••••" value={password} onChange={(e) => { setPassword(e.target.value); setValidationError(''); }} className="w-full pl-10 pr-4 py-3 bg-navy-950 border border-navy-700 focus:border-primary rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input type="password" required placeholder="••••••••••••" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setValidationError(''); }} className="w-full pl-10 pr-4 py-3 bg-navy-950 border border-navy-700 focus:border-primary rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all" />
              </div>
            </div>
          </div>

          <div className="bg-navy-950/80 rounded-2xl p-5 border border-navy-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-navy-800 pb-2.5">
              <Award className="w-4 h-4 text-secondary" />
              <span className="font-extrabold text-xs text-white uppercase tracking-wider">Step 2: Investor Profile Configuration</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Target Risk Tolerance & Hurdle Rate</label>
              <div className="grid grid-cols-3 gap-2.5">
                {(['Conservative', 'Moderate', 'Aggressive'] as const).map((level) => (
                  <button key={level} type="button" onClick={() => setRiskTolerance(level)} className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${riskTolerance === level ? 'bg-primary text-white border-primary shadow-md' : 'bg-navy-900 border-navy-800 text-slate-400 hover:text-white'}`}>{level}</button>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5">* Conservative prioritizes 90+ AI safety scores; Aggressive highlights early Seed 20x+ upside targets.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Preferred DeepTech Investment Sectors</label>
              <div className="flex flex-wrap gap-2">
                {availableSectors.map((sector) => {
                  const isChecked = selectedSectors.includes(sector);
                  return (
                    <button key={sector} type="button" onClick={() => toggleSector(sector)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${isChecked ? 'bg-secondary/20 text-secondary border-secondary/40' : 'bg-navy-900 border-navy-800 text-slate-400 hover:text-white'}`}>
                      {isChecked ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
                      <span>{sector}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-bold text-xs shadow-[0_0_20px_rgba(59,130,246,0.35)] transition-all flex items-center justify-center gap-2">
            <UserPlus className="w-4 h-4" />
            <span>{isSubmitting ? 'Creating Investor Account...' : 'Complete Registration & View Smart Matches'}</span>
          </button>
        </form>

        <div className="text-center pt-2 border-t border-navy-800 text-xs text-slate-400">
          Already part of the syndicate? <Link href="/login" className="text-primary font-bold hover:underline">Sign In Here</Link>
        </div>
      </div>
    </div>
  );
}