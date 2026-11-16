import { createApp } from './app.js';
import { loadEnv } from './config/env.js';
import { connectDatabase } from './core/db.js';
import { createLogger } from './core/logger.js';

const env = loadEnv();
const logger = createLogger(env);

const db = await connectDatabase(env, logger);
const app = createApp({ env, logger });

const server = app.listen(env.API_PORT, env.API_HOST, () => {
  logger.info({ port: env.API_PORT, env: env.NODE_ENV }, 'API listening');
});

let shuttingDown = false;

async function shutdown(signal: string): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;
  logger.info({ signal }, 'Shutting down');

  // Stop accepting connections, let in-flight requests finish, then close the DB.
  const forceExit = setTimeout(() => {
    logger.error('Graceful shutdown timed out; forcing exit');
    process.exit(1);
  }, 15_000);
  forceExit.unref();

  server.close(async () => {
    await db.close();
    logger.info('Shutdown complete');
    process.exit(0);
  });
  server.closeIdleConnections();
}

process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('unhandledRejection', (reason) => {
  logger.error({ err: reason }, 'Unhandled promise rejection');
});
