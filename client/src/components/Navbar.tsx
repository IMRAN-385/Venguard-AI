"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const publicLinks = [
  { href: "/explore", label: "Explore" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/docs", label: "Docs" },
];

const authedLinks = [
  { href: "/explore", label: "Explore" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/ai/copilot", label: "Copilot" },
  { href: "/ai/analyzer", label: "Analyzer" },
  { href: "/items/manage", label: "Manage" },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = user ? authedLinks : publicLinks;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-ink-950/80 backdrop-blur-xl border-b border-ink-600/40"
          : "bg-transparent"
      }`}
    >
      <div className="container-x flex items-center justify-between h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-ink-950 font-bold text-sm">V</span>
          </div>
          <span className="font-display text-xl text-bone-50 tracking-tight">
            Vanguard<span className="text-accent">.</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  active
                    ? "bg-ink-800 text-bone-50"
                    : "text-bone-200 hover:text-bone-50 hover:bg-ink-900"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <>
              <span className="text-xs text-bone-300">{user.email}</span>
              <button onClick={logout} className="btn-ghost">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-bone-200 hover:text-bone-50 px-3">
                Sign In
              </Link>
              <Link href="/register" className="btn-primary">
                Join Vanguard <ArrowUpRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full border border-ink-600/60 text-bone-100"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-ink-600/40 bg-ink-950/95 backdrop-blur-xl">
          <div className="container-x py-6 flex flex-col gap-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-2xl text-bone-100 hover:bg-ink-800"
              >
                {l.label}
              </Link>
            ))}
            <div className="h-px bg-ink-600/40 my-3" />
            {user ? (
              <button onClick={logout} className="btn-ghost w-full justify-center">
                Sign Out
              </button>
            ) : (
              <>
                <Link href="/login" className="btn-ghost w-full justify-center">Sign In</Link>
                <Link href="/register" className="btn-primary w-full justify-center">Join Vanguard</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}