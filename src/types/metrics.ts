export type MetricsPayload = {
  timestamp: string;
  host: {
    hostname: string;
    platform: string;
    uptimeSeconds: number;
    loadAvg: number[];
  };
  cpu: {
    percent: number;
    cores: number;
    model: string;
    temperatureC: number | null;
  };
  memory: {
    total: number;
    used: number;
    free: number;
    percent: number;
  };
  disk: {
    filesystem: string;
    total: number;
    used: number;
    available: number;
    percent: number;
    mountpoint: string;
  };
  services: {
    name: string;
    active: boolean;
    subState: string;
    description: string;
  }[];
  docker: {
    name: string;
    status: string;
  }[];
  projects: {
    name: string;
    url: string;
    online: boolean;
    status: number;
    latencyMs: number;
  }[];
  postgres: {
    configured: boolean;
    ok: boolean;
    latencyMs: number | null;
    activeConnections: number | null;
  };
  logs: string[];
};
