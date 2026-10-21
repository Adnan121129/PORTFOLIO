import { PUBLIC_ROUTES, expect, test } from './support';

const ORIGIN = 'http://localhost:3100';

test.describe('search and sharing metadata', () => {
  test('every public page has a unique title, description, canonical URL and social image', async ({
    page,
    request,
  }) => {
    const titles = new Set<string>();
    for (const route of PUBLIC_ROUTES) {
      await page.goto(route);
      const title = await page.title();
      expect(title.length, route).toBeGreaterThan(10);
      expect(titles.has(title), `duplicate title on ${route}`).toBe(false);
      titles.add(title);

      const head = page.locator('head');
      await expect(head.locator('meta[name="description"]'), route).toHaveAttribute(
        'content',
        /.{50,}/,
      );
      await expect(head.locator('link[rel="canonical"]'), route).toHaveAttribute(
        'href',
        route === '/' ? new RegExp(`^${ORIGIN}/?$`) : `${ORIGIN}${route}`,
      );
      await expect(head.locator('meta[property="og:title"]'), route).toHaveAttribute(
        'content',
        /.+/,
      );
      await expect(head.locator('meta[name="twitter:card"]'), route).toHaveAttribute(
        'content',
        'summary_large_image',
      );
      const ogImage = await head
        .locator('meta[property="og:image"]')
        .first()
        .getAttribute('content');
      expect(ogImage, route).toMatch(new RegExp(`^${ORIGIN}/`));
      const image = await request.get(ogImage!.replace(ORIGIN, ''));
      expect(image.status(), ogImage!).toBe(200);
      expect(image.headers()['content-type'], ogImage!).toMatch(/^image\//);
      await expect(head.locator('meta[name="robots"][content*="noindex"]'), route).toHaveCount(0);
    }
  });

  test('structured data is valid JSON with the expected types', async ({ page }) => {
    const typesOn = async (route: string) => {
      await page.goto(route);
      const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
      const parsed = blocks.flatMap((text) => {
        const value = JSON.parse(text);
        return Array.isArray(value) ? value : [value];
      });
      return parsed.map((item) => item['@type']);
    };
    expect(await typesOn('/')).toEqual(expect.arrayContaining(['Person', 'WebSite']));
    expect(await typesOn('/projects/linguasi')).toEqual(
      expect.arrayContaining(['BreadcrumbList', 'SoftwareSourceCode']),
    );
    expect(await typesOn('/writing/ai-as-decision-support')).toEqual(
      expect.arrayContaining(['BreadcrumbList', 'BlogPosting']),
    );
  });

  test('robots.txt and the sitemap expose public pages only', async ({ request }) => {
    const robots = await (await request.get('/robots.txt')).text();
    expect(robots).toContain('Allow: /');
    expect(robots).toContain('Disallow: /admin');
    expect(robots).toContain(`Sitemap: ${ORIGIN}/sitemap.xml`);

    const sitemap = await (await request.get('/sitemap.xml')).text();
    const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) =>
      match[1].replace(ORIGIN, ''),
    );
    expect(urls).toEqual(
      expect.arrayContaining(['/', '/projects', '/research', '/writing', '/about', '/contact']),
    );
    expect(urls.filter((url) => url.startsWith('/projects/'))).toHaveLength(8);
    expect(urls.filter((url) => url.startsWith('/research/'))).toHaveLength(5);
    expect(urls.filter((url) => url.startsWith('/writing/'))).toHaveLength(3);
    expect(urls.some((url) => url.includes('/admin'))).toBe(false);
  });

  test('responses carry security headers', async ({ request }) => {
    const response = await request.get('/');
    const headers = response.headers();
    expect(headers['content-security-policy']).toContain("default-src 'self'");
    expect(headers['content-security-policy']).toContain("frame-ancestors 'none'");
    expect(headers['content-security-policy']).not.toContain('unsafe-eval');
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(headers['x-frame-options']).toBe('DENY');
    expect(headers['x-powered-by']).toBeUndefined();
  });
});
