'use client';

import { LogIn } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useActionState, useEffect, useRef } from 'react';
import { login, type LoginState } from '@/app/admin/actions';
import { buttonClasses } from '../ui/button';

const inputClass =
  'mt-2 h-12 w-full rounded-xl border border-line-control bg-surface px-4 text-ink outline-none focus:border-accent focus-visible:ring-2 focus-visible:ring-accent/30';

function NextField() {
  const params = useSearchParams();
  const next = params.get('next') ?? '';
  return <input type="hidden" name="next" value={next.startsWith('/admin') ? next : ''} />;
}

export function LoginForm({ nextField }: { nextField?: boolean }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (state.error) errorRef.current?.focus();
  }, [state]);

  return (
    <form action={action} className="space-y-5" noValidate={false}>
      {nextField ? <NextField /> : null}
      {state.error ? (
        <p
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          className="rounded-xl border border-danger/40 bg-danger-soft px-4 py-3 text-sm text-ink focus:outline-none"
        >
          {state.error}
        </p>
      ) : null}
      <div>
        <label htmlFor="admin-email" className="text-sm font-medium text-ink">
          Email
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="username"
          required
          defaultValue={state.email ?? ''}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="admin-password" className="text-sm font-medium text-ink">
          Password
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </div>
      <button type="submit" disabled={pending} className={buttonClasses('primary', 'lg', 'w-full')}>
        <LogIn size={17} aria-hidden="true" />
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
