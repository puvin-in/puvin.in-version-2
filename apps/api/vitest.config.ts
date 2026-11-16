import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
    globalSetup: ['test/global-setup.ts'],
    // Each file gets its own database on the shared in-memory server.
    fileParallelism: true,
    testTimeout: 20_000,
    hookTimeout: 120_000,
  },
});
