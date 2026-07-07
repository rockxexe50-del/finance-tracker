import mongoose from 'mongoose';

const STATE_NAMES: Record<number, string> = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
  99: 'uninitialized',
};

export function dbState(): string {
  return STATE_NAMES[mongoose.connection.readyState] ?? 'unknown';
}

export async function connectDB(uri: string): Promise<void> {
  mongoose.connection.on('connected', () => console.log('[db] mongodb connected'));
  mongoose.connection.on('error', (err) => console.error('[db] mongodb error:', err.message));
  mongoose.connection.on('disconnected', () => console.warn('[db] mongodb disconnected'));

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
}
