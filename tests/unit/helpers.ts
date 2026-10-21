import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

/**
 * Point the database client at a fresh temporary SQLite file. Call before the first
 * database access in a test file; the returned function removes the directory.
 */
export function useTemporaryDatabase(): () => void {
  const dir = mkdtempSync(path.join(tmpdir(), 'portfolio-test-'));
  process.env.DATABASE_URL = `file:${path.join(dir, 'test.db')}`;
  return () => rmSync(dir, { recursive: true, force: true });
}
