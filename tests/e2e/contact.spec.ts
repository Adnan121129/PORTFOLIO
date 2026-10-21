import { CONTACT, PUBLIC_ROUTES, expect, test } from './support';

const actions = [
  { id: 'whatsapp', label: 'Start a Conversation', href: CONTACT.whatsapp },
  { id: 'email', label: 'Contact with Email', href: CONTACT.email },
  { id: 'linkedin', label: 'Contact with LinkedIn', href: CONTACT.linkedin },
  { id: 'github', label: 'Visit to GitHub', href: CONTACT.github },
] as const;

test.describe('contact actions', () => {
  test('the hero shows all four actions with the exact destinations', async ({ page }) => {
    await page.goto('/');
    const hero = page.getByTestId('contact-actions').first();
    for (const action of actions) {
      const link = hero.locator(`[data-contact="${action.id}"]`);
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', action.href);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      await expect(link).toContainText(action.label);
      // The accessible name starts with the visible label (WCAG 2.5.3).
      await expect(link).toHaveAccessibleName(new RegExp(`^${action.label}`));
    }
    await expect(page.locator('[data-contact="mailto"]').first()).toHaveAttribute(
      'href',
      CONTACT.mailto,
    );
  });

  test('actions are keyboard operable and open the destination in a new tab', async ({
    page,
    context,
  }) => {
    await page.goto('/');
    const link = page.getByTestId('contact-actions').first().locator('[data-contact="whatsapp"]');
    await link.focus();
    await expect(link).toBeFocused();
    const opened = context.waitForEvent('page');
    await page.keyboard.press('Enter');
    const popup = await opened;
    await popup.waitForLoadState();
    expect(popup.url()).toBe(CONTACT.whatsapp);
    await expect(page).toHaveURL('/');
  });

  test('the contact page lists every channel and the email fallback', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('conversation');
    await expect(page.locator('main [data-contact="whatsapp"]').first()).toHaveAttribute(
      'href',
      CONTACT.whatsapp,
    );
    await expect(page.locator('main [data-contact="email"]').first()).toHaveAttribute(
      'href',
      CONTACT.email,
    );
    await expect(page.locator('main [data-contact="mailto"]').first()).toHaveAttribute(
      'href',
      CONTACT.mailto,
    );
    await expect(page.locator('main [data-contact="linkedin"]').first()).toHaveAttribute(
      'href',
      CONTACT.linkedin,
    );
    await expect(page.locator('main [data-contact="github"]').first()).toHaveAttribute(
      'href',
      CONTACT.github,
    );
  });

  test('the message composer validates, then opens WhatsApp with the drafted text', async ({
    page,
    context,
  }) => {
    await page.goto('/contact');
    const composer = page.getByTestId('message-composer');
    await composer.getByRole('button', { name: 'Send via WhatsApp' }).click();
    await expect(composer.getByRole('alert')).toContainText('Please fix these before continuing');

    await composer.getByLabel(/Your name/).fill('Playwright Visitor');
    await composer.getByLabel(/Message/).fill('Hello from the end-to-end test suite.');
    const opened = context.waitForEvent('page');
    await composer.getByRole('button', { name: 'Send via WhatsApp' }).click();
    const popup = await opened;
    await popup.waitForLoadState();
    const url = new URL(popup.url());
    expect(url.origin + url.pathname).toBe('https://wa.me/8801851633134');
    expect(url.searchParams.get('text')).toContain('Hello from the end-to-end test suite.');
    expect(url.searchParams.get('text')).toContain('— Playwright Visitor');
    await expect(composer.getByRole('status')).toContainText('Opened WhatsApp with your message');
  });

  test('no page ships placeholder links', async ({ page }) => {
    for (const route of PUBLIC_ROUTES) {
      await page.goto(route);
      await expect(page.locator('a[href="#"], a[href=""], a:not([href])'), route).toHaveCount(0);
    }
  });
});
