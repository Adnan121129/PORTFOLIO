'use client';

import { Search, X } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import type { ProjectCategory } from '@/content/types';
import { cn } from '@/lib/utils';

export type LibraryItem = {
  slug: string;
  title: string;
  searchText: string;
  categories: ProjectCategory[];
};

type CategoryOption = { value: ProjectCategory; label: string };

type ViewProps = {
  items: LibraryItem[];
  cards: Record<string, ReactNode>;
  categories: CategoryOption[];
  initialQuery?: string;
  initialCategory?: ProjectCategory | 'all';
  onStateChange?: (query: string, category: ProjectCategory | 'all') => void;
};

/** Lowercase words without accents or punctuation ("Next.js" → ["next", "js"]). */
function words(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
}

/**
 * Every query word must begin a word in the project's text, so "power bi" finds
 * "Power BI" but not "AI-powered … mobile".
 */
export function filterLibrary(
  items: LibraryItem[],
  query: string,
  category: ProjectCategory | 'all',
): LibraryItem[] {
  const terms = words(query);
  return items.filter((item) => {
    if (category !== 'all' && !item.categories.includes(category)) return false;
    if (!terms.length) return true;
    const vocabulary = words(item.searchText);
    return terms.every((term) => vocabulary.some((word) => word.startsWith(term)));
  });
}

/** Search + category filter over server-rendered project cards. */
export function ProjectLibraryView({
  items,
  cards,
  categories,
  initialQuery = '',
  initialCategory = 'all',
  onStateChange,
}: ViewProps) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<ProjectCategory | 'all'>(initialCategory);
  const searchId = useId();
  const statusId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => filterLibrary(items, query, category), [items, query, category]);
  const categoryLabel = categories.find((option) => option.value === category)?.label;

  const update = (nextQuery: string, nextCategory: ProjectCategory | 'all') => {
    setQuery(nextQuery);
    setCategory(nextCategory);
    onStateChange?.(nextQuery, nextCategory);
  };

  const clear = () => {
    update('', 'all');
    inputRef.current?.focus();
  };

  return (
    <div>
      <div
        className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
        role="search"
      >
        <div className="relative w-full lg:max-w-sm">
          <label htmlFor={searchId} className="sr-only">
            Search projects
          </label>
          <Search
            size={17}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-subtle"
          />
          <input
            ref={inputRef}
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => update(event.target.value, category)}
            placeholder="Search by name, technology or topic…"
            autoComplete="off"
            aria-describedby={statusId}
            className="h-12 w-full rounded-full border border-line-control bg-surface pr-11 pl-11 text-[0.95rem] text-ink transition-colors outline-none placeholder:text-ink-subtle focus:border-accent focus-visible:ring-2 focus-visible:ring-accent/30 [&::-webkit-search-cancel-button]:hidden"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                update('', category);
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="absolute top-1/2 right-3 grid size-7 -translate-y-1/2 place-items-center rounded-full text-ink-subtle hover:bg-surface-2 hover:text-ink"
            >
              <X size={15} aria-hidden="true" />
            </button>
          ) : null}
        </div>

        <fieldset className="min-w-0">
          <legend className="sr-only">Filter by category</legend>
          <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 lg:flex-wrap lg:overflow-visible lg:pb-0">
            {[{ value: 'all' as const, label: 'All' }, ...categories].map((option) => {
              const active = category === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => update(query, option.value)}
                  aria-pressed={active}
                  className={cn(
                    'h-10 shrink-0 rounded-full border px-4 text-sm transition-colors',
                    active
                      ? 'border-ink bg-ink text-bg'
                      : 'border-line bg-surface text-ink-muted hover:border-line-strong hover:text-ink',
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>

      <p
        id={statusId}
        role="status"
        aria-live="polite"
        className="mt-6 text-sm text-ink-subtle"
        data-testid="project-count"
      >
        {results.length === items.length && !query
          ? `Showing all ${items.length} projects`
          : `Showing ${results.length} of ${items.length} projects${categoryLabel && category !== 'all' ? ` in ${categoryLabel}` : ''}${query ? ` matching “${query}”` : ''}`}
      </p>

      {results.length ? (
        <ul className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3" data-testid="project-results">
          {results.map((item) => (
            <li key={item.slug}>{cards[item.slug]}</li>
          ))}
        </ul>
      ) : (
        <div
          className="mt-6 rounded-[var(--radius-card)] border border-dashed border-line-strong bg-surface px-6 py-14 text-center"
          data-testid="project-empty"
        >
          <p className="font-serif text-3xl text-ink">No projects match.</p>
          <p className="mx-auto mt-3 max-w-md text-ink-muted">
            Nothing matches {query ? <>“{query}”</> : 'this filter'}
            {category !== 'all' && categoryLabel ? <> in {categoryLabel}</> : null}. Try a broader
            term such as “Django”, “Power BI” or “React”.
          </p>
          <button
            type="button"
            onClick={clear}
            className="mt-6 inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm font-medium text-bg hover:bg-accent-strong"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

function isCategory(value: string | null, categories: CategoryOption[]): value is ProjectCategory {
  return Boolean(value && categories.some((option) => option.value === value));
}

/** URL-synced wrapper: ?q= and ?category= make filtered views shareable. */
export function ProjectLibrary(
  props: Omit<ViewProps, 'initialQuery' | 'initialCategory' | 'onStateChange'>,
) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const current = searchParams.toString();
  const rawCategory = searchParams.get('category');
  const initialCategory = isCategory(rawCategory, props.categories) ? rawCategory : 'all';
  const initialQuery = searchParams.get('q') ?? '';
  const timer = useRef<number | undefined>(undefined);
  // The search string this component last wrote. Changes that did not come from here
  // (e.g. a link to /projects?category=…) remount the view with the new filters.
  const lastWritten = useRef(current);
  const [version, setVersion] = useState(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  useEffect(() => {
    if (current !== lastWritten.current) {
      lastWritten.current = current;
      setVersion((value) => value + 1);
    }
  }, [current]);

  const onStateChange = (query: string, category: ProjectCategory | 'all') => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const params = new URLSearchParams();
      if (query.trim()) params.set('q', query.trim());
      if (category !== 'all') params.set('category', category);
      const search = params.toString();
      lastWritten.current = search;
      window.history.replaceState(null, '', search ? `${pathname}?${search}` : pathname);
    }, 250);
  };

  return (
    <ProjectLibraryView
      key={version}
      {...props}
      initialQuery={initialQuery}
      initialCategory={initialCategory}
      onStateChange={onStateChange}
    />
  );
}
