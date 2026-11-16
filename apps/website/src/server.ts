import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join, resolve } from 'node:path';
import { existsSync } from 'node:fs';

const browserDistFolder = join(import.meta.dirname, '../browser');
const sourceCandidates = [
  resolve(import.meta.dirname, '../../../../../app'),
  resolve('app'),
  resolve('../../app'),
];
const immersiveRoot = sourceCandidates.find((path) => existsSync(join(path, 'index.html')));

const app = express();
const angularApp = new AngularNodeAppEngine();

app.disable('x-powered-by');

/**
 * Baseline security headers. The full Content-Security-Policy (with hashes for Angular's
 * inline scripts) is tuned in Phase 6; nginx adds HSTS in production.
 */
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

/** Liveness probe for Docker / the load balancer. */
app.get('/healthz', (_req, res) => {
  res.json({ status: 'ok' });
});

// Ship the owner's immersive homepage as authored. Angular renders the CMS
// collection and detail pages, while this document owns its WebGL lifecycle.
if (immersiveRoot) {
  app.get('/', (_req, res) => res.sendFile(join(immersiveRoot, 'index.html')));
  app.get('/about', (_req, res) => res.redirect('/#intro'));
  app.use('/assets', express.static(join(immersiveRoot, 'assets'), { index: false, redirect: false }));
}

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
