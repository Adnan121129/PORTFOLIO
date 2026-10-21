'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { mainNav } from '@/content/site';
import { cn } from '@/lib/utils';

export function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Desktop navigation; marks the current section with aria-current. */
export function NavLinks() {
  const pathname = usePathname() ?? '/';

  return (
    <ul className="flex items-center gap-1">
      {mainNav.map((item) => {
        const active = isActivePath(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'relative inline-flex h-10 items-center rounded-full px-3.5 text-[0.94rem] transition-colors',
                active ? 'text-ink' : 'text-ink-muted hover:text-ink',
              )}
            >
              {item.label}
              <span
                aria-hidden="true"
                className={cn(
                  'absolute bottom-1.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-accent transition-opacity',
                  active ? 'opacity-100' : 'opacity-0',
                )}
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
