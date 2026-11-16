import { randomUUID } from 'node:crypto';
import mongoose from 'mongoose';
import { afterAll, beforeAll, inject } from 'vitest';
import type { Express } from 'express';
import { createApp } from '../src/app.js';
import { loadEnv } from '../src/config/env.js';
import { createLogger } from '../src/core/logger.js';

/**
 * Connects to a fresh database for the calling test file and returns a getter for the app.
 * The database is dropped when the file finishes.
 */
export function useTestApp(): () => Express {
  let app: Express | undefined;

  beforeAll(async () => {
    const env = loadEnv({ NODE_ENV: 'test', MONGODB_URI: inject('mongoUri') });
    await mongoose.connect(env.MONGODB_URI, { dbName: `test-${randomUUID()}` });
    app = createApp({ env, logger: createLogger(env) });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  return () => {
    if (!app) throw new Error('Test app not initialised');
    return app;
  };
}
