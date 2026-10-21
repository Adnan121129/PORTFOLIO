import { PUBLIC_ROUTES, expect, test } from './support';

test.describe('links', () => {
  test('crawling every internal link from the home page finds no broken pages', async ({
    page,
    request,
    isMobile,
  }) => {
    test.skip(isMobile, 'Links are the same on every viewport.');
    test.slow();
    const queue = ['/'];
    const visited = new Set<string>();
    const broken: string[] = [];
    while (queue.length) {
      const path = queue.shift()!;
      if (visited.has(path)) continue;
      visited.add(path);
      const response = await request.get(path);
      if (response.status() >= 400) {
        broken.push(`${path} → ${response.status()}`);
        continue;
      }
      if (!(response.headers()['content-type'] ?? '').includes('text/html')) continue;
      await page.goto(path);
      const hrefs = await page
        .locator('main a[href^="/"], header a[href^="/"], footer a[href^="/"]')
        .evaluateAll((links) => links.map((link) => link.getAttribute('href')!));
      for (const href of hrefs) {
        const target = href.split('#')[0] || path;
        if (!visited.has(target) && !queue.includes(target)) queue.push(target);
      }
    }
    expect(broken).toEqual([]);
    const pages = [...visited];
    expect(pages.filter((url) => url.startsWith('/projects/'))).toHaveLength(8);
    expect(pages.filter((url) => url.startsWith('/research/'))).toHaveLength(5);
    expect(
      pages.filter((url) => /^\/writing\/[a-z0-9-]+$/.test(url)).length,
    ).toBeGreaterThanOrEqual(3);
  });

  test('links that open a new tab are safe and announced', async ({ page }) => {
    for (const route of PUBLIC_ROUTES) {
      await page.goto(route);
      const offenders = await page.locator('a[target="_blank"]').evaluateAll((links) =>
        links
          .filter((link) => {
            const rel = link.getAttribute('rel') ?? '';
            const name = `${link.getAttribute('aria-label') ?? ''} ${link.textContent ?? ''}`;
            return !rel.includes('noopener') || !/new tab/i.test(name);
          })
          .map((link) => link.outerHTML.slice(0, 160)),
      );
      expect(offenders, route).toEqual([]);
    }
  });
});

test.describe('when images fail to load', () => {
  test.use({ allowConsole: [/Failed to load resource/] });

  test('pages stay readable and every action still works', async ({ page }) => {
    await page.route(/\.(png|jpe?g|webp|avif|gif)(\?|$)|\/_next\/image|\/media\//, (route) =>
      route.abort(),
    );
    for (const route of ['/', '/about', '/writing/ai-as-decision-support']) {
      await page.goto(route);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      const images = page.locator('main img');
      for (const image of await images.all()) {
        // Informative images keep their text alternative; decorative ones are marked as such.
        expect(await image.getAttribute('alt'), route).not.toBeNull();
      }
    }
    await page.goto('/');
    await expect(page.getByTestId('contact-actions').first().locator('[data-contact]')).toHaveCount(
      4,
    );
    await page.getByTestId('read-case-study').filter({ visible: true }).first().click();
    await expect(page).toHaveURL(/\/projects\/[a-z-]+$/);
  });
});
