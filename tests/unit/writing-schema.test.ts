import { describe, expect, it } from 'vitest';
import { countWords, formatDate, readingMinutes, slugify } from '@/lib/utils';
import { parsePostInput, parseTagList, publishIssues } from '@/lib/writing/schema';
import type { PostInput } from '@/lib/writing/types';

const valid: PostInput = {
  title: 'Designing KPI dictionaries',
  slug: 'designing-kpi-dictionaries',
  excerpt: 'Why every dashboard should read from one definition of each KPI.',
  body: 'A KPI dictionary keeps definitions in one place. '.repeat(8),
  category: 'data-bi',
  tags: ['KPI', 'Power BI'],
  seoTitle: '',
  seoDescription: '',
  coverImageId: null,
  coverAlt: '',
  featured: false,
};

describe('slugify', () => {
  it('creates lowercase ASCII slugs', () => {
    expect(slugify('  Hello, World! ')).toBe('hello-world');
    expect(slugify('Data & BI: Café Señor')).toBe('data-and-bi-cafe-senor');
    expect(slugify('---')).toBe('');
    expect(slugify('a'.repeat(100)).length).toBeLessThanOrEqual(80);
  });
});

describe('word counts and reading time', () => {
  it('ignores code fences, images and link URLs', () => {
    expect(
      countWords(
        'One two [three](https://example.com/a-b-c) ![alt text](/media/x)\n```js\nconst x = 1;\n```',
      ),
    ).toBe(3);
    expect(readingMinutes('')).toBe(1);
    expect(readingMinutes('word '.repeat(660))).toBe(3);
  });

  it('formats dates in UTC', () => {
    expect(formatDate('2026-03-12T23:30:00.000Z')).toBe('12 March 2026');
    expect(formatDate('2026-03-12T23:30:00.000Z', 'short')).toBe('12 Mar 2026');
    expect(formatDate('not a date')).toBe('');
  });
});

describe('post validation', () => {
  it('accepts a well-formed post and de-duplicates tags case-insensitively', () => {
    const result = parsePostInput({ ...valid, tags: ['KPI', 'kpi', 'Power BI'] });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.tags).toEqual(['KPI', 'Power BI']);
  });

  it('reports field-level problems', () => {
    const result = parsePostInput({
      ...valid,
      title: 'x',
      slug: 'Not A Slug',
      category: 'unknown',
      coverImageId: '../etc/passwd',
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues.map((issue) => issue.field).sort()).toEqual([
        'category',
        'coverImageId',
        'slug',
        'title',
      ]);
    }
  });

  it('rejects unexpected types instead of coercing them', () => {
    expect(parsePostInput({ ...valid, featured: 'yes' }).ok).toBe(false);
    expect(parsePostInput({ ...valid, tags: 'a,b' }).ok).toBe(false);
    expect(parsePostInput(null).ok).toBe(false);
  });

  it('requires an excerpt, enough body text and cover alt text before publishing', () => {
    expect(publishIssues(valid)).toEqual([]);
    const issues = publishIssues({
      ...valid,
      excerpt: 'Short',
      body: 'Too short.',
      coverImageId: 'a'.repeat(32),
      coverAlt: '',
    });
    expect(issues.map((issue) => issue.field)).toEqual(['excerpt', 'body', 'coverAlt']);
  });

  it('parses comma-separated tags from the editor', () => {
    expect(parseTagList(' SQL, Power BI ,, KPIs ')).toEqual(['SQL', 'Power BI', 'KPIs']);
  });
});
