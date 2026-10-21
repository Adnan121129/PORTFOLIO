import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      // `server-only` throws outside a React Server Components bundle; unit tests import
      // server modules directly, so it is replaced with an empty module here.
      'server-only': path.resolve(import.meta.dirname, 'tests/unit/stubs/server-only.ts'),
    },
  },
  test: {
    include: ['tests/unit/**/*.test.{ts,tsx}'],
    environment: 'node',
    setupFiles: ['tests/unit/setup.ts'],
    // Database tests each use their own temporary SQLite file.
    testTimeout: 20_000,
  },
});
