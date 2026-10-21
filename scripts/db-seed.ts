import './env';
import { samplePosts } from '../src/content/sample-posts';
import { closeDb, getDb } from '../src/lib/db/client';
import { createPost } from '../src/lib/writing/posts';

/**
 * Inserts the clearly-flagged SAMPLE articles (see src/content/sample-posts.ts) as
 * published posts, skipping any slug that already exists. Safe to run repeatedly.
 * Use --draft to insert them as drafts instead.
 */
async function main() {
  const asDraft = process.argv.includes('--draft');
  const db = await getDb();
  let inserted = 0;
  // Stagger timestamps so the listing order is deterministic (newest first = first in the file).
  const base = Date.now();
  for (const [index, post] of samplePosts.entries()) {
    const exists = await db.execute({
      sql: 'SELECT 1 FROM posts WHERE slug = ?',
      args: [post.slug],
    });
    if (exists.rows.length) continue;
    await createPost(post, {
      isSample: true,
      status: asDraft ? 'draft' : 'published',
      publishedAt: new Date(base - index * 60_000).toISOString(),
    });
    inserted += 1;
  }
  console.log(
    inserted
      ? `Inserted ${inserted} sample post(s) as ${asDraft ? 'drafts' : 'published'} (flagged as samples).`
      : 'Sample posts already present — nothing to do.',
  );
}

main()
  .catch((error) => {
    console.error('Seeding failed:', error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => closeDb());
