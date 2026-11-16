import { randomUUID } from 'node:crypto';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express, { Router, type Express } from 'express';
import { pinoHttp } from 'pino-http';
import type { Logger } from 'pino';
import { API_PREFIX } from '@puvin/shared-config';
import type { Env } from './config/env.js';
import { errorHandler, notFoundHandler } from './core/middleware/error-handler.js';
import { corsPolicy, globalRateLimit, securityHeaders } from './core/middleware/security.js';
import { healthRouter } from './modules/health/health.routes.js';
import { publicSiteRouter } from './modules/site/public-site.routes.js';
import { auth } from './modules/cms/auth.js';
import { cmsRouter, publicCmsRouter } from './modules/cms/cms.routes.js';

export interface AppDeps {
  env: Env;
  logger: Logger;
}

/** Builds the Express app without listening, so tests can drive it with supertest. */
export function createApp({ env, logger }: AppDeps): Express {
  const app = express();

  app.disable('x-powered-by');
  // Behind nginx: trust exactly the configured number of proxy hops for req.ip / rate limiting.
  app.set('trust proxy', env.TRUST_PROXY);
  app.set('query parser', 'simple');

  app.use(
    pinoHttp({
      logger,
      genReqId: (req, res) => {
        const incoming = req.headers['x-request-id'];
        const id = typeof incoming === 'string' && /^[\w-]{8,64}$/.test(incoming) ? incoming : randomUUID();
        res.setHeader('X-Request-Id', id);
        return id;
      },
      autoLogging: { ignore: (req) => req.url?.startsWith(`${API_PREFIX}/health`) ?? false },
      serializers: {
        req: (req: { id: unknown; method: string; url: string }) => ({
          id: req.id,
          method: req.method,
          url: req.url,
        }),
      },
    }),
  );

  app.use(securityHeaders());
  app.use(corsPolicy(env));
  app.use(compression());
  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());

  const api = Router();
  api.use('/health', healthRouter());
  api.use(globalRateLimit());
  api.use('/public', publicSiteRouter());
  api.use('/public', publicCmsRouter());
  const session = auth(env);
  api.use('/auth', session.router);
  api.use('/admin', cmsRouter(session.originCheck, session.required));

  app.use(API_PREFIX, api);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
