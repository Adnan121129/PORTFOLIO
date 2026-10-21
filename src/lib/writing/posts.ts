import 'server-only';
import type { Row } from '@libsql/client';
import { randomUUID } from 'node:crypto';
import { getDb } from '@/lib/db/client';
import { readingMinutes } from '@/lib/utils';
import type { Post, PostInput, PostStatus, PostSummary } from './types';

/*
 * Data access for articles. Public functions only ever return published posts;
 * admin functions are called exclusively from authenticated server actions.
 */

const SUMMARY_COLUMNS = `
  p.id, p.slug, p.title, p.excerpt, p.category, p.tags, p.seo_title, p.seo_description,
  p.cover_image_id, p.cover_alt, p.status, p.featured, p.is_sample, p.reading_minutes,
  p.published_at, p.created_at, p.updated_at,
  m.width AS cover_width, m.height AS cover_height, m.alt AS media_alt`;

const FROM_POSTS = `FROM posts p LEFT JOIN media m ON m.id = p.cover_image_id`;

function text(value: unknown): string {
  return value == null ? '' : String(value);
}

function parseTags(value: unknown): string[] {
  try {
    const parsed = JSON.parse(text(value) || '[]');
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export function mediaUrl(id: string): string {
  return `/media/${id}`;
}

function mapSummary(row: Row): PostSummary {
  const coverId = row.cover_image_id ? text(row.cover_image_id) : null;
  return {
    id: text(row.id),
    slug: text(row.slug),
    title: text(row.title),
    excerpt: text(row.excerpt),
    category: text(row.category),
    tags: parseTags(row.tags),
    seoTitle: text(row.seo_title),
    seoDescription: text(row.seo_description),
    cover:
      coverId && row.cover_width
        ? {
            id: coverId,
            url: mediaUrl(coverId),
            width: Number(row.cover_width),
            height: Number(row.cover_height),
            alt: text(row.cover_alt) || text(row.media_alt),
          }
        : null,
    status: text(row.status) as PostStatus,
    featured: Number(row.featured) === 1,
    isSample: Number(row.is_sample) === 1,
    readingMinutes: Number(row.reading_minutes) || 1,
    publishedAt: row.published_at ? text(row.published_at) : null,
    createdAt: text(row.created_at),
    updatedAt: text(row.updated_at),
  };
}

function mapPost(row: Row): Post {
  return {
    ...mapSummary(row),
    body: text(row.body),
    coverImageId: row.cover_image_id ? text(row.cover_image_id) : null,
    coverAlt: text(row.cover_alt),
  };
}

/** Build a safe FTS5 query: each word becomes a quoted prefix term, all terms required. */
export function toFtsQuery(input: string): string | null {
  const terms = input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .match(/[\p{L}\p{N}]+/gu);
  if (!terms?.length) return null;
  return terms
    .slice(0, 8)
    .map((term) => `"${term}"*`)
    .join(' ');
}

export type PublishedQuery = {
  query?: string;
  category?: string;
  page?: number;
  pageSize?: number;
};

export async function listPublishedPosts({
  query,
  category,
  page = 1,
  pageSize = 9,
}: PublishedQuery = {}): Promise<{ posts: PostSummary[]; total: number }> {
  const db = await getDb();
  const offset = Math.max(0, (page - 1) * pageSize);
  const fts = query ? toFtsQuery(query) : null;
  const where: string[] = [`p.status = 'published'`];
  const args: (string | number)[] = [];
  if (category) {
    where.push('p.category = ?');
    args.push(category);
  }

  if (query && !fts) return { posts: [], total: 0 };

  if (fts) {
    const ftsWhere = `posts_fts MATCH ? AND ${where.join(' AND ')}`;
    const [rows, count] = await Promise.all([
      db.execute({
        sql: `SELECT ${SUMMARY_COLUMNS} FROM posts_fts f JOIN posts p ON p.seq = f.rowid
              LEFT JOIN media m ON m.id = p.cover_image_id
              WHERE ${ftsWhere}
              ORDER BY bm25(posts_fts, 10.0, 4.0, 1.0, 3.0), p.published_at DESC
              LIMIT ? OFFSET ?`,
        args: [fts, ...args, pageSize, offset],
      }),
      db.execute({
        sql: `SELECT COUNT(*) AS n FROM posts_fts f JOIN posts p ON p.seq = f.rowid WHERE ${ftsWhere}`,
        args: [fts, ...args],
      }),
    ]);
    return { posts: rows.rows.map(mapSummary), total: Number(count.rows[0]?.n ?? 0) };
  }

  const [rows, count] = await Promise.all([
    db.execute({
      sql: `SELECT ${SUMMARY_COLUMNS} ${FROM_POSTS} WHERE ${where.join(' AND ')}
            ORDER BY p.published_at DESC, p.seq DESC LIMIT ? OFFSET ?`,
      args: [...args, pageSize, offset],
    }),
    db.execute({ sql: `SELECT COUNT(*) AS n FROM posts p WHERE ${where.join(' AND ')}`, args }),
  ]);
  return { posts: rows.rows.map(mapSummary), total: Number(count.rows[0]?.n ?? 0) };
}

export async function getPublishedPostBySlug(slug: string): Promise<Post | null> {
  const db = await getDb();
  const result = await db.execute({
    sql: `SELECT ${SUMMARY_COLUMNS}, p.body ${FROM_POSTS} WHERE p.slug = ? AND p.status = 'published'`,
    args: [slug],
  });
  return result.rows[0] ? mapPost(result.rows[0]) : null;
}

/** If a published post used to live at `slug`, return its current slug. */
export async function getSlugRedirect(slug: string): Promise<string | null> {
  const db = await getDb();
  const result = await db.execute({
    sql: `SELECT p.slug FROM post_slug_history h JOIN posts p ON p.id = h.post_id
          WHERE h.old_slug = ? AND p.status = 'published'`,
    args: [slug],
  });
  return result.rows[0] ? text(result.rows[0].slug) : null;
}

export async function listPublishedSlugs(): Promise<{ slug: string; updatedAt: string }[]> {
  const db = await getDb();
  const result = await db.execute(
    `SELECT slug, updated_at FROM posts WHERE status = 'published' ORDER BY published_at DESC`,
  );
  return result.rows.map((row) => ({ slug: text(row.slug), updatedAt: text(row.updated_at) }));
}

export async function getCategoryCounts(): Promise<Record<string, number>> {
  const db = await getDb();
  const result = await db.execute(
    `SELECT category, COUNT(*) AS n FROM posts WHERE status = 'published' GROUP BY category`,
  );
  return Object.fromEntries(result.rows.map((row) => [text(row.category), Number(row.n)]));
}

export async function getFeaturedPost(): Promise<PostSummary | null> {
  const db = await getDb();
  const result = await db.execute(
    `SELECT ${SUMMARY_COLUMNS} ${FROM_POSTS} WHERE p.status = 'published'
     ORDER BY p.featured DESC, p.published_at DESC LIMIT 1`,
  );
  return result.rows[0] ? mapSummary(result.rows[0]) : null;
}

/** Related posts: same category and shared tags score higher; newest first on ties. */
export async function getRelatedPosts(post: PostSummary, limit = 3): Promise<PostSummary[]> {
  const db = await getDb();
  const result = await db.execute({
    sql: `SELECT ${SUMMARY_COLUMNS} ${FROM_POSTS} WHERE p.status = 'published' AND p.id != ?
          ORDER BY p.published_at DESC LIMIT 200`,
    args: [post.id],
  });
  const tags = new Set(post.tags.map((tag) => tag.toLowerCase()));
  return result.rows
    .map(mapSummary)
    .map((candidate, order) => ({
      candidate,
      order,
      score:
        (candidate.category === post.category ? 2 : 0) +
        candidate.tags.filter((tag) => tags.has(tag.toLowerCase())).length,
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .slice(0, limit)
    .map((entry) => entry.candidate);
}

/* ------------------------------------------------------------------ admin */

export async function listAllPosts(): Promise<PostSummary[]> {
  const db = await getDb();
  const result = await db.execute(
    `SELECT ${SUMMARY_COLUMNS} ${FROM_POSTS} ORDER BY p.updated_at DESC, p.seq DESC`,
  );
  return result.rows.map(mapSummary);
}

export async function getPostById(id: string): Promise<Post | null> {
  const db = await getDb();
  const result = await db.execute({
    sql: `SELECT ${SUMMARY_COLUMNS}, p.body ${FROM_POSTS} WHERE p.id = ?`,
    args: [id],
  });
  return result.rows[0] ? mapPost(result.rows[0]) : null;
}

export async function isSlugTaken(slug: string, exceptId?: string): Promise<boolean> {
  const db = await getDb();
  const result = await db.execute({
    sql: `SELECT id FROM posts WHERE slug = ? AND id != ?
          UNION SELECT post_id AS id FROM post_slug_history WHERE old_slug = ? AND post_id != ?`,
    args: [slug, exceptId ?? '', slug, exceptId ?? ''],
  });
  return result.rows.length > 0;
}

export async function mediaExists(id: string): Promise<boolean> {
  const db = await getDb();
  const result = await db.execute({ sql: 'SELECT 1 FROM media WHERE id = ?', args: [id] });
  return result.rows.length > 0;
}

export async function createPost(
  input: PostInput,
  options: { isSample?: boolean; status?: PostStatus; publishedAt?: string } = {},
): Promise<Post> {
  const db = await getDb();
  const now = new Date().toISOString();
  const id = randomUUID();
  const status = options.status ?? 'draft';
  const publishedAt = status === 'published' ? (options.publishedAt ?? now) : null;
  await db.execute({
    sql: `INSERT INTO posts (id, slug, title, excerpt, body, category, tags, seo_title, seo_description,
            cover_image_id, cover_alt, status, featured, is_sample, reading_minutes, published_at, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      input.slug,
      input.title,
      input.excerpt,
      input.body,
      input.category,
      JSON.stringify(input.tags),
      input.seoTitle,
      input.seoDescription,
      input.coverImageId,
      input.coverAlt,
      status,
      input.featured ? 1 : 0,
      options.isSample ? 1 : 0,
      readingMinutes(input.body),
      publishedAt,
      publishedAt ?? now,
      now,
    ],
  });
  const post = await getPostById(id);
  if (!post) throw new Error('Post was not saved');
  return post;
}

/** Update content; records the previous slug so old URLs can redirect. */
export async function updatePost(
  id: string,
  input: PostInput,
): Promise<{ post: Post; previousSlug: string } | null> {
  const db = await getDb();
  const existing = await getPostById(id);
  if (!existing) return null;
  const now = new Date().toISOString();
  const statements = [
    {
      sql: `UPDATE posts SET slug = ?, title = ?, excerpt = ?, body = ?, category = ?, tags = ?,
              seo_title = ?, seo_description = ?, cover_image_id = ?, cover_alt = ?, featured = ?,
              reading_minutes = ?, updated_at = ?
            WHERE id = ?`,
      args: [
        input.slug,
        input.title,
        input.excerpt,
        input.body,
        input.category,
        JSON.stringify(input.tags),
        input.seoTitle,
        input.seoDescription,
        input.coverImageId,
        input.coverAlt,
        input.featured ? 1 : 0,
        readingMinutes(input.body),
        now,
        id,
      ],
    },
  ];
  if (existing.slug !== input.slug) {
    // The new slug may have belonged to this post before; never keep a self-redirect.
    statements.push(
      { sql: 'DELETE FROM post_slug_history WHERE old_slug = ?', args: [input.slug] },
      {
        sql: `INSERT OR REPLACE INTO post_slug_history (old_slug, post_id, created_at) VALUES (?, ?, ?)`,
        args: [existing.slug, id, now],
      },
    );
  }
  await db.batch(statements, 'write');
  const post = await getPostById(id);
  if (!post) return null;
  return { post, previousSlug: existing.slug };
}

export async function setPostStatus(id: string, status: PostStatus): Promise<Post | null> {
  const db = await getDb();
  const now = new Date().toISOString();
  await db.execute({
    sql: `UPDATE posts SET status = ?, updated_at = ?,
            published_at = CASE WHEN ? = 'published' THEN COALESCE(published_at, ?) ELSE published_at END
          WHERE id = ?`,
    args: [status, now, status, now, id],
  });
  return getPostById(id);
}

export async function deletePost(id: string): Promise<Post | null> {
  const db = await getDb();
  const existing = await getPostById(id);
  if (!existing) return null;
  await db.execute({ sql: 'DELETE FROM posts WHERE id = ?', args: [id] });
  return existing;
}

export async function deleteSamplePosts(): Promise<string[]> {
  const db = await getDb();
  const result = await db.execute(`SELECT slug FROM posts WHERE is_sample = 1`);
  await db.execute(`DELETE FROM posts WHERE is_sample = 1`);
  return result.rows.map((row) => text(row.slug));
}

/** Mark a post as edited by its author, which removes the sample flag. */
export async function clearSampleFlag(id: string): Promise<void> {
  const db = await getDb();
  await db.execute({ sql: 'UPDATE posts SET is_sample = 0 WHERE id = ?', args: [id] });
}
