import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { useTestApp } from './helpers.js';

describe('health', () => {
  const app = useTestApp();

  it('reports liveness', async () => {
    const res = await request(app()).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ data: { status: 'ok' } });
  });

  it('reports readiness with a live database check', async () => {
    const res = await request(app()).get('/api/v1/health/ready');
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('ok');
    expect(res.body.data.checks.database.state).toBe('up');
    expect(typeof res.body.data.checks.database.latencyMs).toBe('number');
  });
});
