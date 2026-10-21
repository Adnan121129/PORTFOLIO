import './env';
import { rmSync } from 'node:fs';
import path from 'node:path';
import { samplePosts } from '../src/content/sample-posts';
import { upsertAdmin } from '../src/lib/auth/users';
import { closeDb, databaseUrl, getDb } from '../src/lib/db/client';
import { createPost } from '../src/lib/writing/posts';

/**
 * Prepares the throwaway database used by the Playwright suite: a fresh file with the
 * schema, the flagged sample articles and a test-only admin account. It refuses to touch
 * any database whose file name does not contain "e2e", so it can never wipe real content.
 */
async function main() {
  const url = databaseUrl();
  const file = url.startsWith('file:') ? url.slice('file:'.length).split('?')[0] : '';
  if (!file || !path.basename(file).includes('e2e')) {
    throw new Error(
      `Refusing to prepare ${url}: set DATABASE_URL to a file whose name contains "e2e".`,
    );
  }
  const email = process.env.E2E_ADMIN_EMAIL;
  const password = process.env.E2E_ADMIN_PASSWORD;
  if (!email || !password)
    throw new Error('Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD (see playwright.config.ts).');

  for (const suffix of ['', '-wal', '-shm']) rmSync(path.resolve(file + suffix), { force: true });

  await getDb();
  const base = Date.now();
  for (const [index, post] of samplePosts.entries()) {
    await createPost(post, {
      isSample: true,
      status: 'published',
      publishedAt: new Date(base - (index + 1) * 60_000).toISOString(),
    });
  }
  await upsertAdmin(email, password, 'E2E Admin');
  console.log(`Prepared ${file}: ${samplePosts.length} sample posts and a test admin.`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => closeDb());
