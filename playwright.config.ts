import { defineConfig, devices } from '@playwright/test';
import { E2E_ADMIN } from './tests/e2e/support';

/**
 * End-to-end tests run against a production build (`next build && next start`) that uses
 * its own build directory (.next-e2e) and a throwaway database (data/e2e.db), so they
 * never touch development content.
 *
 * The admin credentials in tests/e2e/support.ts exist only in that throwaway database —
 * they are test fixtures, not secrets, and do not grant access to any real deployment.
 */
const baseURL = 'http://localhost:3100';

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  timeout: 45_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'] },
      // Mobile runs the navigation, layout and accessibility checks; admin and SEO flows run once.
      testIgnore: ['**/admin.spec.ts', '**/seo.spec.ts'],
    },
  ],
  webServer: {
    command: 'npm run e2e:serve',
    url: baseURL,
    timeout: 600_000,
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
    env: {
      DATABASE_URL: 'file:./data/e2e.db',
      NEXT_DIST_DIR: '.next-e2e',
      NEXT_PUBLIC_SITE_URL: baseURL,
      E2E_ADMIN_EMAIL: E2E_ADMIN.email,
      E2E_ADMIN_PASSWORD: E2E_ADMIN.password,
      NEXT_TELEMETRY_DISABLED: '1',
    },
  },
});
