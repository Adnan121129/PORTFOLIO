import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { closeDb, getDb } from '@/lib/db/client';
import {
  clearSampleFlag,
  createPost,
  deletePost,
  deleteSamplePosts,
  getCategoryCounts,
  getFeaturedPost,
  getPublishedPostBySlug,
  getRelatedPosts,
  getSlugRedirect,
  isSlugTaken,
  listAllPosts,
  listPublishedPosts,
  listPublishedSlugs,
  setPostStatus,
  toFtsQuery,
  updatePost,
} from '@/lib/writing/posts';
import type { PostInput } from '@/lib/writing/types';
import { useTemporaryDatabase } from './helpers';

let cleanup: () => void;
beforeAll(() => {
  cleanup = useTemporaryDatabase();
});
afterAll(() => {
  closeDb();
  cleanup();
});

function input(overrides: Partial<PostInput> = {}): PostInput {
  return {
    title: 'Reconciling energy data',
    slug: 'reconciling-energy-data',
    excerpt: 'Matched-month ratios and why missing is never zero.',
    body: 'Energy per unit compares only months where both energy and production were recorded. '.repeat(
      5,
    ),
    category: 'data-bi',
    tags: ['KPI', 'Data quality'],
    seoTitle: '',
    seoDescription: '',
    coverImageId: null,
    coverAlt: '',
    featured: false,
    ...overrides,
  };
}

describe('posts repository', () => {
  it('applies migrations idempotently', async () => {
    const db = await getDb();
    const versions = await db.execute('SELECT version FROM schema_migrations');
    expect(versions.rows.map((row) => Number(row.version))).toEqual([1]);
  });

  it('keeps drafts out of every public query', async () => {
    const draft = await createPost(
      input({ slug: 'secret-draft', title: 'Secret draft about turbines' }),
    );
    expect(draft.status).toBe('draft');
    expect(draft.publishedAt).toBeNull();
    expect(await getPublishedPostBySlug('secret-draft')).toBeNull();
    expect((await listPublishedPosts()).total).toBe(0);
    expect((await listPublishedPosts({ query: 'turbines' })).total).toBe(0);
    expect(await listPublishedSlugs()).toEqual([]);
    expect(await getCategoryCounts()).toEqual({});
    expect(await getFeaturedPost()).toBeNull();
    expect((await listAllPosts()).map((post) => post.slug)).toContain('secret-draft');
  });

  it('publishes, searches the full text and unpublishes', async () => {
    const post = await createPost(input());
    const published = await setPostStatus(post.id, 'published');
    expect(published?.status).toBe('published');
    expect(published?.publishedAt).not.toBeNull();
    expect((await getPublishedPostBySlug('reconciling-energy-data'))?.title).toBe(
      'Reconciling energy data',
    );

    // Body text, prefix matching and diacritics-insensitive search.
    expect((await listPublishedPosts({ query: 'produc' })).posts.map((p) => p.slug)).toEqual([
      'reconciling-energy-data',
    ]);
    expect((await listPublishedPosts({ query: 'énergy' })).total).toBe(1);
    expect((await listPublishedPosts({ query: 'turbines' })).total).toBe(0);
    expect((await listPublishedPosts({ category: 'ai-ml' })).total).toBe(0);
    expect(await getCategoryCounts()).toEqual({ 'data-bi': 1 });

    const firstPublishedAt = published!.publishedAt;
    await setPostStatus(post.id, 'draft');
    expect(await getPublishedPostBySlug('reconciling-energy-data')).toBeNull();
    const republished = await setPostStatus(post.id, 'published');
    expect(republished?.publishedAt).toBe(firstPublishedAt);
  });

  it('treats search syntax as plain words', async () => {
    expect(toFtsQuery('energy OR "NEAR(" *')).toBe('"energy"* "or"* "near"*');
    expect(toFtsQuery('  ***  ')).toBeNull();
    expect((await listPublishedPosts({ query: '"); DROP TABLE posts; --' })).total).toBe(0);
    expect((await listPublishedPosts()).total).toBe(1);
  });

  it('redirects old slugs after a rename and reserves them', async () => {
    const post = (await getPublishedPostBySlug('reconciling-energy-data'))!;
    const result = await updatePost(
      post.id,
      input({ slug: 'energy-per-unit', title: 'Energy per unit' }),
    );
    expect(result?.previousSlug).toBe('reconciling-energy-data');
    expect(await getSlugRedirect('reconciling-energy-data')).toBe('energy-per-unit');
    expect(await isSlugTaken('reconciling-energy-data')).toBe(true);
    expect(await isSlugTaken('reconciling-energy-data', post.id)).toBe(false);
    expect((await listPublishedPosts({ query: 'unit' })).posts[0]?.title).toBe('Energy per unit');

    // Renaming back must not leave a self-redirect.
    await updatePost(post.id, input({ slug: 'reconciling-energy-data' }));
    expect(await getSlugRedirect('reconciling-energy-data')).toBeNull();
    expect(await getSlugRedirect('energy-per-unit')).toBe('reconciling-energy-data');
  });

  it('rejects duplicate slugs at the database level', async () => {
    await expect(createPost(input())).rejects.toThrow();
  });

  it('ranks related posts by category and shared tags', async () => {
    const base = (await getPublishedPostBySlug('reconciling-energy-data'))!;
    const sameCategory = await createPost(
      input({ slug: 'kpi-dictionaries', title: 'KPI dictionaries', tags: ['KPI'] }),
      { status: 'published' },
    );
    await createPost(
      input({ slug: 'unrelated', title: 'Unrelated', category: 'tools', tags: ['Git'] }),
      { status: 'published' },
    );
    const related = await getRelatedPosts(base);
    expect(related.map((post) => post.slug)).toEqual([sameCategory.slug]);
  });

  it('prefers the featured post, then the newest', async () => {
    const featured = await createPost(
      input({ slug: 'featured-post', title: 'Featured', featured: true }),
      {
        status: 'published',
        publishedAt: '2020-01-01T00:00:00.000Z',
      },
    );
    expect((await getFeaturedPost())?.id).toBe(featured.id);
  });

  it('deletes posts together with their slug history', async () => {
    const post = (await getPublishedPostBySlug('reconciling-energy-data'))!;
    await deletePost(post.id);
    expect(await getPublishedPostBySlug('reconciling-energy-data')).toBeNull();
    expect(await isSlugTaken('energy-per-unit')).toBe(false);
    expect((await listPublishedPosts({ query: 'reconciling' })).total).toBe(0);
  });

  it('removes only posts still flagged as samples', async () => {
    const sample = await createPost(input({ slug: 'sample-one' }), {
      isSample: true,
      status: 'published',
    });
    const kept = await createPost(input({ slug: 'sample-two' }), { isSample: true });
    await clearSampleFlag(kept.id);
    expect(sample.isSample).toBe(true);
    expect(await deleteSamplePosts()).toEqual(['sample-one']);
    expect((await listAllPosts()).map((post) => post.slug)).toContain('sample-two');
  });
});
