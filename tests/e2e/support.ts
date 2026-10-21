import { test as base, expect, type Page } from '@playwright/test';

/** Test-only admin account created in the throwaway e2e database (see playwright.config.ts). */
export const E2E_ADMIN = {
  email: 'e2e-admin@example.test',
  password: 'e2e only passphrase 7d1c',
};

export const CONTACT = {
  whatsapp:
    'https://wa.me/8801851633134?text=Hello%20Adnan%2C%20I%20visited%20your%20portfolio%20and%20would%20like%20to%20start%20a%20conversation.',
  email: 'https://mail.google.com/mail/?view=cm&fs=1&to=mdadnan899%40gmail.com',
  mailto: 'mailto:mdadnan899@gmail.com',
  linkedin: 'https://www.linkedin.com/in/muhammad-adnan-55778b242/',
  github: 'https://github.com/Adnan121129',
};

export const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/projects',
  '/projects/plantops-intelligence',
  '/projects/omnimanager',
  '/research',
  '/research/nirapotta',
  '/writing',
  '/writing/ai-as-decision-support',
  '/contact',
];

type Fixtures = {
  /** Console messages matching these patterns are expected (e.g. a deliberate 404). */
  allowConsole: RegExp[];
};

/**
 * Every test fails if the page logs a console error or throws an uncaught exception.
 * External destinations (WhatsApp, Gmail, LinkedIn, GitHub) are stubbed so tests never
 * leave the machine.
 */
export const test = base.extend<Fixtures>({
  allowConsole: [[], { option: true }],
  page: async ({ page, allowConsole }, provide) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() !== 'error') return;
      const text = message.text();
      const source = message.location().url;
      if (!allowConsole.some((pattern) => pattern.test(text)))
        errors.push(source ? `${text} (${source})` : text);
    });
    page.on('pageerror', (error) => errors.push(error.message));
    await page
      .context()
      .route(/^https:\/\/(wa\.me|mail\.google\.com|www\.linkedin\.com|github\.com)\//, (route) =>
        route.fulfill({
          status: 200,
          contentType: 'text/html',
          body: '<!doctype html><title>External stub</title>',
        }),
      );
    await provide(page);
    expect(errors, 'console errors').toEqual([]);
  },
});

export { expect };

export async function signIn(page: Page, next = '/admin') {
  await page.goto(`/admin/login?next=${encodeURIComponent(next)}`);
  await page.getByLabel('Email').fill(E2E_ADMIN.email);
  await page.getByLabel('Password').fill(E2E_ADMIN.password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL((url) => url.pathname === next);
}

/** The page's horizontal overflow in CSS pixels (0 when nothing sticks out). */
export async function horizontalOverflow(page: Page): Promise<number> {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
}
