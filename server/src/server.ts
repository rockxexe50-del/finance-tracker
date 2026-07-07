import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB, dbState } from './config/db';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', db: dbState() });
});

const PORT = Number(process.env.PORT) || 5000;

async function bootstrap(): Promise<void> {
  const uri = process.env.MONGO_URI;

  if (uri) {
    try {
      await connectDB(uri);
    } catch (err) {
      // keep the server up even without a DB — /api/health reports the real connection state
      console.error('[db] connection failed:', (err as Error).message);
    }
  } else {
    console.warn('[db] MONGO_URI is not set — starting without database');
  }

  app.listen(PORT, () => {
    console.log(`[server] http://localhost:${PORT} (db: ${dbState()})`);
  });
}

bootstrap();
