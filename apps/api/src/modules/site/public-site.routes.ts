import { Router } from 'express';
import { ok } from '../../core/http.js';
import { getPublicSite } from './site.service.js';

export function publicSiteRouter(): Router {
  const router = Router();

  router.get('/site', async (_req, res) => {
    const site = await getPublicSite();
    // Short shared cache; publishing bumps contentVersion and the CDN purge hook (Phase 4).
    res.set('Cache-Control', 'public, max-age=0, s-maxage=60, stale-while-revalidate=300');
    ok(res, site);
  });

  return router;
}
