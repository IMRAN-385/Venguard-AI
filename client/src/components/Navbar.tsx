"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Shield, Cpu, BarChart3, FileText, PlusCircle, Settings, Menu, X, LogIn, UserCheck, LogOut, Sparkles } from 'lucide-react';

export const Navbar: React.FC<{ onOpenCopilot?: () => void }> = ({ onOpenCopilot }) => {
  const { user, logout, demoLogin } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  // Logged-out minimum routes (> 3)
  const loggedOutLinks = [
    { name: 'Explore Startups', path: '/explore', icon: Cpu },
    { name: 'Vanguard Copilot', path: '/ai/copilot', icon: Sparkles },
    { name: 'Data Analyzer', path: '/ai/analyzer', icon: BarChart3 },
    { name: 'AI Documentation', path: '/docs', icon: FileText },
    { name: 'Pricing', path: '/pricing', icon: Shield },
  ];

  // Logged-in minimum routes (> 5)
  const loggedInLinks = [
    { name: 'Explore Startups', path: '/explore', icon: Cpu },
    { name: 'AI Memo Generator', path: '/ai/generator', icon: FileText },
    { name: 'Smart Matches', path: '/portfolio', icon: Sparkles },
    { name: 'Add Asset', path: '/items/add', icon: PlusCircle },
    { name: 'Manage Assets', path: '/items/manage', icon: BarChart3 },
    { name: 'Live API Settings', path: '/settings', icon: Settings },
  ];

  const currentLinks = user ? loggedInLinks : loggedOutLinks;

  return (
    <nav className="w-full sticky top-0 z-50 backdrop-blur-xl bg-navy-950/90 border-b border-navy-800 transition-all shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)] group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
                VANGUARD <span className="text-primary font-bold">AI</span>
              </span>
              <span className="text-[10px] font-medium tracking-widest text-slate-400 block uppercase -mt-1">
                Autonomous Due Diligence
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {currentLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-primary/15 text-primary border border-primary/30'
                      : 'text-slate-300 hover:text-white hover:bg-navy-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {onOpenCopilot && (
              <button
                onClick={onOpenCopilot}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/40 text-primary-light hover:scale-105 transition-all shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-secondary animate-pulse" />
                Ask Copilot
              </button>
            )}

            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-navy-800">
                <Link
                  href="/settings"
                  className="flex items-center gap-2 text-xs text-slate-300 bg-navy-800/80 hover:bg-navy-700 px-3 py-1.5 rounded-lg border border-navy-700 transition-colors"
                >
                  <UserCheck className="w-4 h-4 text-secondary" />
                  <span className="font-semibold">{user.name.split(' ')[0]}</span>
                  <span className="text-[10px] bg-secondary/20 text-secondary px-1.5 py-0.5 rounded uppercase font-bold">
                    {user.role}
                  </span>
                </Link>
                <button
                  onClick={logout}
                  title="Sign out"
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => demoLogin()}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-secondary/15 hover:bg-secondary/25 border border-secondary/40 text-secondary transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Demo Investor Login
                </button>
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-primary hover:bg-primary-dark text-white shadow-[0_0_15px_rgba(59,130,246,0.25)] transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="lg:hidden flex items-center gap-2">
            {!user && (
              <button
                onClick={() => demoLogin()}
                className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-secondary/20 text-secondary border border-secondary/40"
              >
                Demo Login
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-navy-900 border-b border-navy-800 px-4 pt-3 pb-5 space-y-2 animate-fadeIn">
          {currentLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  active ? 'bg-primary/20 text-primary font-semibold' : 'text-slate-300 hover:bg-navy-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.name}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-navy-800 flex flex-col gap-2">
            {user ? (
              <div className="flex items-center justify-between px-2 py-1">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <UserCheck className="w-4 h-4 text-secondary" />
                  <span>{user.name}</span>
                </div>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="text-xs text-red-400 hover:underline flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-xs font-semibold rounded-lg bg-navy-800 text-white"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-xs font-semibold rounded-lg bg-primary text-white"
                >
                  Register Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};