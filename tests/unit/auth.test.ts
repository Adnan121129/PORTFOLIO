import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { hashPassword, passwordProblems, verifyPassword } from '@/lib/auth/password';
import {
  MAX_FAILURES_PER_EMAIL,
  MAX_FAILURES_PER_IP,
  checkLoginAllowed,
  recordLoginAttempt,
} from '@/lib/auth/rate-limit';
import { countUsers, findUserByEmail, upsertAdmin } from '@/lib/auth/users';
import { closeDb, getDb } from '@/lib/db/client';
import { useTemporaryDatabase } from './helpers';

let cleanup: () => void;
beforeAll(() => {
  cleanup = useTemporaryDatabase();
});
afterAll(() => {
  closeDb();
  cleanup();
});

describe('password hashing', () => {
  it('stores salted scrypt hashes and verifies them', async () => {
    const first = await hashPassword('correct horse battery staple');
    const second = await hashPassword('correct horse battery staple');
    expect(first).toMatch(/^scrypt\$32768\$8\$1\$[A-Za-z0-9+/=]+\$[A-Za-z0-9+/=]+$/);
    expect(first).not.toBe(second);
    expect(await verifyPassword('correct horse battery staple', first)).toBe(true);
    expect(await verifyPassword('correct horse battery stapler', first)).toBe(false);
  });

  it('rejects malformed stored hashes without throwing', async () => {
    expect(await verifyPassword('anything', 'plain-text')).toBe(false);
    expect(await verifyPassword('anything', 'scrypt$1$1$1$AAAA$BBBB')).toBe(false);
  });

  it('enforces a minimum length', () => {
    expect(passwordProblems('short')).toContain('Use at least 12 characters.');
    expect(passwordProblems('aaaaaaaaaaaaaaaa')).toContain('Avoid repeating a single character.');
    expect(passwordProblems('a sensible passphrase')).toEqual([]);
  });
});

describe('admin accounts', () => {
  it('creates the admin once and resets the password (ending sessions) on re-run', async () => {
    expect(await upsertAdmin('Admin@Example.test', 'first passphrase here', 'Admin')).toEqual({
      created: true,
    });
    const user = await findUserByEmail('admin@example.test');
    expect(user?.email).toBe('admin@example.test');
    expect(await verifyPassword('first passphrase here', user!.passwordHash)).toBe(true);

    const db = await getDb();
    await db.execute({
      sql: `INSERT INTO sessions (id, user_id, created_at, expires_at) VALUES ('s1', ?, '2026-01-01', '2099-01-01')`,
      args: [user!.id],
    });
    expect(await upsertAdmin('ADMIN@example.test', 'second passphrase here')).toEqual({
      created: false,
    });
    const updated = await findUserByEmail('admin@example.test');
    expect(await verifyPassword('second passphrase here', updated!.passwordHash)).toBe(true);
    expect(updated?.name).toBe('Admin');
    const sessions = await db.execute('SELECT COUNT(*) AS n FROM sessions');
    expect(Number(sessions.rows[0].n)).toBe(0);
    expect(await countUsers()).toBe(1);
  });
});

describe('login rate limiting', () => {
  const now = new Date('2026-05-01T12:00:00.000Z');
  const minutes = (n: number) => new Date(now.getTime() + n * 60_000);

  it('locks an account after repeated failures and unlocks after the window', async () => {
    for (let i = 0; i < MAX_FAILURES_PER_EMAIL; i++) {
      expect((await checkLoginAllowed(`10.0.0.${i}`, 'victim@example.test', now)).allowed).toBe(
        true,
      );
      await recordLoginAttempt(`10.0.0.${i}`, 'victim@example.test', false, now);
    }
    const blocked = await checkLoginAllowed('10.0.0.99', 'VICTIM@example.test', minutes(1));
    expect(blocked).toEqual({ allowed: false, retryAfterMinutes: 14 });
    expect((await checkLoginAllowed('10.0.0.99', 'victim@example.test', minutes(16))).allowed).toBe(
      true,
    );
  });

  it('limits a single IP across many accounts', async () => {
    for (let i = 0; i < MAX_FAILURES_PER_IP; i++) {
      await recordLoginAttempt('192.0.2.1', `user${i}@example.test`, false, now);
    }
    expect((await checkLoginAllowed('192.0.2.1', 'new@example.test', minutes(2))).allowed).toBe(
      false,
    );
    expect((await checkLoginAllowed('192.0.2.2', 'new@example.test', minutes(2))).allowed).toBe(
      true,
    );
  });

  it('clears an account’s failures after a successful sign-in', async () => {
    for (let i = 0; i < MAX_FAILURES_PER_EMAIL - 1; i++) {
      await recordLoginAttempt('198.51.100.1', 'owner@example.test', false, now);
    }
    await recordLoginAttempt('198.51.100.1', 'owner@example.test', true, minutes(1));
    await recordLoginAttempt('198.51.100.1', 'owner@example.test', false, minutes(2));
    expect(
      (await checkLoginAllowed('198.51.100.1', 'owner@example.test', minutes(3))).allowed,
    ).toBe(true);
  });
});
