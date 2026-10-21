import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { renderMarkdown } from '@/lib/markdown/render';
import { getMediaDimensions } from '@/lib/media';
import * as repo from './posts';

/**
 * Cached, public-facing reads. Everything is tagged "posts" and kept until an admin
 * action calls updateTag('posts') (see src/app/admin/actions.ts), so published pages
 * are served statically and refresh immediately after a change.
 */
export const POSTS_TAG = 'posts';

export async function getLatestPosts(limit = 3) {
  'use cache';
  cacheLife('max');
  cacheTag(POSTS_TAG);
  const { posts } = await repo.listPublishedPosts({ page: 1, pageSize: limit });
  return posts;
}

export async function searchPublishedPosts(
  query: string,
  category: string,
  page: number,
  pageSize: number,
) {
  'use cache';
  cacheLife('max');
  cacheTag(POSTS_TAG);
  return repo.listPublishedPosts({
    query: query || undefined,
    category: category || undefined,
    page,
    pageSize,
  });
}

export async function getWritingOverview() {
  'use cache';
  cacheLife('max');
  cacheTag(POSTS_TAG);
  const [featured, counts] = await Promise.all([repo.getFeaturedPost(), repo.getCategoryCounts()]);
  return { featured, counts };
}

export async function getPublishedArticle(slug: string) {
  'use cache';
  cacheLife('max');
  cacheTag(POSTS_TAG);
  const post = await repo.getPublishedPostBySlug(slug);
  if (!post) return null;
  const [rendered, related] = await Promise.all([
    renderMarkdown(post.body, { resolveImages: getMediaDimensions }),
    repo.getRelatedPosts(post, 3),
  ]);
  return { post, rendered, related };
}

export async function getArticleRedirect(slug: string) {
  'use cache';
  cacheLife('max');
  cacheTag(POSTS_TAG);
  return repo.getSlugRedirect(slug);
}

export async function getPublishedSlugs() {
  'use cache';
  cacheLife('max');
  cacheTag(POSTS_TAG);
  return repo.listPublishedSlugs();
}

/** Published posts for the RSS feed (full summaries, newest first). */
export async function getFeedPosts(limit = 30) {
  'use cache';
  cacheLife('max');
  cacheTag(POSTS_TAG);
  const { posts } = await repo.listPublishedPosts({ page: 1, pageSize: limit });
  return posts;
}
