import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import type { RequestHandler } from 'express';
import type { ApiErrorBody } from '@puvin/shared-types';
import type { Env } from '../../config/env.js';

/**
 * The API only ever returns JSON, so its CSP can be locked down completely.
 * The website's CSP is set by the SSR server / nginx.
 */
export function securityHeaders(): RequestHandler {
  return helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: { defaultSrc: ["'none'"], frameAncestors: ["'none'"] },
    },
    crossOriginResourcePolicy: { policy: 'same-site' },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  });
}

/**
 * Production traffic is same-origin through nginx, so CORS only needs to allow the dev
 * servers and any explicitly configured origins. Credentials are allowed for the cookie session.
 */
export function corsPolicy(env: Pick<Env, 'WEBSITE_URL' | 'ADMIN_URL' | 'CORS_ORIGINS'>): RequestHandler {
  const allowed = new Set([
    new URL(env.WEBSITE_URL).origin,
    new URL(env.ADMIN_URL).origin,
    ...env.CORS_ORIGINS,
  ]);
  return cors({
    origin: (origin, callback) => callback(null, !origin || allowed.has(origin)),
    credentials: true,
    methods: ['GET', 'HEAD', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'X-XSRF-TOKEN', 'If-Match', 'X-Request-Id'],
    maxAge: 600,
  });
}

const rateLimitedBody: ApiErrorBody = {
  error: { code: 'RATE_LIMITED', message: 'Too many requests, please slow down' },
};

/** Broad per-IP ceiling for the whole API. Stricter limiters wrap login and public forms. */
export function globalRateLimit(): RequestHandler {
  return rateLimit({
    windowMs: 60_000,
    limit: 300,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: rateLimitedBody,
  });
}
