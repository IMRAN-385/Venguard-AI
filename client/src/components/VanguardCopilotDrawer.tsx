"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Sparkles, X, Send, Bot, User, Terminal, Loader2 } from 'lucide-react';

interface CopilotMessage {
  role: 'user' | 'assistant';
  content: string;
  toolsExecuted?: any[];
}

export const VanguardCopilotDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      role: 'assistant',
      content: `Hello ${user ? user.name.split(' ')[0] : 'Partner'}! I am **Vanguard Copilot**, your autonomous deeptech due diligence & investment intelligence assistant.\n\nI am connected directly to our real-time database of verified AI & DeepTech startup assets. You can ask me to execute specialized institutional tools on the fly:\n\n* **Search & Filter Startups:** *"Find high-scoring Quantum Computing or Biotech startups under $40M valuation."*\n* **Financial ROI Simulation:** *"Calculate a $1M investment check ROI for QuantumScale over 5 years."*\n* **Autonomous Stress Testing:** *"Run a recession stress simulation on Aetheria Synthetic Biology."*`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (promptText?: string) => {
    const textToSend = promptText || input;
    if (!textToSend.trim() || isLoading) return;

    const newMessages = [...messages, { role: 'user' as const, content: textToSend }];
    setMessages(newMessages);
    if (!promptText) setInput('');
    setIsLoading(true);

    try {
      const res = await api.post('/ai/copilot', {
        messages: newMessages.map(m => ({ role: m.role, content: m.content }))
      });
      
      const { reply, executedTools } = res.data;
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: reply, toolsExecuted: executedTools }
      ]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: '⚠️ I encountered a temporary network delay connecting to our autonomous reasoning engine. Please try your query again or verify your API settings.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedPrompts = [
    'Search for high-scoring Quantum Computing startups',
    'Calculate a $1M check ROI for QuantumScale Neural Labs',
    'Run a recession stress simulation on Aetheria Biology',
    'What red flags should I look for in AI Series A cap-tables?'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-navy-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-navy-900 border-l border-navy-800 h-full flex flex-col shadow-2xl relative">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-navy-800 bg-navy-950/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-white flex items-center gap-1.5">
                VANGUARD COPLOT <span className="bg-secondary/20 text-secondary text-[10px] px-1.5 py-0.5 rounded uppercase font-bold">v4.2 Live</span>
              </span>
              <span className="text-[10px] text-slate-400 block">
                Tool-Calling & Autonomous Reasoning Enabled
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-navy-950/50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[82%] space-y-2 ${msg.role === 'user' ? 'order-1' : 'order-2'}`}>
                {/* Tool execution cards if any */}
                {msg.toolsExecuted && msg.toolsExecuted.length > 0 && (
                  <div className="bg-navy-950 border border-secondary/40 rounded-xl p-3 text-xs space-y-2 shadow-inner">
                    <div className="flex items-center gap-1.5 text-secondary font-bold border-b border-navy-800 pb-1.5">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Executed Tool: `{msg.toolsExecuted[0].toolName}`</span>
                    </div>
                    <pre className="text-[10px] text-slate-300 font-mono overflow-x-auto p-2 bg-navy-900 rounded border border-navy-800">
                      {JSON.stringify(msg.toolsExecuted[0].output, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Main bubble */}
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-primary text-white font-medium rounded-tr-none shadow-md'
                      : 'bg-navy-900 border border-navy-800 text-slate-200 rounded-tl-none shadow-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-navy-800 border border-navy-700 flex items-center justify-center text-slate-300 shrink-0 mt-1 order-2">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shrink-0">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <div className="bg-navy-900 border border-navy-800 p-3 rounded-2xl rounded-tl-none text-xs text-slate-300 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                <span>Autonomous engine is reasoning across cap-tables & tools...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Pill Bar */}
        <div className="p-3 bg-navy-900/90 border-t border-navy-800 overflow-x-auto flex gap-2 no-scrollbar">
          {suggestedPrompts.map((sp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sp)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-full bg-navy-950 border border-navy-700 hover:border-primary text-[11px] text-slate-300 whitespace-nowrap transition-colors shrink-0 flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-secondary" />
              <span>{sp}</span>
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-navy-950 border-t border-navy-800">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask Copilot anything or run financial tools..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-navy-900 border border-navy-700 focus:border-primary rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-xl bg-primary hover:bg-primary-dark disabled:opacity-50 text-white transition-all shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 px-1">
            <span>Powered by Vanguard Multi-LLM Agent Architecture</span>
            <span className="text-secondary font-semibold">Ready to run tools</span>
          </div>
        </div>

      </div>
    </div>
  );
};