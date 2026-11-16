import { loadEnv } from '../config/env.js';
import { connectDatabase } from '../core/db.js';
import { createLogger } from '../core/logger.js';
import { seedInitialContent } from '../seed/seed.js';

const env = loadEnv();
const logger = createLogger(env);
const db = await connectDatabase(env, logger);

try {
  const report = await seedInitialContent();
  logger.info(report, 'Seed complete');
} catch (err) {
  logger.error({ err }, 'Seed failed');
  process.exitCode = 1;
} finally {
  await db.close();
}
