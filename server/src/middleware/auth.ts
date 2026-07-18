import type { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../services/authService';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : undefined;

  if (!token) {
    res.status(401).json({ error: 'missing bearer token' });
    return;
  }

  try {
    req.userId = verifyToken(token, 'access');
    next();
  } catch {
    res.status(401).json({ error: 'invalid or expired token' });
  }
}
