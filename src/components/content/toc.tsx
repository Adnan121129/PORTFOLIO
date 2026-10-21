'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export type TocItem = { id: string; label: string; depth?: 2 | 3 };

/**
 * "On this page" navigation. Highlights the section currently in view (scroll-spy via
 * IntersectionObserver) and marks it with aria-current="location".
 */
export function TableOfContents({ items, className }: { items: TocItem[]; className?: string }) {
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Look up headings inside this page only: a previously visited page kept hidden by the
    // router may contain the same ids.
    const scope = navRef.current?.closest('article') ?? document;
    const elements = items
      .map((item) => scope.querySelector<HTMLElement>(`[id="${CSS.escape(item.id)}"]`))
      .filter((element): element is HTMLElement => Boolean(element));
    if (!elements.length) return;
    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.boundingClientRect.top);
          else visible.delete(entry.target.id);
        }
        if (visible.size) {
          const [first] = [...visible.entries()].sort((a, b) => a[1] - b[1]);
          setActive(first[0]);
        }
      },
      { rootMargin: '-15% 0px -55% 0px', threshold: [0, 1] },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav ref={navRef} aria-label="On this page" className={className}>
      <p className="eyebrow mb-4">On this page</p>
      <ol className="space-y-0.5 border-l border-line">
        {items.map((item) => {
          const isActive = item.id === active;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? 'location' : undefined}
                className={cn(
                  '-ml-px block border-l py-1.5 pr-2 text-[0.9rem] leading-snug transition-colors',
                  item.depth === 3 ? 'pl-7' : 'pl-4',
                  isActive
                    ? 'border-accent text-ink'
                    : 'border-transparent text-ink-subtle hover:border-line-strong hover:text-ink',
                )}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Collapsible table of contents for small screens. */
export function MobileToc({ items }: { items: TocItem[] }) {
  return (
    <nav aria-label="On this page" className="lg:hidden">
      <details className="group rounded-xl border border-line bg-surface">
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium text-ink [&::-webkit-details-marker]:hidden">
          On this page
          <span
            aria-hidden="true"
            className="text-ink-subtle transition-transform group-open:rotate-45"
          >
            +
          </span>
        </summary>
        <ol className="space-y-1 border-t border-line px-4 py-3">
          {items.map((item) => (
            <li key={item.id} className={item.depth === 3 ? 'pl-4' : undefined}>
              <a
                href={`#${item.id}`}
                className="block py-1 text-[0.92rem] text-ink-muted hover:text-ink"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </details>
    </nav>
  );
}
