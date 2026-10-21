import { expect, test } from './support';

const SAMPLE = {
  slug: 'missing-data-is-not-zero',
  title: 'Missing data is not zero: honest monthly KPIs for factory sustainability',
};

test.describe('writing', () => {
  test('lists published articles with a featured story, categories and a feed', async ({
    page,
  }) => {
    await page.goto('/writing');
    await expect(page.getByTestId('writing-count')).toHaveText('3 published articles');
    await expect(page.getByText('Featured', { exact: true })).toBeVisible();
    await expect(page.locator('[data-post]')).toHaveCount(3);
    await expect(page.getByRole('link', { name: 'Subscribe via RSS' })).toHaveAttribute(
      'href',
      '/writing/feed.xml',
    );

    const categories = page.getByRole('navigation', { name: 'Categories' });
    await categories.getByRole('link', { name: /^Data & BI/ }).click();
    await expect(page).toHaveURL('/writing?category=data-bi');
    await expect(page.getByTestId('writing-count')).toContainText('2 articles in Data & BI');
    await expect(categories.getByRole('link', { name: /^Data & BI/ })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  test('searches titles and full text, with a clear empty state', async ({ page }) => {
    await page.goto('/writing');
    const search = page.getByRole('searchbox', { name: 'Search articles' });
    await search.fill('websockets');
    await search.press('Enter');
    await expect(page).toHaveURL('/writing?q=websockets');
    await expect(page.getByTestId('writing-count')).toHaveText(/1 article matching “websockets”/);
    await expect(page.locator('[data-post="ai-as-decision-support"]')).toBeVisible();

    await search.fill('zzzz-no-such-word');
    await search.press('Enter');
    await expect(page.getByTestId('writing-empty')).toContainText('No articles match.');
    await page.getByRole('link', { name: 'Show all articles' }).click();
    await expect(page).toHaveURL('/writing');
  });

  test('an article has metadata, a table of contents, sharing, related posts and a way back', async ({
    page,
    context,
    isMobile,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto(`/writing/${SAMPLE.slug}`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(SAMPLE.title);
    await expect(page.locator('article header')).toContainText(/\d+ min read/);
    await expect(page.locator('article header time').first()).toHaveAttribute(
      'datetime',
      /^\d{4}-\d{2}-\d{2}T/,
    );

    const toc = page.getByRole('navigation', { name: 'On this page' });
    if (isMobile) await toc.locator('summary').click();
    await expect(toc.getByRole('link', { name: 'Rule 3: Missing is never zero' })).toBeVisible();
    await toc.getByRole('link', { name: 'Rule 3: Missing is never zero' }).click();
    await expect(page).toHaveURL(/#rule-3-missing-is-never-zero$/);

    await page.getByTestId('copy-link').click();
    await expect(page.getByTestId('copy-link')).toHaveText('Link copied');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      `http://localhost:3100/writing/${SAMPLE.slug}`,
    );

    await expect(page.getByRole('heading', { name: 'Related reading' })).toBeVisible();
    await page.getByTestId('back-to-writing').click();
    await expect(page).toHaveURL('/writing');
  });

  test('the RSS feed lists published articles only', async ({ request }) => {
    const response = await request.get('/writing/feed.xml');
    expect(response.headers()['content-type']).toContain('xml');
    const xml = await response.text();
    expect(xml.match(/<item>/g)).toHaveLength(3);
    expect(xml).toContain(`<link>http://localhost:3100/writing/${SAMPLE.slug}</link>`);
  });
});

test.describe('missing articles', () => {
  test.use({ allowConsole: [/status of 404/] });

  test('unknown slugs return a real 404', async ({ page }) => {
    const response = await page.goto('/writing/not-an-article');
    expect(response?.status()).toBe(404);
  });
});
