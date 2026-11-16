import { z } from 'zod';

const booleanString = z
  .enum(['true', 'false'])
  .default('false')
  .transform((v) => v === 'true');

const csv = z
  .string()
  .default('')
  .transform((v) =>
    v
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  );

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    API_PORT: z.coerce.number().int().min(1).max(65535).default(4100),
    API_HOST: z.string().default('0.0.0.0'),
    WEBSITE_URL: z.string().url().default('http://localhost:4200'),
    ADMIN_URL: z.string().url().default('http://localhost:4300/admin/'),
    /** Extra browser origins allowed by CORS (comma separated). Same-origin needs none. */
    CORS_ORIGINS: csv,
    /**
     * `memory` starts a persistent local MongoDB via mongodb-memory-server
     * (development only; data lives in .data/mongo).
     */
    MONGODB_URI: z.string().min(1).default('memory'),
    MONGODB_DB_NAME: z.string().default('puvin'),
    LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
    TRUST_PROXY: z.coerce.number().int().min(0).max(5).default(1),
    API_DOCS_PUBLIC: booleanString,
  })
  .superRefine((env, ctx) => {
    if (env.NODE_ENV === 'production' && env.MONGODB_URI === 'memory') {
      ctx.addIssue({
        code: 'custom',
        path: ['MONGODB_URI'],
        message: 'An in-memory database is not allowed in production',
      });
    }
  });

export type Env = z.infer<typeof envSchema>;

export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const parsed = envSchema.safeParse(source);
  if (!parsed.success) {
    const problems = parsed.error.issues
      .map((i) => `  - ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n');
    throw new Error(`Invalid environment configuration:\n${problems}`);
  }
  return parsed.data;
}
