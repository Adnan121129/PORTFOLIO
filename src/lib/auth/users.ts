import { randomUUID } from 'node:crypto';
import { getDb } from '@/lib/db/client';
import { hashPassword } from './password';

export type AdminUser = { id: string; email: string; name: string };

export async function findUserByEmail(
  email: string,
): Promise<(AdminUser & { passwordHash: string }) | null> {
  const db = await getDb();
  const result = await db.execute({
    sql: 'SELECT id, email, name, password_hash FROM users WHERE email = ? COLLATE NOCASE',
    args: [email.trim()],
  });
  const row = result.rows[0];
  if (!row) return null;
  return {
    id: String(row.id),
    email: String(row.email),
    name: String(row.name),
    passwordHash: String(row.password_hash),
  };
}

/** Create the admin account, or reset its password if it already exists. */
export async function upsertAdmin(
  email: string,
  password: string,
  name = '',
): Promise<{ created: boolean }> {
  const db = await getDb();
  const passwordHash = await hashPassword(password);
  const now = new Date().toISOString();
  const existing = await findUserByEmail(email);
  if (existing) {
    await db.batch(
      [
        {
          sql: "UPDATE users SET password_hash = ?, name = COALESCE(NULLIF(?, ''), name), updated_at = ? WHERE id = ?",
          args: [passwordHash, name, now, existing.id],
        },
        // Changing the password signs out every existing session.
        { sql: 'DELETE FROM sessions WHERE user_id = ?', args: [existing.id] },
      ],
      'write',
    );
    return { created: false };
  }
  await db.execute({
    sql: 'INSERT INTO users (id, email, name, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
    args: [randomUUID(), email.trim().toLowerCase(), name, passwordHash, now, now],
  });
  return { created: true };
}

export async function countUsers(): Promise<number> {
  const db = await getDb();
  const result = await db.execute('SELECT COUNT(*) AS n FROM users');
  return Number(result.rows[0]?.n ?? 0);
}
