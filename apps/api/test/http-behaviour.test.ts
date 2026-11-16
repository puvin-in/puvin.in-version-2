import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { loadEnv } from '../src/config/env.js';
import { useTestApp } from './helpers.js';

describe('HTTP behaviour', () => {
  const app = useTestApp();

  it('returns the error envelope for unknown routes', async () => {
    const res = await request(app()).get('/api/v1/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body.error).toMatchObject({ code: 'NOT_FOUND' });
  });

  it('rejects malformed JSON with 400 and no stack trace', async () => {
    const res = await request(app())
      .post('/api/v1/public/site')
      .set('Content-Type', 'application/json')
      .send('{"broken":');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('BAD_REQUEST');
    expect(JSON.stringify(res.body)).not.toMatch(/at .*\.(ts|js):\d+/);
  });

  it('sets security headers and hides the framework', async () => {
    const res = await request(app()).get('/api/v1/health');
    expect(res.headers['x-powered-by']).toBeUndefined();
    expect(res.headers['content-security-policy']).toContain("default-src 'none'");
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-request-id']).toBeTruthy();
  });

  it('allows configured origins and refuses others for CORS', async () => {
    const allowed = await request(app())
      .get('/api/v1/health')
      .set('Origin', 'http://localhost:4200');
    expect(allowed.headers['access-control-allow-origin']).toBe('http://localhost:4200');

    const denied = await request(app()).get('/api/v1/health').set('Origin', 'https://evil.example');
    expect(denied.headers['access-control-allow-origin']).toBeUndefined();
  });
});

describe('environment validation', () => {
  it('refuses an in-memory database in production', () => {
    expect(() => loadEnv({ NODE_ENV: 'production', MONGODB_URI: 'memory' })).toThrow(/MONGODB_URI/);
  });

  it('applies safe defaults in development', () => {
    const env = loadEnv({});
    expect(env.NODE_ENV).toBe('development');
    expect(env.API_PORT).toBe(4100);
  });
});
