"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Props {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: Props) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      const params = new URLSearchParams({ next: pathname ?? "/" });
      router.replace(`/login?${params.toString()}`);
    }
  }, [loading, user, router, pathname]);

  if (loading) {
    return (
      <div className="container-x pt-20 pb-24 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 text-accent animate-spin" />
          <p className="text-xs font-mono text-bone-300 uppercase tracking-widest">
            Authenticating agent…
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container-x pt-20 pb-24">
        <div className="panel p-16 text-center max-w-lg mx-auto">
          <p className="eyebrow mb-3">[ Restricted ]</p>
          <h2 className="font-display text-3xl text-bone-50 mb-2">Authentication required</h2>
          <p className="text-bone-300 mb-6">Redirecting to sign-in…</p>
          <Loader2 className="w-5 h-5 text-accent animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}