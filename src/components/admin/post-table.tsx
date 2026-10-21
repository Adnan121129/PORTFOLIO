'use client';

import { Eye, PencilLine, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import { removePost, removeSamplePosts, unpublishPost } from '@/app/admin/actions';
import { categoryLabel } from '@/content/writing-categories';
import { cn, formatDate } from '@/lib/utils';
import type { PostSummary } from '@/lib/writing/types';
import { ConfirmDialog } from './confirm-dialog';

type Filter = 'all' | 'published' | 'draft';

export function StatusBadge({
  status,
  isSample,
}: {
  status: PostSummary['status'];
  isSample?: boolean;
}) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
          status === 'published' ? 'bg-success-soft text-success' : 'bg-warn-soft text-warn',
        )}
      >
        <span
          aria-hidden="true"
          className={cn('size-1.5 rounded-full', status === 'published' ? 'bg-success' : 'bg-warn')}
        />
        {status === 'published' ? 'Published' : 'Draft'}
      </span>
      {isSample ? (
        <span className="rounded-full border border-dashed border-line-strong px-2 py-0.5 text-xs text-ink-muted">
          Sample
        </span>
      ) : null}
    </span>
  );
}

export function PostTable({ posts }: { posts: PostSummary[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>('all');
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null);
  const [toDelete, setToDelete] = useState<PostSummary | null>(null);
  const [confirmSamples, setConfirmSamples] = useState(false);

  const counts = useMemo(
    () => ({
      all: posts.length,
      published: posts.filter((post) => post.status === 'published').length,
      draft: posts.filter((post) => post.status === 'draft').length,
    }),
    [posts],
  );
  const visible = posts.filter((post) => filter === 'all' || post.status === filter);
  const samples = posts.filter((post) => post.isSample).length;

  const run = (action: () => Promise<{ ok: boolean; message: string }>, after?: () => void) => {
    startTransition(async () => {
      const result = await action();
      setMessage({ tone: result.ok ? 'ok' : 'error', text: result.message });
      after?.();
      router.refresh();
    });
  };

  return (
    <div>
      {samples ? (
        <div className="mb-8 flex flex-col gap-4 rounded-xl border border-dashed border-line-strong bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-ink">
              {samples} sample {samples === 1 ? 'article is' : 'articles are'} still on the site.
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              They were written from your project documentation as starter content. Review and edit
              them (saving removes the “Sample” badge) or remove them before launch.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setConfirmSamples(true)}
            className="inline-flex h-10 shrink-0 items-center rounded-full border border-line-strong px-4 text-sm font-medium text-ink hover:border-danger hover:text-danger"
          >
            Remove sample posts
          </button>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div role="group" aria-label="Filter articles by status" className="flex gap-1.5">
          {(['all', 'published', 'draft'] as const).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
              className={cn(
                'h-9 rounded-full border px-3.5 text-sm capitalize transition-colors',
                filter === value
                  ? 'border-ink bg-ink text-bg'
                  : 'border-line text-ink-muted hover:text-ink',
              )}
            >
              {value === 'draft' ? 'Drafts' : value}{' '}
              <span className="opacity-60">{counts[value]}</span>
            </button>
          ))}
        </div>
        <p
          role="status"
          aria-live="polite"
          className={cn('text-sm', message?.tone === 'error' ? 'text-danger' : 'text-success')}
        >
          {message?.text}
        </p>
      </div>

      {visible.length ? (
        <div className="mt-6 overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <caption className="sr-only">Articles</caption>
            <thead className="bg-surface-2 text-ink-muted">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">
                  Title
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Category
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Updated
                </th>
                <th scope="col" className="px-4 py-3 text-right font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-surface">
              {visible.map((post) => (
                <tr key={post.id} data-post-row={post.slug}>
                  <td className="max-w-[22rem] px-4 py-3.5">
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="font-medium text-ink hover:text-accent"
                    >
                      {post.title}
                    </Link>
                    <p className="mt-0.5 truncate font-mono text-xs text-ink-subtle">
                      /writing/{post.slug}
                    </p>
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={post.status} isSample={post.isSample} />
                  </td>
                  <td className="px-4 py-3.5 text-ink-muted">{categoryLabel(post.category)}</td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-ink-muted">
                    <time dateTime={post.updatedAt}>{formatDate(post.updatedAt, 'short')}</time>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/posts/${post.id}`}
                        className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-ink-muted hover:bg-surface-2 hover:text-ink"
                      >
                        <PencilLine size={15} aria-hidden="true" /> Edit
                        <span className="sr-only"> “{post.title}”</span>
                      </Link>
                      <Link
                        href={
                          post.status === 'published'
                            ? `/writing/${post.slug}`
                            : `/admin/posts/${post.id}/preview`
                        }
                        prefetch={false}
                        className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-ink-muted hover:bg-surface-2 hover:text-ink"
                      >
                        <Eye size={15} aria-hidden="true" />{' '}
                        {post.status === 'published' ? 'View' : 'Preview'}
                        <span className="sr-only"> “{post.title}”</span>
                      </Link>
                      {post.status === 'published' ? (
                        <button
                          type="button"
                          disabled={pending}
                          onClick={() => run(() => unpublishPost(post.id))}
                          className="inline-flex h-9 items-center rounded-full px-3 text-ink-muted hover:bg-surface-2 hover:text-ink"
                        >
                          Unpublish<span className="sr-only"> “{post.title}”</span>
                        </button>
                      ) : null}
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => setToDelete(post)}
                        className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-ink-muted hover:bg-danger-soft hover:text-danger"
                      >
                        <Trash2 size={15} aria-hidden="true" /> Delete
                        <span className="sr-only"> “{post.title}”</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-dashed border-line-strong bg-surface px-6 py-12 text-center">
          <p className="font-serif text-2xl text-ink">
            {posts.length ? 'Nothing in this view.' : 'No articles yet.'}
          </p>
          <p className="mt-2 text-sm text-ink-muted">
            {posts.length ? 'Try another filter.' : 'Create your first article to get started.'}
          </p>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete this article?"
        confirmLabel="Delete permanently"
        pending={pending}
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          const post = toDelete;
          if (!post) return;
          run(
            () => removePost(post.id),
            () => setToDelete(null),
          );
        }}
      >
        <p>
          “{toDelete?.title}” will be removed from the site and the database. This can’t be undone.
        </p>
      </ConfirmDialog>

      <ConfirmDialog
        open={confirmSamples}
        title="Remove all sample posts?"
        confirmLabel="Remove samples"
        pending={pending}
        onCancel={() => setConfirmSamples(false)}
        onConfirm={() =>
          run(
            () => removeSamplePosts(),
            () => setConfirmSamples(false),
          )
        }
      >
        <p>
          Articles still marked “Sample” will be deleted. Articles you have edited and saved are
          kept.
        </p>
      </ConfirmDialog>
    </div>
  );
}
