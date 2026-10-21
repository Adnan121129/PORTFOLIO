import { expect, test } from './support';

test.describe('site navigation', () => {
  test('the first Tab reaches a working skip link', async ({ page }) => {
    await page.goto('/about');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to main content' });
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main-content')).toBeFocused();
  });

  test('the header marks the current section', async ({ page, isMobile }) => {
    test.skip(isMobile, 'The desktop navigation is replaced by the menu on small screens.');
    await page.goto('/projects/linguasi');
    const nav = page.getByRole('navigation', { name: 'Main' });
    await expect(nav.getByRole('link', { name: 'Projects' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(nav.getByRole('link', { name: 'Writing' })).not.toHaveAttribute(
      'aria-current',
      'page',
    );
    await nav.getByRole('link', { name: 'Research' }).click();
    await expect(page).toHaveURL('/research');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('the mobile menu traps focus, closes with Escape and on navigation', async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, 'The menu button is only shown on small screens.');
    await page.goto('/');
    const button = page.getByRole('button', { name: 'Menu' });
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await button.click();
    const dialog = page.getByRole('dialog', { name: 'Site menu' });
    await expect(dialog).toBeVisible();
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Tab');
    expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(button).toBeFocused();

    await button.click();
    await dialog.getByRole('link', { name: 'Projects' }).click();
    await expect(page).toHaveURL('/projects');
    await expect(dialog).toBeHidden();
    // Previously visited pages stay in the DOM (hidden), so count visible cards only.
    await expect(page.getByTestId('read-case-study').filter({ visible: true })).toHaveCount(8);

    // Contact actions inside the menu keep their exact destinations.
    await button.click();
    await expect(dialog.getByRole('link', { name: /^Start a Conversation/ })).toHaveAttribute(
      'href',
      /^https:\/\/wa\.me\/8801851633134/,
    );
    await dialog.getByRole('button', { name: 'Close' }).click();
    await expect(dialog).toBeHidden();
  });
});

test.describe('not found', () => {
  test.use({ allowConsole: [/status of 404/] });

  test('unknown URLs get a branded 404 with a way back', async ({ page }) => {
    const response = await page.goto('/this/page/does-not-exist');
    expect(response?.status()).toBe(404);
    await expect(page).toHaveTitle(/Page not found/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('This page isn’t in the');
    await page
      .locator('main')
      .getByRole('link', { name: /Projects/ })
      .first()
      .click();
    await expect(page).toHaveURL('/projects');
  });
});
