import { expect, test } from './support';

const projects = [
  {
    slug: 'plantops-intelligence',
    title: 'PlantOps Intelligence',
    repo: 'https://github.com/Adnan121129/PlantOps-Intelligence',
  },
  {
    slug: 'infravision-ai',
    title: 'InfraVision AI',
    repo: 'https://github.com/Adnan121129/InfraVision-AI',
  },
  { slug: 'linguasi', title: 'LinguaSI', repo: 'https://github.com/Adnan121129/LinguaSI' },
  { slug: 'omnimanager', title: 'OmniManager', repo: null },
  {
    slug: 'greenfactory-bi',
    title: 'GreenFactory BI',
    repo: 'https://github.com/Adnan121129/GreenFactory-BI',
  },
  {
    slug: 'muhibbi-tea-house',
    title: 'Muhibbi Tea House',
    repo: 'https://github.com/Adnan121129/MUHIBBI-TEA-HOUSE',
  },
  {
    slug: 'the-ottoman-empire',
    title: 'The Ottoman Empire · 1299–1922',
    repo: 'https://github.com/Adnan121129/The-Ottoman-Empire',
  },
  { slug: 'chatmate', title: 'ChatMate', repo: 'https://github.com/Adnan121129/ChatMate' },
];

test.describe('projects', () => {
  test('every project card has a working “Read Case Study” link', async ({ page }) => {
    await page.goto('/projects');
    const links = page.getByTestId('project-results').getByTestId('read-case-study');
    await expect(links).toHaveCount(8);
    for (const project of projects) {
      const link = page
        .getByTestId('project-results')
        .locator(`[data-project="${project.slug}"]`)
        .getByTestId('read-case-study');
      await expect(link).toHaveAttribute('href', `/projects/${project.slug}`);
      await expect(link).toHaveAccessibleName(`Read Case Study: ${project.title}`);
    }
  });

  test('card → case study → back → next case study', async ({ page }) => {
    await page.goto('/projects');
    await page.locator('[data-project="greenfactory-bi"]').getByTestId('read-case-study').click();
    await expect(page).toHaveURL('/projects/greenfactory-bi');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('GreenFactory BI');
    await page.goBack();
    await expect(page).toHaveURL('/projects');
    await expect(page.getByTestId('read-case-study').filter({ visible: true })).toHaveCount(8);
    await page.goForward();
    await expect(page).toHaveURL('/projects/greenfactory-bi');
    await page.getByTestId('next-case-study').click();
    await expect(page).toHaveURL('/projects/muhibbi-tea-house');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Muhibbi Tea House');
  });

  test('in-page links target the visible case study after back/forward navigation', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'The sticky table of contents is a desktop layout.');
    await page.goto('/projects/plantops-intelligence');
    await page.getByTestId('next-case-study').click();
    await expect(page).toHaveURL('/projects/infravision-ai');
    await page.goBack();
    await expect(page).toHaveURL('/projects/plantops-intelligence');
    // Both pages define #features; the router keeps the other one hidden in the document.
    await page.getByRole('navigation', { name: 'On this page' }).getByRole('link').nth(2).click();
    await expect(page).toHaveURL(/#features$/);
    const visible = page.locator('#features').filter({ visible: true });
    await expect(visible).toBeInViewport();
    await expect(visible.getByRole('heading', { level: 2 })).toBeVisible();
  });

  test('each case study renders with its repository link exactly as supplied', async ({ page }) => {
    for (const project of projects) {
      const response = await page.goto(`/projects/${project.slug}`);
      expect(response?.status(), project.slug).toBe(200);
      await expect(page.getByRole('heading', { level: 1 })).toContainText(project.title);
      await expect(page.getByRole('link', { name: 'Back to Projects' }).first()).toHaveAttribute(
        'href',
        '/projects',
      );
      if (project.repo) {
        const repo = page.getByTestId('repo-link');
        await expect(repo).toHaveAttribute('href', project.repo);
        await expect(repo).toHaveAttribute('rel', 'noopener noreferrer');
      } else {
        await expect(page.getByTestId('repo-link')).toHaveCount(0);
      }
    }
  });

  test('filters by category and search, keeps the URL shareable and recovers from no results', async ({
    page,
  }) => {
    await page.goto('/projects');
    await page.getByRole('button', { name: 'Mobile', exact: true }).click();
    await expect(page.getByTestId('project-count')).toHaveText('Showing 1 of 8 projects in Mobile');
    await expect(page).toHaveURL(/\?category=mobile$/);

    await page.getByRole('button', { name: 'All', exact: true }).click();
    await page.getByRole('searchbox', { name: 'Search projects' }).fill('power bi');
    await expect(page.getByTestId('project-results').locator('[data-project]')).toHaveCount(2);
    await expect(page).toHaveURL(/\?q=power\+bi$/);

    await page.getByRole('searchbox', { name: 'Search projects' }).fill('no-such-stack');
    await expect(page.getByTestId('project-empty')).toContainText('No projects match.');
    await page.getByRole('button', { name: 'Clear filters' }).click();
    await expect(page.getByTestId('project-count')).toHaveText('Showing all 8 projects');
    await expect(page).toHaveURL('/projects');
  });

  test('a shared filter link opens the filtered view', async ({ page }) => {
    await page.goto('/projects?category=interactive-3d');
    await expect(page.getByTestId('project-results').locator('[data-project]')).toHaveCount(2);
    await expect(page.getByRole('button', { name: 'Interactive & 3D' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});

test.describe('missing case studies', () => {
  test.use({ allowConsole: [/status of 404/] });

  test('unknown case studies return a real 404', async ({ page }) => {
    const response = await page.goto('/projects/not-a-project');
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('This page isn’t in the');
  });
});

test.describe('research', () => {
  const items = [
    'nirapotta',
    'automatic-garbage-detection',
    'energy-efficient-federated-learning',
    'detecting-ai-generated-media',
    'gender-bias-social-media-comments',
  ];

  test('lists five items, each with its own page and a plainly stated status', async ({ page }) => {
    await page.goto('/research');
    for (const slug of items)
      await expect(page.locator(`main a[href="/research/${slug}"]`).first()).toBeVisible();
    for (const slug of items) {
      const response = await page.goto(`/research/${slug}`);
      expect(response?.status(), slug).toBe(200);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.locator('main')).not.toContainText(/peer[- ]reviewed|published in/i);
    }
  });
});
