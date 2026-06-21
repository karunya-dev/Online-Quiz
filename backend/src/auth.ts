import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { pool } from "./db.js";
import { config } from "./config.js";

export type AuthUser = {
  id: string;
  email: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  name: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signToken(user: AuthUser) {
  return jwt.sign(user, config.jwtSecret, { expiresIn: "8h" });
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  try {
    const payload = jwt.verify(header.slice(7), config.jwtSecret) as AuthUser;
    const { rows } = await pool.query("select id, email, role, name from users where id = $1", [payload.id]);
    if (!rows[0]) return res.status(401).json({ message: "Unauthorized access" });
    req.user = rows[0];
    next();
  } catch {
    res.status(401).json({ message: "Unauthorized access" });
  }
}

export function requireRole(...roles: AuthUser["role"][]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}
