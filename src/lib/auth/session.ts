import 'server-only';
import { createHash, randomBytes } from 'node:crypto';
import { cookies, headers } from 'next/headers';
import type { Route } from 'next';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { getDb } from '@/lib/db/client';
import type { AdminUser } from './users';

/*
 * Database-backed sessions. The browser holds a random 256-bit token in an httpOnly,
 * SameSite=Lax cookie (Secure + __Host- prefix in production); the database stores only
 * its SHA-256 hash, so a leaked database cannot be used to sign in.
 */

const SESSION_DAYS = 7;

export function isSecureCookie(): boolean {
  if (process.env.COOKIE_SECURE === 'false') return false;
  return process.env.NODE_ENV === 'production';
}

export function sessionCookieName(): string {
  return isSecureCookie() ? '__Host-adnan_admin' : 'adnan_admin';
}

/** Both possible names, for the proxy's optimistic check. */
export const SESSION_COOKIE_NAMES = ['__Host-adnan_admin', 'adnan_admin'];

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export async function createSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString('base64url');
  const now = new Date();
  const expires = new Date(now.getTime() + SESSION_DAYS * 24 * 60 * 60_000);
  const userAgent = ((await headers()).get('user-agent') ?? '').slice(0, 300);
  const db = await getDb();
  await db.batch(
    [
      // Opportunistic clean-up of expired sessions.
      { sql: 'DELETE FROM sessions WHERE expires_at < ?', args: [now.toISOString()] },
      {
        sql: 'INSERT INTO sessions (id, user_id, created_at, expires_at, user_agent) VALUES (?, ?, ?, ?, ?)',
        args: [hashToken(token), userId, now.toISOString(), expires.toISOString(), userAgent],
      },
    ],
    'write',
  );
  (await cookies()).set(sessionCookieName(), token, {
    httpOnly: true,
    secure: isSecureCookie(),
    sameSite: 'lax',
    path: '/',
    expires,
  });
}

/** The signed-in admin for this request, or null. Deduplicated per request. */
export const getCurrentAdmin = cache(async (): Promise<AdminUser | null> => {
  const token = (await cookies()).get(sessionCookieName())?.value;
  if (!token || token.length > 128) return null;
  const db = await getDb();
  const result = await db.execute({
    sql: `SELECT u.id, u.email, u.name FROM sessions s JOIN users u ON u.id = s.user_id
          WHERE s.id = ? AND s.expires_at > ?`,
    args: [hashToken(token), new Date().toISOString()],
  });
  const row = result.rows[0];
  return row ? { id: String(row.id), email: String(row.email), name: String(row.name) } : null;
});

/** Use at the top of every admin page and server action. */
export async function requireAdmin(next?: string): Promise<AdminUser> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    const target = next && next.startsWith('/admin') ? `?next=${encodeURIComponent(next)}` : '';
    redirect(`/admin/login${target}` as Route);
  }
  return admin;
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(sessionCookieName())?.value;
  if (token) {
    const db = await getDb();
    await db.execute({ sql: 'DELETE FROM sessions WHERE id = ?', args: [hashToken(token)] });
  }
  store.delete({ name: sessionCookieName(), path: '/', secure: isSecureCookie() });
}

/** Best-effort client IP for rate limiting (set by the hosting proxy). */
export async function clientIp(): Promise<string> {
  const list = await headers();
  const forwarded = list.get('x-forwarded-for')?.split(',')[0]?.trim();
  return (forwarded || list.get('x-real-ip') || 'unknown').slice(0, 64);
}
