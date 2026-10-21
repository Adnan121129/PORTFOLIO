import sharp from 'sharp';
import { E2E_ADMIN, expect, signIn, test } from './support';

// Every admin test signs in for itself; they share one database, so run them in order.
test.describe.configure({ mode: 'serial' });

test.describe('admin access', () => {
  test('requires a session and is never indexed', async ({ page, request }) => {
    const response = await page.goto('/admin');
    await expect(page).toHaveURL('/admin/login?next=%2Fadmin');
    expect(response?.headers()['x-robots-tag']).toBe('noindex, nofollow, noarchive');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);

    const login = await request.get('/admin/login');
    expect(login.headers()['x-robots-tag']).toBe('noindex, nofollow, noarchive');
    const robots = await (await request.get('/robots.txt')).text();
    expect(robots).toMatch(/Disallow: \/admin/);
  });

  test('rejects a wrong password without revealing which part was wrong', async ({ page }) => {
    await page.goto('/admin/login');
    await page.getByLabel('Email').fill(E2E_ADMIN.email);
    await page.getByLabel('Password').fill('not the right password');
    await page.getByRole('button', { name: 'Sign in' }).click();
    // (Next.js also renders an empty route-announcer alert, so match the message itself.)
    await expect(
      page.getByRole('alert').filter({ hasText: 'The email or password is incorrect.' }),
    ).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('protects write endpoints from anonymous and cross-site requests', async ({
    request,
    playwright,
  }) => {
    const anonymous = await request.post('/admin/api/media', {
      multipart: { file: { name: 'x.png', mimeType: 'image/png', buffer: Buffer.from('x') } },
      headers: { origin: 'http://localhost:3100' },
    });
    expect(anonymous.status()).toBe(401);

    const crossSite = await playwright.request.newContext({ baseURL: 'http://localhost:3100' });
    const forged = await crossSite.post('/admin/api/media', {
      multipart: { file: { name: 'x.png', mimeType: 'image/png', buffer: Buffer.from('x') } },
      headers: { origin: 'https://evil.example' },
    });
    expect(forged.status()).toBe(403);
    await crossSite.dispose();
  });
});

test.describe('authoring workflow', () => {
  test('create → preview → save draft → publish → edit → unpublish → delete', async ({
    page,
    request,
  }) => {
    test.slow();
    const stamp = Date.now().toString(36);
    const title = `End-to-end article ${stamp}`;
    const slug = `end-to-end-article-${stamp}`;

    await signIn(page);
    await expect(page.getByRole('heading', { name: 'Articles', level: 1 })).toBeVisible();
    await page.getByRole('link', { name: 'New article' }).click();
    await expect(page.getByTestId('post-editor').filter({ visible: true })).toBeVisible();

    const editor = page.getByTestId('post-editor').filter({ visible: true });
    await editor.getByLabel('Title', { exact: true }).fill(title);
    await expect(editor.getByLabel('URL slug')).toHaveValue(slug);
    await editor
      .getByLabel('Excerpt')
      .fill('A test article written by the Playwright suite to verify publishing.');
    await editor.getByLabel('Category').selectOption('tools');
    await editor.getByLabel('Tags').fill('Testing, Playwright');
    await editor
      .getByLabel('Article body (Markdown)')
      .fill(
        '## Why this exists\n\nThis article is created, published, edited, unpublished and deleted by the automated end-to-end suite. ' +
          'It checks that drafts stay private and that publishing makes the article visible everywhere it should be.\n\n' +
          '## A second section\n\nWith a [link to the projects](/projects) and **bold text**.\n\n### A detail\n\nMore words here.',
      );
    await expect(page.getByTestId('save-state').filter({ visible: true })).toHaveText(
      'Unsaved changes',
    );

    await editor.getByRole('tab', { name: /preview/i }).click();
    await expect(
      page
        .getByTestId('editor-preview')
        .filter({ visible: true })
        .getByRole('heading', { name: 'Why this exists' }),
    ).toBeVisible();
    await editor.getByRole('tab', { name: /write/i }).click();

    // Save as draft: stored, but invisible to the public site.
    await page.getByTestId('save-button').filter({ visible: true }).click();
    await expect(page.getByTestId('editor-status').filter({ visible: true })).toHaveText(
      'Draft created.',
    );
    await expect(page).toHaveURL(/\/admin\/posts\/[0-9a-f-]{36}$/);
    await expect(page.getByTestId('save-state').filter({ visible: true })).toHaveText(/^Saved /);
    expect((await request.get(`/writing/${slug}`)).status()).toBe(404);
    expect(await (await request.get('/sitemap.xml')).text()).not.toContain(slug);
    expect(await (await request.get('/writing/feed.xml')).text()).not.toContain(slug);

    // The draft survives a reload (it is in the database, not in browser memory).
    await page.reload();
    await expect(
      page
        .getByTestId('post-editor')
        .filter({ visible: true })
        .getByLabel('Title', { exact: true }),
    ).toHaveValue(title);

    // Publish.
    await page.getByTestId('publish-button').filter({ visible: true }).click();
    await expect(page.getByTestId('editor-status').filter({ visible: true })).toHaveText(
      'Published — the article is now live.',
    );
    const live = await request.get(`/writing/${slug}`);
    expect(live.status()).toBe(200);
    expect(await live.text()).toContain(title);
    expect(await (await request.get('/sitemap.xml')).text()).toContain(`/writing/${slug}`);
    expect(await (await request.get('/writing/feed.xml')).text()).toContain(`/writing/${slug}`);
    expect(await (await request.get('/writing')).text()).toContain(title);

    // Edit: the unsaved-changes guard asks before leaving, then the change goes live.
    await page
      .getByTestId('post-editor')
      .filter({ visible: true })
      .getByLabel('Title', { exact: true })
      .fill(`${title} (edited)`);
    await expect(page.getByTestId('save-state').filter({ visible: true })).toHaveText(
      'Unsaved changes',
    );
    page.once('dialog', (dialog) => {
      expect(dialog.message()).toContain('unsaved changes');
      void dialog.dismiss();
    });
    await page.getByRole('link', { name: '← All articles' }).click();
    await expect(page.getByTestId('post-editor').filter({ visible: true })).toBeVisible();
    await page.getByTestId('save-button').filter({ visible: true }).click();
    await expect(page.getByTestId('editor-status').filter({ visible: true })).toHaveText(
      'Changes saved and published.',
    );
    await expect
      .poll(async () => (await request.get(`/writing/${slug}`)).text())
      .toContain(`${title} (edited)`);

    // Unpublish: the public URL disappears again.
    await page.getByTestId('unpublish-button').filter({ visible: true }).click();
    await expect(page.getByTestId('editor-status').filter({ visible: true })).toHaveText(
      /^Unpublished/,
    );
    expect((await request.get(`/writing/${slug}`)).status()).toBe(404);
    expect(await (await request.get('/sitemap.xml')).text()).not.toContain(slug);

    // Opening "New article" again starts from a blank form, not the draft created above.
    await page.getByRole('link', { name: '← All articles' }).click();
    await page.getByRole('link', { name: 'New article' }).click();
    await expect(page).toHaveURL('/admin/posts/new');
    await expect(
      page
        .getByTestId('post-editor')
        .filter({ visible: true })
        .getByLabel('Title', { exact: true }),
    ).toHaveValue('');
    await page.goBack();
    await expect(page).toHaveURL('/admin');
    await page.locator(`[data-post-row="${slug}"]`).getByRole('link', { name: /^Edit/ }).click();
    await expect(
      page
        .getByTestId('post-editor')
        .filter({ visible: true })
        .getByLabel('Title', { exact: true }),
    ).toHaveValue(`${title} (edited)`);

    // Delete (with confirmation).
    await page.getByRole('button', { name: 'Delete' }).click();
    const confirm = page.getByRole('dialog', { name: 'Delete this article?' });
    await expect(confirm).toBeVisible();
    await confirm.getByRole('button', { name: 'Delete permanently' }).click();
    await expect(page).toHaveURL('/admin');
    await expect(page.locator(`[data-post-row="${slug}"]`)).toHaveCount(0);
  });

  test('publishing is refused until required fields are complete', async ({ page }) => {
    await signIn(page, '/admin/posts/new');
    const editor = page.getByTestId('post-editor').filter({ visible: true });
    await editor.getByLabel('Title', { exact: true }).fill('Too short to publish');
    await page.getByTestId('publish-button').filter({ visible: true }).click();
    await expect(page.getByTestId('editor-status').filter({ visible: true })).toHaveText(
      'Not published yet — a few things are needed first.',
    );
    await expect(editor.getByRole('alert')).toContainText('Excerpt');
    await expect(editor.getByLabel('Excerpt')).toHaveAttribute('aria-invalid', 'true');
  });

  test('uploads images to the media library and serves them as optimised WebP', async ({
    page,
    request,
  }) => {
    await signIn(page, '/admin/media');
    // A unique colour per run, so the upload is never de-duplicated against an earlier one.
    const png = await sharp({
      create: {
        width: 320,
        height: 200,
        channels: 3,
        background: { r: Date.now() % 256, g: 160, b: 190 },
      },
    })
      .png()
      .toBuffer();
    const form = page.locator('form').filter({ has: page.getByLabel('Image file') });
    await form
      .getByLabel('Image file')
      .setInputFiles({ name: `e2e-upload-${Date.now()}.png`, mimeType: 'image/png', buffer: png });
    await form.getByLabel('Alt text').fill('A flat teal rectangle used by the test suite');
    await form.getByRole('button', { name: 'Upload' }).click();
    await expect(page.getByRole('status').filter({ hasText: 'Uploaded' })).toContainText(
      /Uploaded e2e-upload-\d+\.webp/,
    );

    // Newest first; the thumbnail is decorative (alt="") because the alt text is edited beside it.
    const card = page.locator('li[data-media]').first();
    await expect(card.getByLabel('Alt text')).toHaveValue(
      'A flat teal rectangle used by the test suite',
    );
    const src = await card.locator('img').getAttribute('src');
    expect(src).toMatch(/^\/media\/[a-f0-9]{32}$/);
    const served = await request.get(src!);
    expect(served.status()).toBe(200);
    expect(served.headers()['content-type']).toBe('image/webp');
  });

  test('signing out ends the session', async ({ page }) => {
    await signIn(page);
    await page.getByRole('button', { name: 'Sign out' }).click();
    await expect(page).toHaveURL(/\/admin\/login/);
    await page.goto('/admin');
    await expect(page).toHaveURL('/admin/login?next=%2Fadmin');
  });
});
