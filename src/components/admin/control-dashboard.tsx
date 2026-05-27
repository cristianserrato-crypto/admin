"use client";

import { useEffect, useMemo, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { Activity, Cpu, Database, HardDrive, LogOut, MemoryStick, Server, Thermometer, Wifi } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatBytes, formatUptime } from "@/lib/utils";
import type { MetricsPayload } from "@/types/metrics";
import { KpiCard } from "./kpi-card";

type HistoryPoint = {
  time: string;
  cpu: number;
  memory: number;
  disk: number;
  load: number;
};

export function ControlDashboard({ onLogout }: { onLogout: () => void }) {
  const [metrics, setMetrics] = useState<MetricsPayload | null>(null);
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket: Socket = io({ path: "/ws" });
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("metrics", (payload: MetricsPayload) => {
      setMetrics(payload);
      setHistory((current) => {
        const next = [
          ...current,
          {
            time: new Date(payload.timestamp).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
            cpu: payload.cpu.percent,
            memory: payload.memory.percent,
            disk: payload.disk.percent,
            load: payload.host.loadAvg[0] || 0,
          },
        ];
        return next.slice(-36);
      });
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const onlineProjects = useMemo(() => metrics?.projects.filter((project) => project.online).length || 0, [metrics]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    onLogout();
  }

  if (!metrics) {
    return (
      <div className="flex min-h-screen items-center justify-center px-5">
        <div className="glass rounded-lg p-6 text-sm text-slate-300">Inicializando telemetria...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl px-5 py-6 sm:px-8">
      <header className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-cyan-100">
            <span className={`size-2 rounded-full ${connected ? "bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,.8)]" : "bg-red-300"}`} />
            {connected ? "Live telemetry" : "Reconnecting"}
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Infrastructure Control Center</h1>
          <p className="mt-1 text-sm text-slate-400">{metrics.host.hostname} · {metrics.host.platform}</p>
        </div>
        <Button variant="ghost" onClick={logout}>
          <LogOut className="size-4" />
          Salir
        </Button>
      </header>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard icon={Cpu} label="CPU" value={`${metrics.cpu.percent.toFixed(1)}%`} detail={`${metrics.cpu.cores} cores`} />
        <KpiCard icon={MemoryStick} label="RAM" value={`${metrics.memory.percent.toFixed(1)}%`} detail={`${formatBytes(metrics.memory.used)} / ${formatBytes(metrics.memory.total)}`} />
        <KpiCard icon={HardDrive} label="Disco" value={`${metrics.disk.percent.toFixed(1)}%`} detail={`${formatBytes(metrics.disk.available)} libres`} />
        <KpiCard icon={Thermometer} label="Uptime" value={formatUptime(metrics.host.uptimeSeconds)} detail={metrics.cpu.temperatureC ? `${metrics.cpu.temperatureC} C` : "Temperatura N/D"} />
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.45fr_0.95fr]">
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>Consumo en tiempo real</CardTitle>
            <span className="text-xs text-slate-500">{new Date(metrics.timestamp).toLocaleString("es")}</span>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="cpuFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="memoryFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82ff" stopOpacity={0.28} />
                      <stop offset="95%" stopColor="#3b82ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(148,163,184,.08)" vertical={false} />
                  <XAxis dataKey="time" hide />
                  <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(148,163,184,.2)", borderRadius: 8 }} />
                  <Area type="monotone" dataKey="cpu" stroke="#22d3ee" fill="url(#cpuFill)" strokeWidth={2} />
                  <Area type="monotone" dataKey="memory" stroke="#3b82ff" fill="url(#memoryFill)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>Proyectos</CardTitle>
            <span className="text-xs text-cyan-100">{onlineProjects}/{metrics.projects.length} online</span>
          </CardHeader>
          <CardContent className="grid gap-3">
            {metrics.projects.map((project) => (
              <div key={project.name} className="flex items-center justify-between gap-4 rounded-md border border-white/10 bg-slate-950/35 p-3">
                <div>
                  <div className="font-medium text-slate-100">{project.name}</div>
                  <div className="text-xs text-slate-500">{project.url}</div>
                </div>
                <div className="text-right">
                  <div className={project.online ? "text-sm text-emerald-300" : "text-sm text-red-300"}>{project.online ? "Online" : "Offline"}</div>
                  <div className="text-xs text-slate-500">{project.latencyMs} ms</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-3">
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Server className="size-4 text-cyan-100" /> Servicios</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {metrics.services.map((service) => (
              <div key={service.name} className="flex items-center justify-between gap-3 rounded-md bg-white/[0.03] px-3 py-2">
                <span className="truncate text-sm text-slate-200">{service.name}</span>
                <span className={service.active ? "text-xs text-emerald-300" : "text-xs text-red-300"}>{service.subState}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Database className="size-4 text-cyan-100" /> Bases y contenedores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-md border border-white/10 bg-white/[0.03] p-3">
              <div className="text-sm text-slate-200">PostgreSQL</div>
              <div className={metrics.postgres.ok ? "mt-1 text-sm text-emerald-300" : "mt-1 text-sm text-slate-500"}>
                {metrics.postgres.configured ? (metrics.postgres.ok ? `${metrics.postgres.latencyMs} ms · ${metrics.postgres.activeConnections} conexiones` : "Sin respuesta") : "Sin configurar"}
              </div>
            </div>
            {(metrics.docker.length ? metrics.docker : [{ name: "Docker", status: "Sin contenedores activos o no instalado" }]).map((container) => (
              <div key={container.name} className="rounded-md border border-white/10 bg-white/[0.03] p-3">
                <div className="text-sm text-slate-200">{container.name}</div>
                <div className="mt-1 text-xs text-slate-500">{container.status}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Wifi className="size-4 text-cyan-100" /> Red y carga</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <MetricLine label="Load 1m" value={metrics.host.loadAvg[0]?.toFixed(2) || "0"} />
            <MetricLine label="Load 5m" value={metrics.host.loadAvg[1]?.toFixed(2) || "0"} />
            <MetricLine label="Load 15m" value={metrics.host.loadAvg[2]?.toFixed(2) || "0"} />
            <MetricLine label="Mount" value={metrics.disk.mountpoint} />
          </CardContent>
        </Card>
      </section>

      <Card className="mt-5 rounded-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Activity className="size-4 text-cyan-100" /> Logs recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-80 overflow-auto rounded-md border border-white/10 bg-black/35 p-4 font-mono text-xs leading-6 text-slate-400">
            {metrics.logs.length ? metrics.logs.map((line) => <div key={line}>{line}</div>) : <div>Sin logs disponibles</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.03] px-3 py-2">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-sm font-medium text-slate-100">{value}</span>
    </div>
  );
}
