import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import mongoose from 'mongoose';
import type { Logger } from 'pino';
import type { Env } from '../config/env.js';

// Reject query operators ($ne, $gt …) smuggled in through user-supplied filter values.
mongoose.set('sanitizeFilter', true);
mongoose.set('strictQuery', true);

export interface DatabaseHandle {
  uri: string;
  close(): Promise<void>;
}

/** Repo-root .data/mongo, so the dev database survives restarts. */
const DEV_DB_PATH = resolve(import.meta.dirname, '../../../../.data/mongo');

async function startDevMemoryServer(log: Logger): Promise<{ uri: string; stop(): Promise<void> }> {
  // Dev-only dependency: imported lazily so production images never need it.
  const { MongoMemoryServer } = await import('mongodb-memory-server');
  await mkdir(DEV_DB_PATH, { recursive: true });
  const server = await MongoMemoryServer.create({
    instance: { dbPath: DEV_DB_PATH, storageEngine: 'wiredTiger', port: 27018 },
  });
  log.warn({ dbPath: DEV_DB_PATH }, 'Using local mongodb-memory-server (development only)');
  return { uri: server.getUri(), stop: async () => void (await server.stop({ doCleanup: false })) };
}

export async function connectDatabase(
  env: Pick<Env, 'MONGODB_URI' | 'MONGODB_DB_NAME'>,
  log: Logger,
): Promise<DatabaseHandle> {
  let uri = env.MONGODB_URI;
  let stopMemory: (() => Promise<void>) | undefined;

  if (uri === 'memory') {
    const mem = await startDevMemoryServer(log);
    uri = mem.uri;
    stopMemory = mem.stop;
  }

  await mongoose.connect(uri, {
    dbName: env.MONGODB_DB_NAME,
    serverSelectionTimeoutMS: 10_000,
    autoIndex: true,
  });
  log.info({ db: env.MONGODB_DB_NAME }, 'MongoDB connected');

  return {
    uri,
    async close() {
      await mongoose.disconnect();
      await stopMemory?.();
    },
  };
}

export async function pingDatabase(): Promise<{ up: boolean; latencyMs?: number }> {
  const db = mongoose.connection.db;
  if (mongoose.connection.readyState !== 1 || !db) return { up: false };
  const started = performance.now();
  try {
    await db.admin().ping();
    return { up: true, latencyMs: Math.round(performance.now() - started) };
  } catch {
    return { up: false };
  }
}
