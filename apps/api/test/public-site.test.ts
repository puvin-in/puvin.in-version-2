import request from 'supertest';
import { describe, expect, it } from 'vitest';
import type { PublicSiteDto } from '@puvin/shared-types';
import { ServiceModel } from '../src/modules/services/service.model.js';
import { ProfileModel } from '../src/modules/site/profile.model.js';
import { seedInitialContent } from '../src/seed/seed.js';
import { useTestApp } from './helpers.js';

describe('GET /api/v1/public/site', () => {
  const app = useTestApp();

  it('returns 503 with a clear message before the site is seeded', async () => {
    const res = await request(app()).get('/api/v1/public/site');
    expect(res.status).toBe(503);
    expect(res.body.error.code).toBe('SERVICE_UNAVAILABLE');
    expect(res.body.error.requestId).toBeTruthy();
  });

  it('returns seeded content from MongoDB', async () => {
    const report = await seedInitialContent();
    expect(report).toMatchObject({ settings: 'created', profile: 'created' });
    expect(report.skillsCreated).toBeGreaterThan(0);

    const res = await request(app()).get('/api/v1/public/site');
    expect(res.status).toBe(200);

    const site = res.body.data as PublicSiteDto;
    expect(site.profile.displayName).toBe('Poornima Thanaraju');
    expect(site.branding.brandName).toBe('PUVIN');
    expect(site.seo.indexable).toBe(false);
    expect(site.skills.map((s) => s.name)).toContain('MongoDB');
    expect(site.services.length).toBe(report.servicesCreated);
    // Internal fields never leak into the public payload.
    expect(site.profile).not.toHaveProperty('_id');
    expect(site.profile).not.toHaveProperty('__v');
  });

  it('does not invent contact details or social profiles', async () => {
    const res = await request(app()).get('/api/v1/public/site');
    const site = res.body.data as PublicSiteDto;
    expect(site.profile.email).toBeUndefined();
    expect(site.profile.phone).toBeUndefined();
    expect(site.profile.social).toEqual([]);
  });

  it('is idempotent and never overwrites CMS edits', async () => {
    await ProfileModel.updateOne({ _id: 'owner' }, { headline: 'Edited in CMS' });
    const report = await seedInitialContent();
    expect(report).toEqual({ settings: 'kept', profile: 'kept', skillsCreated: 0, servicesCreated: 0 });

    const res = await request(app()).get('/api/v1/public/site');
    expect(res.body.data.profile.headline).toBe('Edited in CMS');
  });

  it('only exposes published services', async () => {
    await ServiceModel.updateOne({ slug: 'website-modernization' }, { status: 'draft' });
    const res = await request(app()).get('/api/v1/public/site');
    const slugs = (res.body.data as PublicSiteDto).services.map((s) => s.slug);
    expect(slugs).not.toContain('website-modernization');
    expect(slugs).toContain('full-stack-web-development');
  });
});
