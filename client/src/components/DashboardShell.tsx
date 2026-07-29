"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Compass, Wallet, Plus, Settings, Sparkles,
  FileText, BarChart3, LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { CopilotFAB } from "./CopilotFAB";

const groups = [
  {
    title: "Cockpit",
    items: [
      { href: "/portfolio",     label: "Portfolio",    icon: LayoutDashboard },
      { href: "/items/manage",  label: "My assets",    icon: Wallet },
      { href: "/items/add",     label: "Add asset",    icon: Plus },
    ],
  },
  {
    title: "Discover",
    items: [
      { href: "/explore",       label: "Explore",      icon: Compass },
    ],
  },
  {
    title: "Agents",
    items: [
      { href: "/ai/copilot",    label: "Copilot",      icon: Sparkles },
      { href: "/ai/generator",  label: "Memo generator", icon: FileText },
      { href: "/ai/analyzer",   label: "Data analyzer", icon: BarChart3 },
    ],
  },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="container-x pt-10 pb-24">
      <div className="grid lg:grid-cols-12 gap-5">
        {/* Sidebar */}
        <aside className="lg:col-span-3">
          <div className="panel p-5 lg:sticky lg:top-28">
            {/* User */}
            <div className="p-3 rounded-2xl bg-ink-800/60 border border-ink-600/40 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                  <span className="text-ink-950 font-bold text-sm">
                    {user?.name?.charAt(0) ?? "V"}
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-bone-50 truncate">{user?.name ?? "Investor"}</div>
                  <div className="text-[11px] text-bone-300 truncate">{user?.email}</div>
                </div>
              </div>
            </div>

            {/* Nav groups */}
            <div className="space-y-6">
              {groups.map((g) => (
                <div key={g.title}>
                  <p className="eyebrow mb-2 px-2">{g.title}</p>
                  <nav className="space-y-1">
                    {g.items.map((item) => {
                      const Icon = item.icon;
                      const active = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition ${
                            active
                              ? "bg-ink-800 text-bone-50"
                              : "text-bone-200 hover:bg-ink-800/60 hover:text-bone-50"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              ))}
            </div>

            {/* Bottom */}
            <div className="mt-6 pt-6 border-t border-ink-600/40 space-y-1">
              <Link
                href="/settings"
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition ${
                  pathname === "/settings"
                    ? "bg-ink-800 text-bone-50"
                    : "text-bone-200 hover:bg-ink-800/60"
                }`}
              >
                <Settings className="w-4 h-4" /> Settings
              </Link>
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-bone-200 hover:bg-ink-800/60 hover:text-orange-400 transition"
              >
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="lg:col-span-9">{children}</main>
      </div>

      <CopilotFAB />
    </div>
  );
}