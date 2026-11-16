import { Router } from 'express';
import type { HealthDto } from '@puvin/shared-types';
import { pingDatabase } from '../../core/db.js';
import { ok } from '../../core/http.js';

const VERSION = process.env['npm_package_version'] ?? '0.1.0';

export function healthRouter(): Router {
  const router = Router();

  /** Liveness: the process is up. Never touches dependencies. */
  router.get('/', (_req, res) => {
    ok(res, { status: 'ok' as const });
  });

  /** Readiness: dependencies are reachable. Returns 503 so load balancers stop routing. */
  router.get('/ready', async (_req, res) => {
    const db = await pingDatabase();
    const body: HealthDto = {
      status: db.up ? 'ok' : 'degraded',
      version: VERSION,
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
      checks: {
        database: {
          state: db.up ? 'up' : 'down',
          ...(db.latencyMs !== undefined ? { latencyMs: db.latencyMs } : {}),
        },
      },
    };
    ok(res, body, db.up ? 200 : 503);
  });

  return router;
}
