import './env';
import { stdin, stdout } from 'node:process';
import { createInterface } from 'node:readline/promises';
import { z } from 'zod';
import { passwordProblems } from '../src/lib/auth/password';
import { upsertAdmin } from '../src/lib/auth/users';
import { closeDb } from '../src/lib/db/client';

/**
 * Create the admin account (or reset its password).
 *
 *   npm run admin:create                      # interactive prompts, password hidden
 *   ADMIN_EMAIL=… ADMIN_PASSWORD=… npm run admin:create   # non-interactive (CI / hosting shell)
 *
 * Credentials are never stored in code or committed; only a scrypt hash is saved.
 */

async function promptHidden(question: string): Promise<string> {
  if (!stdin.isTTY)
    throw new Error('No TTY available — set ADMIN_EMAIL and ADMIN_PASSWORD instead.');
  stdout.write(question);
  stdin.setRawMode(true);
  stdin.resume();
  stdin.setEncoding('utf8');
  let value = '';
  return new Promise((resolve, reject) => {
    const onData = (char: string) => {
      if (char === '\r' || char === '\n' || char === '\u0004') {
        stdin.setRawMode(false);
        stdin.pause();
        stdin.removeListener('data', onData);
        stdout.write('\n');
        resolve(value);
      } else if (char === '\u0003') {
        stdin.setRawMode(false);
        reject(new Error('Cancelled'));
      } else if (char === '\u007f' || char === '\b') {
        value = value.slice(0, -1);
      } else {
        value += char;
      }
    };
    stdin.on('data', onData);
  });
}

async function main() {
  let email = process.env.ADMIN_EMAIL?.trim() ?? '';
  let password = process.env.ADMIN_PASSWORD ?? '';
  const name = process.env.ADMIN_NAME?.trim() ?? 'Muhammad Adnan';

  if (!email) {
    const rl = createInterface({ input: stdin, output: stdout });
    email = (await rl.question('Admin email: ')).trim();
    rl.close();
  }
  if (!z.email().safeParse(email).success) throw new Error('Enter a valid email address.');

  if (!password) {
    password = await promptHidden(`Password (min 12 characters): `);
    const confirm = await promptHidden('Confirm password: ');
    if (password !== confirm) throw new Error('Passwords do not match.');
  }
  const problems = passwordProblems(password);
  if (problems.length) throw new Error(problems.join(' '));

  const { created } = await upsertAdmin(email, password, name);
  console.log(
    created
      ? `Admin account created for ${email}.`
      : `Password updated for ${email}; existing sessions were signed out.`,
  );
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => closeDb());
