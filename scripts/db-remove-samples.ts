import './env';
import { closeDb } from '../src/lib/db/client';
import { deleteSamplePosts } from '../src/lib/writing/posts';

async function main() {
  const removed = await deleteSamplePosts();
  console.log(
    removed.length
      ? `Removed ${removed.length} sample post(s): ${removed.join(', ')}`
      : 'No sample posts found.',
  );
  if (removed.length) {
    console.log(
      'If the site is running, restart it (or publish any change in /admin) so cached pages refresh.',
    );
  }
}

main()
  .catch((error) => {
    console.error('Removing samples failed:', error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => closeDb());
