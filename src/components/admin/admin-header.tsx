'use client';

import { ExternalLink, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from '@/app/admin/actions';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '../theme/theme-toggle';

const links = [
  {
    href: '/admin' as const,
    label: 'Articles',
    match: (path: string) => path === '/admin' || path.startsWith('/admin/posts'),
  },
  {
    href: '/admin/media' as const,
    label: 'Media',
    match: (path: string) => path.startsWith('/admin/media'),
  },
];

export function AdminHeader() {
  const pathname = usePathname() ?? '/admin';
  const onLogin = pathname.startsWith('/admin/login');

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href={onLogin ? '/' : '/admin'} className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="grid size-8 place-items-center rounded-lg bg-ink font-serif text-sm text-bg italic"
            >
              MA
            </span>
            <span className="text-sm font-semibold text-ink">Writing admin</span>
          </Link>
          {!onLogin ? (
            <nav aria-label="Admin">
              <ul className="flex items-center gap-1">
                {links.map((link) => {
                  const active = link.match(pathname);
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'inline-flex h-9 items-center rounded-full px-3 text-sm transition-colors',
                          active ? 'bg-surface-2 text-ink' : 'text-ink-muted hover:text-ink',
                        )}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="hidden h-9 items-center gap-1.5 rounded-full px-3 text-sm text-ink-muted hover:text-ink sm:inline-flex"
          >
            View site <ExternalLink size={14} aria-hidden="true" />
          </Link>
          <ThemeToggle />
          {!onLogin ? (
            <form
              action={logout}
              onSubmit={(event) => {
                if (
                  document.documentElement.dataset.unsaved === 'true' &&
                  !window.confirm('You have unsaved changes. Sign out without saving them?')
                ) {
                  event.preventDefault();
                }
              }}
            >
              <button
                type="submit"
                className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line px-3.5 text-sm text-ink-muted hover:border-line-strong hover:text-ink"
              >
                <LogOut size={15} aria-hidden="true" /> Sign out
              </button>
            </form>
          ) : null}
        </div>
      </div>
    </header>
  );
}
