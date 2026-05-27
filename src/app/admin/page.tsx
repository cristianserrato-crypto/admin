"use client";

import { useEffect, useState } from "react";
import { AnimatedBackground } from "@/components/animated-background";
import { ControlDashboard } from "@/components/admin/control-dashboard";
import { LoginPanel } from "@/components/admin/login-panel";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  async function checkSession() {
    const res = await fetch("/api/admin/session", { cache: "no-store" });
    const data = await res.json();
    setAuthenticated(Boolean(data.authenticated));
  }

  useEffect(() => {
    void checkSession();
  }, []);

  return (
    <main className="min-h-screen">
      <AnimatedBackground />
      {authenticated === null ? (
        <div className="flex min-h-screen items-center justify-center px-5">
          <div className="glass rounded-lg p-6 text-sm text-slate-300">Verificando sesion...</div>
        </div>
      ) : authenticated ? (
        <ControlDashboard onLogout={() => setAuthenticated(false)} />
      ) : (
        <LoginPanel onSuccess={() => setAuthenticated(true)} />
      )}
    </main>
  );
}
