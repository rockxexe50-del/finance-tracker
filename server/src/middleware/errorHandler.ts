import type { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({ error: 'invalid id' });
    return;
  }

  if (err instanceof mongoose.mongo.MongoServerError && err.code === 11000) {
    res.status(409).json({ error: 'duplicate value' });
    return;
  }

  console.error('[error]', err);
  res.status(500).json({ error: 'internal server error' });
}
