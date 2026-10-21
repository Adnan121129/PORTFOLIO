import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { MobileToc, TableOfContents } from '@/components/content/toc';
import { ArticleCard } from '@/components/writing/article-card';
import { ShareActions } from '@/components/writing/share-actions';
import { JsonLd } from '@/components/ui/json-ld';
import { Breadcrumbs, Chip } from '@/components/ui/primitives';
import { site } from '@/content/site';
import { categoryLabel } from '@/content/writing-categories';
import { absoluteUrl } from '@/lib/env';
import { formatDate } from '@/lib/utils';
import { blogPostingJsonLd, breadcrumbJsonLd, pageMetadata } from '@/lib/seo';
import { getArticleRedirect, getPublishedArticle, getPublishedSlugs } from '@/lib/writing/queries';

// Published articles are generated statically; new ones are generated on first visit and
// every admin change refreshes them through the "posts" cache tag.
export const ensureStatic = 'navigation';

/** Placeholder used only when no article exists yet (Cache Components needs one param). */
const NO_POSTS_PLACEHOLDER = '__no-published-posts__';

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs();
  return slugs.length ? slugs.map(({ slug }) => ({ slug })) : [{ slug: NO_POSTS_PLACEHOLDER }];
}

export async function generateMetadata({
  params,
}: PageProps<'/writing/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);
  if (!article) return { title: 'Article not found', robots: { index: false, follow: true } };
  const { post } = article;
  return {
    ...pageMetadata({
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      path: `/writing/${post.slug}`,
      type: 'article',
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt,
      tags: post.tags,
    }),
    keywords: post.tags,
  };
}

const MIN_UPDATE_GAP_MS = 24 * 60 * 60 * 1000;

export default async function ArticlePage({ params }: PageProps<'/writing/[slug]'>) {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);
  if (!article) {
    const moved = await getArticleRedirect(slug);
    if (moved) permanentRedirect(`/writing/${moved}`);
    notFound();
  }
  const { post, rendered, related } = article;
  const url = absoluteUrl(`/writing/${post.slug}`);
  const showUpdated =
    post.publishedAt &&
    new Date(post.updatedAt).getTime() - new Date(post.publishedAt).getTime() > MIN_UPDATE_GAP_MS;
  const toc = rendered.toc.map((entry) => ({
    id: entry.id,
    label: entry.text,
    depth: entry.depth,
  }));
  const showToc = toc.length >= 3;

  return (
    <article>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Writing', path: '/writing' },
            { name: post.title, path: `/writing/${post.slug}` },
          ]),
          blogPostingJsonLd({
            title: post.title,
            description: post.seoDescription || post.excerpt,
            path: `/writing/${post.slug}`,
            publishedAt: post.publishedAt ?? post.createdAt,
            updatedAt: post.updatedAt,
            image: post.cover?.url,
            tags: post.tags,
            category: categoryLabel(post.category),
          }),
        ]}
      />

      <header className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden="true"
          className="bg-grid mask-fade pointer-events-none absolute inset-0 opacity-70"
        />
        <div className="container-page relative pt-8 pb-12 md:pt-10 md:pb-14">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Writing', href: '/writing' },
              { label: post.title },
            ]}
          />
          <div className={showToc ? 'mt-10 max-w-3xl lg:w-2/3' : 'mx-auto mt-10 max-w-3xl'}>
            <p className="font-mono text-[0.72rem] tracking-[0.14em] uppercase">
              <Link
                href={`/writing?category=${post.category}`}
                className="text-accent hover:underline"
              >
                {categoryLabel(post.category)}
              </Link>
            </p>
            <h1 className="mt-4 font-serif text-[clamp(2.4rem,5.4vw,4.4rem)] leading-[1.02] tracking-tight text-ink">
              {post.title}
            </h1>
            {post.excerpt ? <p className="mt-6 text-lead text-ink-muted">{post.excerpt}</p> : null}
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-line pt-6 text-sm text-ink-muted">
              <span className="flex items-center gap-3">
                <Image
                  src="/images/muhammad-adnan-avatar.jpg"
                  alt=""
                  width={36}
                  height={36}
                  sizes="36px"
                  className="size-9 rounded-full border border-line object-cover"
                />
                <span>
                  By{' '}
                  <Link
                    href="/about"
                    className="font-medium text-ink hover:text-accent"
                    rel="author"
                  >
                    {site.name}
                  </Link>
                </span>
              </span>
              {post.publishedAt ? (
                <span>
                  Published <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                </span>
              ) : null}
              {showUpdated ? (
                <span>
                  Updated <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time>
                </span>
              ) : null}
              <span>{post.readingMinutes} min read</span>
            </div>
          </div>
        </div>
      </header>

      {post.cover ? (
        <figure className="container-page pt-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.cover.url}
            alt={post.cover.alt}
            width={post.cover.width}
            height={post.cover.height}
            fetchPriority="high"
            className={`h-auto w-full rounded-[var(--radius-card)] border border-line bg-surface-2 ${showToc ? 'lg:w-2/3' : 'mx-auto max-w-3xl'}`}
          />
        </figure>
      ) : null}

      <div className="container-page grid gap-12 py-12 lg:grid-cols-12 lg:py-16">
        {showToc ? (
          <aside className="lg:order-2 lg:col-span-3">
            <MobileToc items={toc} />
            <TableOfContents items={toc} className="sticky top-24 hidden lg:block" />
          </aside>
        ) : null}
        <div
          className={
            showToc
              ? 'min-w-0 lg:order-1 lg:col-span-8 lg:col-start-1'
              : 'mx-auto w-full max-w-3xl lg:col-span-12'
          }
        >
          <div className="prose-article" dangerouslySetInnerHTML={{ __html: rendered.html }} />

          {post.tags.length ? (
            <div className="mt-12 border-t border-line pt-6">
              <p className="eyebrow mb-3">Tags</p>
              <ul className="flex flex-wrap gap-1.5" aria-label="Tags">
                {post.tags.map((tag) => (
                  <li key={tag}>
                    <Chip tone="outline">{tag}</Chip>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-10 border-t border-line pt-6">
            <ShareActions url={url} title={post.title} />
          </div>

          <div className="mt-10">
            <Link
              href="/writing"
              className="inline-flex items-center gap-2 text-[0.95rem] font-medium text-ink"
              data-testid="back-to-writing"
            >
              <ArrowLeft size={16} aria-hidden="true" /> All writing
            </Link>
          </div>
        </div>
      </div>

      {related.length ? (
        <section aria-labelledby="related-title" className="border-t border-line bg-bg-elevated">
          <div className="container-page py-14">
            <h2 id="related-title" className="font-serif text-headline text-ink">
              Related reading
            </h2>
            <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <li key={item.id}>
                  <ArticleCard post={item} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </article>
  );
}
