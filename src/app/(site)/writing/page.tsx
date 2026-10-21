import { ArrowLeft, ArrowRight, Rss, Search } from 'lucide-react';
import type { Route } from 'next';
import Form from 'next/form';
import Link from 'next/link';
import { Suspense } from 'react';
import { ArticleCard } from '@/components/writing/article-card';
import { JsonLd } from '@/components/ui/json-ld';
import { PageIntro } from '@/components/ui/primitives';
import { categoryLabel, isWritingCategory, writingCategories } from '@/content/writing-categories';
import { cn } from '@/lib/utils';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';
import { getWritingOverview, searchPublishedPosts } from '@/lib/writing/queries';

export const metadata = pageMetadata({
  title: 'Writing',
  description:
    'Articles by Muhammad Adnan on data and business intelligence, software engineering, AI/ML, tools, IT, tutorials, reviews and professional reflections.',
  path: '/writing',
});

const PAGE_SIZE = 9;

type Filters = { q: string; category: string; page: number };

function readFilters(params: Record<string, string | string[] | undefined>): Filters {
  const first = (value: string | string[] | undefined) =>
    (Array.isArray(value) ? value[0] : value) ?? '';
  const q = first(params.q).trim().slice(0, 100);
  const rawCategory = first(params.category);
  const page = Math.min(500, Math.max(1, Number.parseInt(first(params.page), 10) || 1));
  return { q, category: isWritingCategory(rawCategory) ? rawCategory : '', page };
}

function hrefFor(filters: Partial<Filters>): Route {
  const params = new URLSearchParams();
  if (filters.q) params.set('q', filters.q);
  if (filters.category) params.set('category', filters.category);
  if (filters.page && filters.page > 1) params.set('page', String(filters.page));
  const query = params.toString();
  return (query ? `/writing?${query}` : '/writing') as Route;
}

export default function WritingPage({ searchParams }: PageProps<'/writing'>) {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Writing', path: '/writing' },
        ])}
      />
      <PageIntro
        eyebrow="Journal"
        title="Writing"
        aside={
          <a
            href="/writing/feed.xml"
            className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink"
          >
            <Rss size={15} aria-hidden="true" className="text-accent" />
            Subscribe via RSS
          </a>
        }
      >
        <p>
          Notes on data and business intelligence, software engineering, AI and ML, tools and IT —
          explainers, reviews, tutorials and reflections.
        </p>
      </PageIntro>
      <section aria-label="Articles" className="container-page py-12 md:py-16">
        <Suspense fallback={<WritingSkeleton />}>
          <WritingResults searchParams={searchParams} />
        </Suspense>
      </section>
    </>
  );
}

function WritingSkeleton() {
  return (
    <div aria-hidden="true" className="animate-pulse">
      <div className="h-12 max-w-xl rounded-full bg-surface-2" />
      <div className="mt-6 flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 w-28 rounded-full bg-surface-2" />
        ))}
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-80 rounded-[var(--radius-card)] bg-surface-2" />
        ))}
      </div>
    </div>
  );
}

async function WritingResults({
  searchParams,
}: {
  searchParams: PageProps<'/writing'>['searchParams'];
}) {
  const filters = readFilters(await searchParams);
  const [{ posts, total }, overview] = await Promise.all([
    searchPublishedPosts(filters.q, filters.category, filters.page, PAGE_SIZE),
    getWritingOverview(),
  ]);
  const totalPublished = Object.values(overview.counts).reduce((sum, n) => sum + n, 0);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const filtered = Boolean(filters.q || filters.category);
  const showFeatured = !filtered && filters.page === 1 && overview.featured;
  const listed = showFeatured ? posts.filter((post) => post.id !== overview.featured?.id) : posts;

  return (
    <div>
      <Form
        action="/writing"
        role="search"
        className="flex max-w-xl gap-2"
        aria-label="Search articles"
      >
        <div className="relative flex-1">
          <label htmlFor="writing-search" className="sr-only">
            Search articles
          </label>
          <Search
            size={17}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-subtle"
          />
          <input
            id="writing-search"
            type="search"
            name="q"
            defaultValue={filters.q}
            placeholder="Search titles and full text…"
            maxLength={100}
            className="h-12 w-full rounded-full border border-line-control bg-surface pr-4 pl-11 text-[0.95rem] text-ink outline-none focus:border-accent focus-visible:ring-2 focus-visible:ring-accent/30"
          />
        </div>
        {filters.category ? <input type="hidden" name="category" value={filters.category} /> : null}
        <button
          type="submit"
          className="h-12 shrink-0 rounded-full bg-ink px-5 text-sm font-medium text-bg hover:bg-accent-strong"
        >
          Search
        </button>
      </Form>

      <nav aria-label="Categories" className="mt-6">
        <ul className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 md:flex-wrap md:overflow-visible">
          <li>
            <Link
              href={hrefFor({ q: filters.q })}
              aria-current={!filters.category ? 'page' : undefined}
              className={cn(
                'inline-flex h-10 shrink-0 items-center rounded-full border px-4 text-sm whitespace-nowrap transition-colors',
                !filters.category
                  ? 'border-ink bg-ink text-bg'
                  : 'border-line bg-surface text-ink-muted hover:text-ink',
              )}
            >
              All <span className="ml-1.5 opacity-60">{totalPublished}</span>
            </Link>
          </li>
          {writingCategories
            .filter(
              (category) =>
                (overview.counts[category.slug] ?? 0) > 0 || filters.category === category.slug,
            )
            .map((category) => {
              const count = overview.counts[category.slug] ?? 0;
              const active = filters.category === category.slug;
              return (
                <li key={category.slug}>
                  <Link
                    href={hrefFor({ q: filters.q, category: category.slug })}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'inline-flex h-10 shrink-0 items-center rounded-full border px-4 text-sm whitespace-nowrap transition-colors',
                      active
                        ? 'border-ink bg-ink text-bg'
                        : 'border-line bg-surface text-ink-muted hover:text-ink',
                    )}
                  >
                    {category.label} <span className="ml-1.5 opacity-60">{count}</span>
                  </Link>
                </li>
              );
            })}
        </ul>
      </nav>

      <p role="status" className="mt-6 text-sm text-ink-subtle" data-testid="writing-count">
        {filtered
          ? `${total} ${total === 1 ? 'article' : 'articles'}${filters.category ? ` in ${categoryLabel(filters.category)}` : ''}${filters.q ? ` matching “${filters.q}”` : ''}`
          : `${total} published ${total === 1 ? 'article' : 'articles'}`}
        {filtered ? (
          <>
            {' · '}
            <Link href="/writing" className="link-inline">
              Clear filters
            </Link>
          </>
        ) : null}
      </p>

      {showFeatured && overview.featured ? (
        <div className="mt-8">
          <p className="eyebrow mb-3">Featured</p>
          <ArticleCard post={overview.featured} variant="featured" headingLevel="h2" />
        </div>
      ) : null}

      {listed.length ? (
        <>
          {showFeatured ? <h2 className="eyebrow mt-12 mb-3">Latest</h2> : null}
          <ul
            className={cn('grid gap-5 md:grid-cols-2 lg:grid-cols-3', !showFeatured && 'mt-8')}
            data-testid="writing-results"
          >
            {listed.map((post) => (
              <li key={post.id}>
                <ArticleCard post={post} headingLevel={showFeatured ? 'h3' : 'h2'} />
              </li>
            ))}
          </ul>
        </>
      ) : !showFeatured ? (
        <div
          className="mt-8 rounded-[var(--radius-card)] border border-dashed border-line-strong bg-surface px-6 py-14 text-center"
          data-testid="writing-empty"
        >
          <p className="font-serif text-3xl text-ink">
            {totalPublished ? 'No articles match.' : 'No articles yet.'}
          </p>
          <p className="mx-auto mt-3 max-w-md text-ink-muted">
            {totalPublished
              ? 'Try a different search term or category.'
              : 'Articles will appear here as soon as they are published.'}
          </p>
          {filtered ? (
            <Link
              href="/writing"
              className="mt-6 inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm font-medium text-bg hover:bg-accent-strong"
            >
              Show all articles
            </Link>
          ) : null}
        </div>
      ) : null}

      {pages > 1 ? (
        <nav
          aria-label="Pagination"
          className="mt-12 flex items-center justify-between gap-4 border-t border-line pt-6"
        >
          {filters.page > 1 ? (
            <Link
              href={hrefFor({ ...filters, page: filters.page - 1 })}
              className="inline-flex items-center gap-2 text-sm font-medium text-ink"
              rel="prev"
            >
              <ArrowLeft size={15} aria-hidden="true" /> Newer
            </Link>
          ) : (
            <span />
          )}
          <span className="text-sm text-ink-subtle">
            Page {filters.page} of {pages}
          </span>
          {filters.page < pages ? (
            <Link
              href={hrefFor({ ...filters, page: filters.page + 1 })}
              className="inline-flex items-center gap-2 text-sm font-medium text-ink"
              rel="next"
            >
              Older <ArrowRight size={15} aria-hidden="true" />
            </Link>
          ) : (
            <span />
          )}
        </nav>
      ) : null}
    </div>
  );
}
