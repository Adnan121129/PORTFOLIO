import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { categoryLabel } from '@/content/writing-categories';
import { cn, formatDate } from '@/lib/utils';
import type { PostSummary } from '@/lib/writing/types';

/** Ten bar heights (22–91%) and a highlighted index, derived deterministically from a seed. */
function motifBars(seed: string) {
  let hash = 2166136261;
  for (const char of seed) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  const bars: number[] = [];
  for (let i = 0; i < 10; i++) {
    hash = Math.imul(hash ^ (hash >>> 15), 2246822507) ^ i;
    bars.push(22 + (Math.abs(hash) % 70));
  }
  return { bars, highlight: Math.abs(hash) % bars.length };
}

/** Deterministic bar motif derived from the slug — a small data-flavoured cover stand-in. */
function DataMotif({ seed }: { seed: string }) {
  const { bars, highlight } = motifBars(seed);
  return (
    <div className="flex h-full w-full items-end gap-[3%]">
      {bars.map((height, index) => (
        <span
          key={index}
          className={cn(
            'flex-1 rounded-t-[3px]',
            index === highlight ? 'bg-accent/70' : 'bg-line-strong/70',
          )}
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  );
}

/** Article teaser. The title link is stretched over the card (single focus stop). */
export function ArticleCard({
  post,
  variant = 'default',
  headingLevel = 'h3',
}: {
  post: PostSummary;
  variant?: 'default' | 'featured' | 'row';
  headingLevel?: 'h2' | 'h3';
}) {
  const Heading = headingLevel;
  const featured = variant === 'featured';
  return (
    <article
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[var(--shadow-card)]',
        featured && 'md:grid md:grid-cols-2',
      )}
      data-post={post.slug}
    >
      {post.cover ? (
        <div
          className={cn(
            'relative overflow-hidden border-b border-line bg-surface-2',
            featured && 'md:border-r md:border-b-0',
          )}
        >
          {/* Media images are already optimised (WebP, ≤2000px) when uploaded. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.cover.url}
            alt={post.cover.alt}
            width={post.cover.width}
            height={post.cover.height}
            loading="lazy"
            decoding="async"
            className="aspect-[16/9] h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
        </div>
      ) : (
        <div
          aria-hidden="true"
          className={cn(
            'bg-grid relative flex aspect-[16/7] items-end overflow-hidden border-b border-line bg-bg-elevated px-5 pt-10',
            featured && 'md:aspect-auto md:border-r md:border-b-0 md:px-8',
          )}
        >
          <DataMotif seed={post.slug} />
          <span className="absolute top-4 left-5 font-mono text-[0.68rem] tracking-[0.14em] text-ink-subtle uppercase">
            {categoryLabel(post.category)}
          </span>
        </div>
      )}
      <div className={cn('flex flex-1 flex-col p-5 sm:p-6', featured && 'md:p-8')}>
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[0.7rem] tracking-[0.12em] text-ink-subtle uppercase">
          <span className="text-accent">{categoryLabel(post.category)}</span>
          <span aria-hidden="true">·</span>
          {post.publishedAt ? (
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, 'short')}</time>
          ) : null}
          <span aria-hidden="true">·</span>
          <span>{post.readingMinutes} min read</span>
        </p>
        <Heading
          className={cn(
            'mt-3 font-serif leading-[1.08] tracking-tight text-ink',
            featured ? 'text-[clamp(1.9rem,3vw,2.6rem)]' : 'text-[1.6rem]',
          )}
        >
          <Link
            href={`/writing/${post.slug}`}
            className="after:absolute after:inset-0 after:rounded-[var(--radius-card)] after:content-['']"
          >
            {post.title}
          </Link>
        </Heading>
        <p
          className={cn(
            'mt-3 text-[0.95rem] leading-relaxed text-ink-muted',
            !featured && 'line-clamp-3',
          )}
        >
          {post.excerpt}
        </p>
        {post.tags.length ? (
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tags">
            {post.tags.slice(0, featured ? 5 : 3).map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-surface-2 px-2.5 py-1 text-[0.75rem] text-ink-muted"
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
        <span
          className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-medium text-ink"
          aria-hidden="true"
        >
          Read article
          <ArrowRight
            size={15}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </span>
      </div>
    </article>
  );
}
