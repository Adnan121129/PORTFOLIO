import './env';
import { closeDb, createDatabaseClient, databaseUrl, runMigrations } from '../src/lib/db/client';

async function main() {
  const url = databaseUrl();
  const client = createDatabaseClient(url);
  try {
    if (url.startsWith('file:')) await client.execute('PRAGMA journal_mode = WAL');
    const applied = await runMigrations(client);
    console.log(
      applied
        ? `Applied ${applied} migration(s) to ${redact(url)}.`
        : `Database ${redact(url)} is up to date.`,
    );
  } finally {
    client.close();
    closeDb();
  }
}

function redact(url: string) {
  return url.replace(/\/\/[^@/]*@/, '//***@');
}

main().catch((error) => {
  console.error('Migration failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
