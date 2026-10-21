import { afterEach, describe, expect, it, vi } from 'vitest';
import { absoluteUrl, siteUrl } from '@/lib/env';
import { blogPostingJsonLd, pageMetadata, personJsonLd, serializeJsonLd } from '@/lib/seo';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('site URL', () => {
  it('prefers NEXT_PUBLIC_SITE_URL and strips trailing slashes', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://example.dev///');
    expect(siteUrl()).toBe('https://example.dev');
    expect(absoluteUrl('/writing/a-post')).toBe('https://example.dev/writing/a-post');
  });

  it('falls back to the Vercel production URL, then localhost', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', 'adnan.vercel.app');
    expect(siteUrl()).toBe('https://adnan.vercel.app');
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', '');
    expect(siteUrl()).toBe('http://localhost:3000');
  });
});

describe('metadata', () => {
  it('sets canonical, Open Graph and Twitter fields consistently', () => {
    const meta = pageMetadata({
      title: 'Projects',
      description: 'Eight case studies.',
      path: '/projects',
    });
    expect(meta.title).toBe('Projects');
    expect(meta.alternates?.canonical).toBe('/projects');
    expect(meta.openGraph).toMatchObject({
      title: 'Projects · Muhammad Adnan',
      url: '/projects',
      type: 'website',
    });
    expect(meta.twitter).toMatchObject({
      card: 'summary_large_image',
      title: 'Projects · Muhammad Adnan',
    });
    expect(meta.robots).toBeUndefined();
    expect(
      pageMetadata({ title: 'Draft', description: '', path: '/x', noindex: true }).robots,
    ).toEqual({ index: false, follow: false });
  });
});

describe('structured data', () => {
  it('describes the person with the supplied profile links', () => {
    const person = personJsonLd();
    expect(person['@type']).toBe('Person');
    expect(person.sameAs).toEqual([
      'https://www.linkedin.com/in/muhammad-adnan-55778b242/',
      'https://github.com/Adnan121129',
    ]);
    expect(person.email).toBe('mailto:mdadnan899@gmail.com');
  });

  it('builds BlogPosting data with absolute URLs', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://example.dev');
    const posting = blogPostingJsonLd({
      title: 'A post',
      description: 'About KPIs',
      path: '/writing/a-post',
      publishedAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-02T00:00:00.000Z',
      image: '/media/abc',
      tags: ['KPI', 'BI'],
      category: 'Data & BI',
    });
    expect(posting).toMatchObject({
      '@type': 'BlogPosting',
      headline: 'A post',
      url: 'https://example.dev/writing/a-post',
      image: 'https://example.dev/media/abc',
      keywords: 'KPI, BI',
    });
  });

  it('cannot break out of its script tag', () => {
    const json = serializeJsonLd({
      name: '</script><script>alert(1)</script>',
      note: 'line\u2028break',
    });
    expect(json).not.toContain('</script>');
    expect(json).not.toContain('\u2028');
    expect(JSON.parse(json)).toEqual({
      name: '</script><script>alert(1)</script>',
      note: 'line\u2028break',
    });
  });
});
