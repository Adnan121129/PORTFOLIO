import AxeBuilder from '@axe-core/playwright';
import { PUBLIC_ROUTES, expect, horizontalOverflow, test } from './support';

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

for (const scheme of ['light', 'dark'] as const) {
  test.describe(`accessibility (${scheme} theme)`, () => {
    test.use({ colorScheme: scheme, contextOptions: { reducedMotion: 'reduce' } });

    for (const route of [...PUBLIC_ROUTES, '/admin/login']) {
      test(`${route} has no WCAG 2.2 A/AA violations`, async ({ page }) => {
        await page.goto(route);
        await expect(page.locator('html')).toHaveAttribute('data-theme', scheme);
        const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
        const summary = results.violations.map(
          (violation) =>
            `${violation.id} (${violation.impact}): ${violation.nodes.map((node) => node.target.join(' ')).join(', ')}`,
        );
        expect(summary).toEqual([]);
      });
    }
  });
}

test.describe('accessibility of the 404 page', () => {
  test.use({ allowConsole: [/status of 404/], contextOptions: { reducedMotion: 'reduce' } });

  test('has no WCAG 2.2 A/AA violations', async ({ page }) => {
    await page.goto('/missing-page');
    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
    expect(results.violations.map((violation) => violation.id)).toEqual([]);
  });
});

test.describe('responsive layout', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' } });

  for (const width of [320, 375, 768, 1024, 1440]) {
    test(`no horizontal scrolling at ${width}px`, async ({ page, isMobile }) => {
      test.skip(isMobile, 'Widths are set explicitly in this test.');
      await page.setViewportSize({ width, height: 900 });
      for (const route of PUBLIC_ROUTES) {
        await page.goto(route);
        expect(await horizontalOverflow(page), `${route} at ${width}px`).toBe(0);
      }
    });
  }

  test('touch targets for the primary actions are at least 24px', async ({ page }) => {
    await page.goto('/');
    const targets = page.locator('header a, header button, [data-testid="contact-actions"] a');
    const count = await targets.count();
    for (let index = 0; index < count; index++) {
      const target = targets.nth(index);
      if (!(await target.isVisible())) continue;
      const box = await target.boundingBox();
      expect(box!.height, await target.innerText()).toBeGreaterThanOrEqual(24);
      expect(box!.width, await target.innerText()).toBeGreaterThanOrEqual(24);
    }
  });
});
