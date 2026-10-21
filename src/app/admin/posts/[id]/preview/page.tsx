import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { AdminLoading } from '@/components/admin/admin-loading';
import { StatusBadge } from '@/components/admin/post-table';
import { Chip } from '@/components/ui/primitives';
import { categoryLabel } from '@/content/writing-categories';
import { requireAdmin } from '@/lib/auth/session';
import { renderMarkdown } from '@/lib/markdown/render';
import { getMediaDimensions } from '@/lib/media';
import { formatDate } from '@/lib/utils';
import { getPostById } from '@/lib/writing/posts';

export const metadata: Metadata = { title: 'Preview', robots: { index: false, follow: false } };

async function Preview({ params }: { params: PageProps<'/admin/posts/[id]/preview'>['params'] }) {
  const { id } = await params;
  await requireAdmin(`/admin/posts/${id}/preview`);
  const post = await getPostById(id);
  if (!post) notFound();
  const rendered = await renderMarkdown(post.body, { resolveImages: getMediaDimensions });

  return (
    <div>
      <div className="border-b border-warn/40 bg-warn-soft">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-3 text-sm text-ink">
          <p className="flex items-center gap-3">
            <StatusBadge status={post.status} isSample={post.isSample} />
            Preview of the saved version —{' '}
            {post.status === 'published' ? 'this article is live.' : 'not visible to visitors.'}
          </p>
          <a href={`/admin/posts/${post.id}`} className="link-inline">
            Back to editor
          </a>
        </div>
      </div>
      <article className="container-page py-12">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[0.72rem] tracking-[0.14em] text-accent uppercase">
            {categoryLabel(post.category)}
          </p>
          <h1 className="mt-4 font-serif text-[clamp(2.4rem,5.4vw,4.4rem)] leading-[1.02] tracking-tight text-ink">
            {post.title}
          </h1>
          {post.excerpt ? <p className="mt-6 text-lead text-ink-muted">{post.excerpt}</p> : null}
          <p className="mt-6 border-t border-line pt-4 text-sm text-ink-muted">
            {post.publishedAt ? `Published ${formatDate(post.publishedAt)} · ` : ''}
            {post.readingMinutes} min read
          </p>
          {post.cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.cover.url}
              alt={post.cover.alt}
              width={post.cover.width}
              height={post.cover.height}
              className="mt-8 h-auto w-full rounded-[var(--radius-card)] border border-line"
            />
          ) : null}
          <div
            className="prose-article mt-10"
            dangerouslySetInnerHTML={{ __html: rendered.html }}
          />
          {post.tags.length ? (
            <ul
              className="mt-10 flex flex-wrap gap-1.5 border-t border-line pt-6"
              aria-label="Tags"
            >
              {post.tags.map((tag) => (
                <li key={tag}>
                  <Chip tone="outline">{tag}</Chip>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </article>
    </div>
  );
}

export default function PreviewPage({ params }: PageProps<'/admin/posts/[id]/preview'>) {
  return (
    <Suspense fallback={<AdminLoading label="Loading preview…" />}>
      <Preview params={params} />
    </Suspense>
  );
}
