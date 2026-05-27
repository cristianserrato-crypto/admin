import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const COOKIE_NAME = "cs_admin_session";

export type AdminClaims = {
  role: "admin";
  iat?: number;
  exp?: number;
};

function jwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 24) {
    throw new Error("JWT_SECRET debe existir y tener al menos 24 caracteres.");
  }
  return secret;
}

export function createSessionToken() {
  return jwt.sign({ role: "admin" }, jwtSecret(), {
    expiresIn: "8h",
    issuer: "cristianserrato.online",
    audience: "admin",
  });
}

export function verifySessionToken(token?: string): AdminClaims | null {
  if (!token) return null;
  try {
    return jwt.verify(token, jwtSecret(), {
      issuer: "cristianserrato.online",
      audience: "admin",
    }) as AdminClaims;
  } catch {
    return null;
  }
}

export function sessionCookieOptions() {
  const secure = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 1000 * 60 * 60 * 8,
  };
}

export function setSessionCookie(res: Response, token: string) {
  res.cookie(COOKIE_NAME, token, sessionCookieOptions());
}

export function clearSessionCookie(res: Response) {
  res.clearCookie(COOKIE_NAME, { path: "/" });
}

export function getSessionFromRequest(req: Request) {
  return verifySessionToken(req.cookies?.[COOKIE_NAME]);
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const claims = getSessionFromRequest(req);
  if (!claims || claims.role !== "admin") {
    return res.status(401).json({ error: "No autorizado" });
  }
  return next();
}

