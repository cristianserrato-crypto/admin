"use client";

import { FormEvent, useState } from "react";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LoginPanel({ onSuccess }: { onSuccess: () => void }) {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Acceso no autorizado");
      return;
    }
    onSuccess();
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <form onSubmit={submit} className="glass holo-border w-full max-w-md rounded-lg p-6">
        <div className="flex size-12 items-center justify-center rounded-md border border-cyan-200/20 bg-cyan-200/10">
          <ShieldCheck className="size-6 text-cyan-100" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold text-white">Admin Control Center</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">cristianserrato.online</p>
        <label className="mt-8 block text-sm text-slate-300" htmlFor="token">
          Token de acceso
        </label>
        <div className="mt-2 flex items-center gap-2 rounded-md border border-white/10 bg-slate-950/70 px-3">
          <LockKeyhole className="size-4 text-cyan-100/70" />
          <input
            id="token"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            type="password"
            autoComplete="current-password"
            className="h-12 min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
            placeholder="Token seguro"
          />
        </div>
        {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
        <Button className="mt-6 w-full" disabled={loading}>
          {loading ? "Validando..." : "Entrar"}
        </Button>
      </form>
    </div>
  );
}
