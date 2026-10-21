import { createClient, type Client, type InStatement } from '@libsql/client';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { migrations } from './migrations';

/**
 * libSQL / SQLite client.
 *
 * - Local development and self-hosting: DATABASE_URL=file:./data/portfolio.db (the default).
 * - Serverless hosting (e.g. Vercel): a hosted libSQL database such as Turso —
 *   DATABASE_URL=libsql://<db>.turso.io plus DATABASE_AUTH_TOKEN.
 *
 * Migrations run once per process on first use, inside a write transaction, so concurrent
 * build workers or serverless instances cannot apply the same migration twice.
 */

export const DEFAULT_DATABASE_URL = 'file:./data/portfolio.db';

let client: Client | undefined;
let ready: Promise<Client> | undefined;

export function databaseUrl(): string {
  return process.env.DATABASE_URL?.trim() || DEFAULT_DATABASE_URL;
}

function ensureLocalDirectory(url: string) {
  if (!url.startsWith('file:')) return;
  const file = url.slice('file:'.length).split('?')[0];
  if (!file || file === ':memory:') return;
  mkdirSync(path.dirname(path.resolve(file)), { recursive: true });
}

export function createDatabaseClient(url = databaseUrl()): Client {
  ensureLocalDirectory(url);
  return createClient({
    url,
    authToken: process.env.DATABASE_AUTH_TOKEN?.trim() || undefined,
    timeout: 10_000,
  });
}

function isBusy(error: unknown): boolean {
  const message =
    error instanceof Error ? `${error.message} ${(error as { code?: string }).code ?? ''}` : '';
  return /SQLITE_BUSY|database is locked/i.test(message);
}

export async function runMigrations(db: Client): Promise<number> {
  await db.execute(`CREATE TABLE IF NOT EXISTS schema_migrations (
    version INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    applied_at TEXT NOT NULL
  )`);
  const appliedRows = await db.execute('SELECT version FROM schema_migrations');
  const applied = new Set(appliedRows.rows.map((row) => Number(row.version)));
  let count = 0;

  for (const migration of migrations) {
    if (applied.has(migration.version)) continue;
    for (let attempt = 0; ; attempt++) {
      const tx = await db.transaction('write');
      try {
        const existing = await tx.execute({
          sql: 'SELECT 1 FROM schema_migrations WHERE version = ?',
          args: [migration.version],
        });
        if (existing.rows.length === 0) {
          for (const statement of migration.statements) await tx.execute(statement);
          await tx.execute({
            sql: 'INSERT INTO schema_migrations (version, name, applied_at) VALUES (?, ?, ?)',
            args: [migration.version, migration.name, new Date().toISOString()],
          });
          count += 1;
        }
        await tx.commit();
        break;
      } catch (error) {
        await tx.rollback().catch(() => undefined);
        if (isBusy(error) && attempt < 5) {
          await new Promise((resolve) => setTimeout(resolve, 200 * (attempt + 1)));
          continue;
        }
        throw error;
      } finally {
        tx.close();
      }
    }
  }
  return count;
}

/** Shared, migrated client for the current process. */
export function getDb(): Promise<Client> {
  if (!ready) {
    client = createDatabaseClient();
    const db = client;
    ready = (async () => {
      if (databaseUrl().startsWith('file:')) {
        // WAL lets readers and the single writer work concurrently; the setting persists in the file.
        await db.execute('PRAGMA journal_mode = WAL').catch(() => undefined);
      }
      await runMigrations(db);
      return db;
    })().catch((error) => {
      ready = undefined;
      client?.close();
      client = undefined;
      throw error;
    });
  }
  return ready;
}

export async function query(statement: InStatement) {
  const db = await getDb();
  return db.execute(statement);
}

/** Close the shared client (used by scripts and tests). */
export function closeDb() {
  client?.close();
  client = undefined;
  ready = undefined;
}
