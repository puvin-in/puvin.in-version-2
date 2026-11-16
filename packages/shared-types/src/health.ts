export type DependencyState = 'up' | 'down';

export interface HealthDto {
  status: 'ok' | 'degraded';
  version: string;
  uptimeSeconds: number;
  timestamp: string;
  checks: {
    database: { state: DependencyState; latencyMs?: number };
  };
}
