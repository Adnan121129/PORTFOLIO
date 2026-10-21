import { describe, expect, it } from 'vitest';
import { renderMarkdown } from '@/lib/markdown/render';

const MEDIA_ID = 'a'.repeat(32);

describe('renderMarkdown sanitisation', () => {
  it('drops raw HTML, scripts and event handlers', async () => {
    const { html } = await renderMarkdown(
      'Hello <script>alert(1)</script> <img src="x" onerror="alert(1)"> <iframe src="https://evil.test"></iframe>\n\n<div onclick="steal()">raw block</div>',
    );
    expect(html).not.toMatch(/<script|onerror|onclick|<iframe|<div onclick/i);
    expect(html).toContain('Hello');
  });

  it('removes javascript: and data: URLs, keeping the text', async () => {
    const { html } = await renderMarkdown(
      '[click me](javascript:alert(1)) and ![pixel](data:image/png;base64,AAAA)',
    );
    expect(html).not.toMatch(/javascript:|data:image/i);
    expect(html).toContain('click me');
    expect(html).toContain('pixel');
    expect(html).not.toContain('href=""');
  });

  it('opens external links in a new tab safely and leaves internal links alone', async () => {
    const { html } = await renderMarkdown(
      '[GitHub](https://github.com/Adnan121129) and [case study](/projects/linguasi)',
    );
    expect(html).toContain(
      '<a href="https://github.com/Adnan121129" target="_blank" rel="noopener noreferrer">',
    );
    expect(html).toContain('(opens in a new tab)');
    expect(html).toContain('<a href="/projects/linguasi">case study</a>');
  });
});

describe('renderMarkdown structure', () => {
  it('builds heading anchors and a table of contents; the page title stays the only h1', async () => {
    const { html, toc } = await renderMarkdown(
      '# Intro\n\n## Intro\n\n### Details & notes\n\n#### Deep',
    );
    expect(html).not.toContain('<h1');
    expect(toc).toEqual([
      { id: 'intro', text: 'Intro', depth: 2 },
      { id: 'intro-1', text: 'Intro', depth: 2 },
      { id: 'details--notes', text: 'Details & notes', depth: 3 },
    ]);
    expect(html).toContain(
      '<a class="heading-anchor" href="#intro-1" aria-label="Link to section: Intro">#</a>',
    );
  });

  it('turns GitHub-style alerts into labelled callouts', async () => {
    const { html } = await renderMarkdown('> [!WARNING]\n> Back up the database first.');
    expect(html).toContain(
      '<aside class="callout" data-kind="warning" role="note" aria-label="Warning">',
    );
    expect(html).toContain('Back up the database first.');
    expect(html).not.toContain('[!WARNING]');
  });

  it('wraps tables in a focusable, labelled scroll region', async () => {
    const { html } = await renderMarkdown('| KPI | Value |\n| --- | ---: |\n| Uptime | 99% |');
    expect(html).toContain(
      '<div class="table-wrap" tabindex="0" role="region" aria-label="Scrollable table"><table>',
    );
    expect(html).toContain('align="right"');
  });

  it('highlights supported languages and labels the block', async () => {
    const { html } = await renderMarkdown(
      '```ts\nconst total: number = 1;\n```\n\n```unknownlang\nplain\n```',
    );
    expect(html).toContain('data-language="typescript"');
    expect(html).toContain('class="shiki');
    expect(html).toContain('--shiki-dark');
    expect(html).toMatch(/<pre tabindex="0"><code class="language-unknownlang">plain/);
  });

  it('sizes library images, adds captions and links external images instead of loading them', async () => {
    const { html } = await renderMarkdown(
      `![Energy chart](/media/${MEDIA_ID} "Monthly energy per unit")\n\n![Remote](https://example.com/a.png)`,
      {
        resolveImages: async () =>
          new Map([[MEDIA_ID, { width: 1200, height: 800, alt: 'stored alt' }]]),
      },
    );
    expect(html).toContain(
      `<figure><img src="/media/${MEDIA_ID}" alt="Energy chart" title="Monthly energy per unit" loading="lazy" decoding="async" width="1200" height="800"><figcaption>Monthly energy per unit</figcaption></figure>`,
    );
    expect(html).not.toContain('<img src="https://example.com');
    expect(html).toContain('External image: Remote');
  });

  it('counts words for reading time', async () => {
    const { words } = await renderMarkdown('One two three.\n\n```\nnot counted\n```');
    expect(words).toBe(3);
  });
});
