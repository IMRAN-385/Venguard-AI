"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Settings as SettingsIcon, Key, CheckCircle2, AlertCircle, Save, Bot } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [groqApiKey, setGroqApiKey] = useState('');
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [claudeApiKey, setClaudeApiKey] = useState('');
  const [activeProvider, setActiveProvider] = useState<'auto' | 'groq' | 'openai' | 'gemini' | 'claude'>('auto');
  const [envStatus, setEnvStatus] = useState('Checking...');
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/ai/settings');
        if (res.data.settings) {
          setGroqApiKey(res.data.settings.groqApiKey || '');
          setOpenaiApiKey(res.data.settings.openaiApiKey || '');
          setGeminiApiKey(res.data.settings.geminiApiKey || '');
          setClaudeApiKey(res.data.settings.claudeApiKey || '');
          setActiveProvider(res.data.settings.activeProvider || 'auto');
        }
        setEnvStatus(res.data.envStatus || 'Vanguard High-Fidelity Simulation');
      } catch (err) {
        setEnvStatus('Vanguard High-Fidelity Simulation (Default)');
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      await api.put('/ai/settings', { groqApiKey, openaiApiKey, geminiApiKey, claudeApiKey, activeProvider });
      setSuccessMsg('Live API configuration saved securely! Your custom LLM keys are now active.');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to update API settings.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="w-full min-h-screen bg-navy-950 py-20 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-navy-900 border border-navy-800 rounded-3xl p-8 text-center space-y-4">
          <Key className="w-10 h-10 text-primary mx-auto" />
          <h2 className="text-lg font-bold text-white">Authentication Required</h2>
          <p className="text-xs text-slate-400">Please sign in to configure your personal or institutional live API keys.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-navy-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="pb-6 border-b border-navy-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs font-semibold text-primary-light mb-2">
            <SettingsIcon className="w-3.5 h-3.5" />
            <span>Multi-Provider LLM Integration</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Live AI API Key Configuration (`/settings`)</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Connect your own API keys for Groq, OpenAI, Gemini, or Claude. If left blank, our system gracefully runs the Vanguard High-Fidelity Autonomous Simulation engine so everything works zero-config!</p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-primary/40 flex items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Current Active AI Engine</span>
              <span className="text-base font-extrabold text-white">{envStatus}</span>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-secondary/20 border border-secondary/40 text-secondary text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span>Online</span>
          </span>
        </div>

        {successMsg && <div className="bg-secondary/20 border border-secondary/50 rounded-xl p-4 text-xs text-secondary flex items-center gap-2.5 font-bold animate-fadeIn"><CheckCircle2 className="w-5 h-5 text-secondary shrink-0" /><span>{successMsg}</span></div>}
        {errorMsg && <div className="bg-red-500/15 border border-red-500/40 rounded-xl p-3 text-xs text-red-300 flex items-center gap-2.5"><AlertCircle className="w-4 h-4 text-red-400 shrink-0" /><span>{errorMsg}</span></div>}

        <form onSubmit={handleSave} className="glass-panel rounded-3xl p-6 sm:p-8 border border-navy-800 shadow-xl space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">Preferred Primary LLM Provider</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {(['auto', 'groq', 'openai', 'gemini', 'claude'] as const).map((prov) => (
                <button key={prov} type="button" onClick={() => setActiveProvider(prov)} className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all capitalize text-center ${activeProvider === prov ? 'bg-primary text-white border-primary shadow-md' : 'bg-navy-950 border-navy-800 text-slate-400 hover:text-white'}`}>
                  {prov === 'auto' ? 'Auto / Hybrid' : prov}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-2 border-t border-navy-800">
            <div>
              <div className="flex justify-between text-xs mb-1 font-bold"><span className="text-white flex items-center gap-1.5">Groq API Key (Recommended - Llama 3.3 70B)</span><span className="text-slate-500">https://console.groq.com/keys</span></div>
              <input type="password" placeholder="gsk_..." value={groqApiKey} onChange={(e) => setGroqApiKey(e.target.value)} className="w-full px-4 py-3 bg-navy-950 border border-navy-700 focus:border-primary rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none" />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-bold"><span className="text-white">OpenAI API Key (GPT-4o / GPT-4o-mini)</span><span className="text-slate-500">https://platform.openai.com/api-keys</span></div>
              <input type="password" placeholder="sk-..." value={openaiApiKey} onChange={(e) => setOpenaiApiKey(e.target.value)} className="w-full px-4 py-3 bg-navy-950 border border-navy-700 focus:border-primary rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none" />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-bold"><span className="text-white">Google Gemini API Key (Gemini 1.5 Pro)</span><span className="text-slate-500">https://aistudio.google.com</span></div>
              <input type="password" placeholder="AIzaSy..." value={geminiApiKey} onChange={(e) => setGeminiApiKey(e.target.value)} className="w-full px-4 py-3 bg-navy-950 border border-navy-700 focus:border-primary rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none" />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-bold"><span className="text-white">Anthropic Claude API Key (Claude 3.5 Sonnet)</span><span className="text-slate-500">https://console.anthropic.com</span></div>
              <input type="password" placeholder="sk-ant-..." value={claudeApiKey} onChange={(e) => setClaudeApiKey(e.target.value)} className="w-full px-4 py-3 bg-navy-950 border border-navy-700 focus:border-primary rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none" />
            </div>
          </div>

          <button type="submit" disabled={isSaving} className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-extrabold text-sm shadow-[0_0_20px_rgba(59,130,246,0.35)] transition-all flex items-center justify-center gap-2">
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving & Validating Keys...' : 'Save Live API Configuration'}</span>
          </button>
          <p className="text-[11px] text-slate-400 text-center pt-1">🔒 Keys are encrypted and stored within your private MongoDB / local session boundary.</p>
        </form>
      </div>
    </div>
  );
}