import os from "node:os";
import fs from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { Pool } from "pg";

const execFileAsync = promisify(execFile);

type ServiceState = {
  name: string;
  active: boolean;
  subState: string;
  description: string;
};

const projectTargets = [
  { name: "Cerbis", url: process.env.CERBIS_URL || "https://cerbis.online" },
  { name: "Majic3D", url: process.env.MAJIC3D_URL || "https://majic3d.online" },
  { name: "FinCSDash", url: process.env.FINCSDASH_URL || "https://fincsdash.online" },
  { name: "Serata", url: process.env.SERATA_URL || "https://serata.online" },
];

function cpuAverage() {
  const cpus = os.cpus();
  let idle = 0;
  let total = 0;
  for (const cpu of cpus) {
    idle += cpu.times.idle;
    total += Object.values(cpu.times).reduce((sum, value) => sum + value, 0);
  }
  return { idle, total };
}

let lastCpu = cpuAverage();

function cpuUsage() {
  const current = cpuAverage();
  const idle = current.idle - lastCpu.idle;
  const total = current.total - lastCpu.total;
  lastCpu = current;
  return Math.max(0, Math.min(100, 100 - (idle / Math.max(total, 1)) * 100));
}

async function diskUsage() {
  try {
    const { stdout } = await execFileAsync("df", ["-B1", "/"], { timeout: 5000 });
    const lines = stdout.trim().split("\n");
    const row = lines[1]?.split(/\s+/);
    if (!row || row.length < 6) throw new Error("df sin datos");
    return {
      filesystem: row[0],
      total: Number(row[1]),
      used: Number(row[2]),
      available: Number(row[3]),
      percent: Number(row[4].replace("%", "")),
      mountpoint: row[5],
    };
  } catch {
    return { filesystem: "/", total: 0, used: 0, available: 0, percent: 0, mountpoint: "/" };
  }
}

async function readTemperature() {
  try {
    const zones = await fs.readdir("/sys/class/thermal");
    for (const zone of zones.filter((item) => item.startsWith("thermal_zone"))) {
      const raw = await fs.readFile(`/sys/class/thermal/${zone}/temp`, "utf8");
      const value = Number(raw.trim());
      if (Number.isFinite(value) && value > 0) return Math.round(value / 100) / 10;
    }
  } catch {
    return null;
  }
  return null;
}

async function services(): Promise<ServiceState[]> {
  const watched = [
    "nginx.service",
    "ssh.service",
    "cloudflared.service",
    "postgresql@16-main.service",
    "ia-amigo.service",
    "majic3d-landing.service",
  ];
  const rows = await Promise.all(
    watched.map(async (name) => {
      try {
        const { stdout } = await execFileAsync("systemctl", ["show", name, "--property=ActiveState,SubState,Description", "--no-pager"], { timeout: 5000 });
        const map = Object.fromEntries(stdout.trim().split("\n").map((line) => {
          const [key, ...rest] = line.split("=");
          return [key, rest.join("=")];
        }));
        return {
          name,
          active: map.ActiveState === "active",
          subState: map.SubState || "unknown",
          description: map.Description || name,
        };
      } catch {
        return { name, active: false, subState: "unknown", description: name };
      }
    }),
  );
  return rows;
}

async function dockerState() {
  try {
    const { stdout } = await execFileAsync("docker", ["ps", "--format", "{{.Names}}|{{.Status}}"], { timeout: 5000 });
    return stdout.trim().split("\n").filter(Boolean).map((line) => {
      const [name, status] = line.split("|");
      return { name, status };
    });
  } catch {
    return [];
  }
}

async function healthChecks() {
  return Promise.all(projectTargets.map(async (target) => {
    const started = performance.now();
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(target.url, { method: "HEAD", signal: controller.signal });
      clearTimeout(timeout);
      return {
        ...target,
        online: res.ok || res.status < 500,
        status: res.status,
        latencyMs: Math.round(performance.now() - started),
      };
    } catch {
      return {
        ...target,
        online: false,
        status: 0,
        latencyMs: Math.round(performance.now() - started),
      };
    }
  }));
}

async function postgresState() {
  const hasConfig = Boolean(process.env.DB_HOST && process.env.DB_NAME && process.env.DB_USER && process.env.DB_PASSWORD);
  if (!hasConfig) return { configured: false, ok: false, latencyMs: null, activeConnections: null };
  const pool = new Pool({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT || 5432),
    max: 1,
    connectionTimeoutMillis: 2500,
  });
  const started = performance.now();
  try {
    const result = await pool.query("select count(*)::int as total from pg_stat_activity");
    await pool.end();
    return {
      configured: true,
      ok: true,
      latencyMs: Math.round(performance.now() - started),
      activeConnections: result.rows[0]?.total ?? null,
    };
  } catch {
    await pool.end().catch(() => {});
    return { configured: true, ok: false, latencyMs: Math.round(performance.now() - started), activeConnections: null };
  }
}

async function recentLogs() {
  try {
    const { stdout } = await execFileAsync("journalctl", ["-n", "18", "--no-pager", "--output=short-iso"], { timeout: 6000 });
    return stdout.trim().split("\n").filter(Boolean).slice(-18);
  } catch {
    return [];
  }
}

export async function collectMetrics() {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const [disk, temp, serviceRows, containers, projects, postgres, logs] = await Promise.all([
    diskUsage(),
    readTemperature(),
    services(),
    dockerState(),
    healthChecks(),
    postgresState(),
    recentLogs(),
  ]);

  return {
    timestamp: new Date().toISOString(),
    host: {
      hostname: os.hostname(),
      platform: `${os.type()} ${os.release()}`,
      uptimeSeconds: os.uptime(),
      loadAvg: os.loadavg(),
    },
    cpu: {
      percent: Math.round(cpuUsage() * 10) / 10,
      cores: os.cpus().length,
      model: os.cpus()[0]?.model || "CPU",
      temperatureC: temp,
    },
    memory: {
      total: totalMem,
      used: usedMem,
      free: freeMem,
      percent: Math.round((usedMem / totalMem) * 1000) / 10,
    },
    disk,
    network: os.networkInterfaces(),
    services: serviceRows,
    docker: containers,
    projects,
    postgres,
    logs,
  };
}
