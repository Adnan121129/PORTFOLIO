import { expect, test } from './support';

test.describe('theme on first visit', () => {
  // The blocked bundles are reported as failed resource loads.
  test.use({ colorScheme: 'dark', allowConsole: [/Failed to load resource/] });

  test('follows the OS preference before any JavaScript bundle runs (no flash)', async ({
    page,
  }) => {
    // Block the framework bundles: only the inline <head> script can set the theme.
    await page.route(/\/_next\/static\/.*\.js$/, (route) => route.abort());
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    const background = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(background).toBe('rgb(11, 13, 16)');
  });

  test('a stored choice wins over the OS preference', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('theme', 'light'));
    await page.route(/\/_next\/static\/.*\.js$/, (route) => route.abort());
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });
});

test.describe('theme toggle', () => {
  test.use({ colorScheme: 'light' });

  test('switches theme, announces the state and persists across reloads', async ({
    page,
    isMobile,
  }) => {
    await page.goto('/about');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'light');

    if (isMobile) {
      // On small screens the toggle in the header is still available next to the menu.
      await expect(page.getByTestId('theme-toggle').first()).toBeVisible();
    }
    const toggle = page.getByTestId('theme-toggle').first();
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await expect(toggle).toHaveAccessibleName('Dark theme');
    await toggle.click();
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');

    await page.reload();
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await expect(page.getByTestId('theme-toggle').first()).toHaveAttribute('aria-pressed', 'true');
  });
});

test.describe('reduced motion', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' } });

  test('disables scroll reveals and the cursor follower', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).not.toHaveClass(/reveal-on/);
    await page.mouse.move(400, 400);
    await page.mouse.move(420, 420);
    await expect(page.getByTestId('cursor-ring')).not.toHaveAttribute('data-visible', 'true');
    // Content is visible without waiting for any animation.
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});

test.describe('motion with no preference', () => {
  test.use({ contextOptions: { reducedMotion: 'no-preference' } });

  test('the cursor ring follows a mouse but never replaces the native cursor', async ({
    page,
    isMobile,
  }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/reveal-on/);
    const ring = page.getByTestId('cursor-ring');
    await page.mouse.move(400, 300);
    await page.mouse.move(430, 320);
    if (isMobile) {
      // Touch / coarse pointers never get the follower.
      await expect(ring).not.toHaveAttribute('data-visible', 'true');
    } else {
      await expect(ring).toHaveAttribute('data-visible', 'true');
      await expect(ring).toHaveAttribute('aria-hidden', 'true');
      expect(await page.evaluate(() => getComputedStyle(document.body).cursor)).not.toBe('none');
      expect(await ring.evaluate((element) => getComputedStyle(element).pointerEvents)).toBe(
        'none',
      );
    }
  });
});
