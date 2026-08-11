import next from "next";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import http from "node:http";
import { Server as SocketIOServer } from "socket.io";
import { z } from "zod";
import { loadEnvConfig } from "@next/env";
import { clearSessionCookie, createSessionToken, getSessionFromRequest, requireAdmin, setSessionCookie, verifySessionToken } from "./auth";
import { collectMetrics } from "./metrics";

loadEnvConfig(process.cwd());

const dev = process.env.NODE_ENV !== "production";
const port = Number(process.env.PORT || 3010);
const app = next({ dev });
const handle = app.getRequestHandler();

const loginSchema = z.object({
  token: z.string().min(16),
});

async function main() {
  await app.prepare();

  const server = express();
  const httpServer = http.createServer(server);
  const io = new SocketIOServer(httpServer, {
    path: "/ws",
    cors: { origin: false },
  });

  server.set("trust proxy", 1);
  server.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }));
  server.use(express.json({ limit: "64kb" }));
  server.use(cookieParser());
  server.use("/project-backgrounds", express.static("public/project-backgrounds", {
    immutable: true,
    maxAge: "30d",
  }));

  const authLimiter = rateLimit({
    windowMs: 60_000,
    limit: 8,
    standardHeaders: true,
    legacyHeaders: false,
  });

  server.post("/api/admin/login", authLimiter, (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    const expected = process.env.ADMIN_ACCESS_TOKEN;
    if (!expected || expected.length < 24) {
      return res.status(503).json({ error: "ADMIN_ACCESS_TOKEN no configurado" });
    }
    if (!parsed.success || parsed.data.token !== expected) {
      return res.status(401).json({ error: "Credenciales invalidas" });
    }
    const token = createSessionToken();
    setSessionCookie(res, token);
    return res.json({ ok: true });
  });

  server.post("/api/admin/logout", requireAdmin, (_req, res) => {
    clearSessionCookie(res);
    return res.json({ ok: true });
  });

  server.get("/api/admin/session", (req, res) => {
    const claims = getSessionFromRequest(req);
    return res.json({ authenticated: Boolean(claims), role: claims?.role || null });
  });

  server.get("/api/admin/metrics", requireAdmin, async (_req, res) => {
    return res.json(await collectMetrics());
  });

  io.use((socket, nextSocket) => {
    const cookieHeader = socket.handshake.headers.cookie || "";
    const cookies = Object.fromEntries(cookieHeader.split(";").map((item) => {
      const [key, ...value] = item.trim().split("=");
      return [key, decodeURIComponent(value.join("=") || "")];
    }));
    const claims = verifySessionToken(cookies.cs_admin_session);
    if (!claims) return nextSocket(new Error("unauthorized"));
    return nextSocket();
  });

  io.on("connection", (socket) => {
    let closed = false;
    const emitMetrics = async () => {
      if (closed) return;
      try {
        socket.emit("metrics", await collectMetrics());
      } catch (error) {
        socket.emit("metrics:error", { message: "No se pudieron leer metricas" });
      }
    };
    void emitMetrics();
    const interval = setInterval(emitMetrics, 5000);
    socket.on("disconnect", () => {
      closed = true;
      clearInterval(interval);
    });
  });

  server.all("*", (req, res) => handle(req, res));

  httpServer.listen(port, () => {
    console.log(`cristianserrato.online app listening on http://127.0.0.1:${port}`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
