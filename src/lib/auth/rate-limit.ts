import { getDb } from '@/lib/db/client';

/*
 * Login throttling stored in the database, so it holds across server restarts and
 * serverless instances. Limits are per IP and per account within a sliding window.
 */

export const WINDOW_MINUTES = 15;
export const MAX_FAILURES_PER_IP = 10;
export const MAX_FAILURES_PER_EMAIL = 5;

export type RateLimitResult = { allowed: true } | { allowed: false; retryAfterMinutes: number };

export async function checkLoginAllowed(
  ip: string,
  email: string,
  now = new Date(),
): Promise<RateLimitResult> {
  const db = await getDb();
  const since = new Date(now.getTime() - WINDOW_MINUTES * 60_000).toISOString();
  const normalisedEmail = email.trim().toLowerCase();

  // Opportunistic clean-up of old rows.
  await db.execute({
    sql: 'DELETE FROM login_attempts WHERE attempted_at < ?',
    args: [new Date(now.getTime() - 24 * 60 * 60_000).toISOString()],
  });

  const result = await db.execute({
    sql: `SELECT
            SUM(CASE WHEN ip = ? THEN 1 ELSE 0 END) AS ip_failures,
            SUM(CASE WHEN email = ? THEN 1 ELSE 0 END) AS email_failures,
            MIN(attempted_at) AS oldest
          FROM login_attempts
          WHERE success = 0 AND attempted_at >= ? AND (ip = ? OR email = ?)`,
    args: [ip, normalisedEmail, since, ip, normalisedEmail],
  });
  const row = result.rows[0];
  const ipFailures = Number(row?.ip_failures ?? 0);
  const emailFailures = Number(row?.email_failures ?? 0);
  if (ipFailures >= MAX_FAILURES_PER_IP || emailFailures >= MAX_FAILURES_PER_EMAIL) {
    const oldest = row?.oldest ? new Date(String(row.oldest)).getTime() : now.getTime();
    const retryAt = oldest + WINDOW_MINUTES * 60_000;
    return {
      allowed: false,
      retryAfterMinutes: Math.max(1, Math.ceil((retryAt - now.getTime()) / 60_000)),
    };
  }
  return { allowed: true };
}

export async function recordLoginAttempt(
  ip: string,
  email: string,
  success: boolean,
  now = new Date(),
) {
  const db = await getDb();
  if (success) {
    // A successful sign-in clears the account's recent failures.
    await db.execute({
      sql: 'DELETE FROM login_attempts WHERE email = ? AND success = 0',
      args: [email.trim().toLowerCase()],
    });
  }
  await db.execute({
    sql: 'INSERT INTO login_attempts (ip, email, success, attempted_at) VALUES (?, ?, ?, ?)',
    args: [ip, email.trim().toLowerCase(), success ? 1 : 0, now.toISOString()],
  });
}
