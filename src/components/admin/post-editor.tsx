'use client';

import {
  Bold,
  Code,
  Eye,
  FileCode,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  MessageSquareQuote,
  Table,
  Trash2,
  TriangleAlert,
  type LucideIcon,
} from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useId, useMemo, useRef, useState, useTransition } from 'react';
import {
  publishPost,
  removePost,
  renderPreview,
  savePost,
  unpublishPost,
  type SaveResult,
} from '@/app/admin/actions';
import { writingCategories } from '@/content/writing-categories';
import type { RenderedMarkdown } from '@/lib/markdown/render';
import { cn, countWords, formatDate, readingMinutes, slugify } from '@/lib/utils';
import { parseTagList } from '@/lib/writing/schema';
import type { FieldIssue, MediaItem, Post, PostInput } from '@/lib/writing/types';
import { buttonClasses } from '../ui/button';
import { ConfirmDialog } from './confirm-dialog';
import { MediaPicker } from './media-picker';
import { StatusBadge } from './post-table';

type MarkdownTool = { label: string; icon: LucideIcon } & (
  | { kind: 'wrap'; before: string; after?: string; placeholder?: string }
  | { kind: 'prefix'; prefix: string; numbered?: boolean }
  | { kind: 'insert'; snippet: string }
  | { kind: 'image' }
);

/** Formatting toolbar: each tool edits the Markdown source around the current selection. */
const markdownTools: MarkdownTool[] = [
  { label: 'Heading 2', icon: Heading2, kind: 'prefix', prefix: '## ' },
  { label: 'Heading 3', icon: Heading3, kind: 'prefix', prefix: '### ' },
  { label: 'Bold', icon: Bold, kind: 'wrap', before: '**' },
  { label: 'Italic', icon: Italic, kind: 'wrap', before: '_' },
  {
    label: 'Link',
    icon: Link2,
    kind: 'wrap',
    before: '[',
    after: '](https://)',
    placeholder: 'link text',
  },
  { label: 'Inline code', icon: Code, kind: 'wrap', before: '`', after: '`', placeholder: 'code' },
  {
    label: 'Code block',
    icon: FileCode,
    kind: 'wrap',
    before: '```sql\n',
    after: '\n```',
    placeholder: '-- code',
  },
  { label: 'Quote', icon: MessageSquareQuote, kind: 'prefix', prefix: '> ' },
  { label: 'Bulleted list', icon: List, kind: 'prefix', prefix: '- ' },
  { label: 'Numbered list', icon: ListOrdered, kind: 'prefix', prefix: '', numbered: true },
  {
    label: 'Table',
    icon: Table,
    kind: 'insert',
    snippet: '| Column | Column |\n| --- | --- |\n| Value | Value |\n',
  },
  {
    label: 'Callout',
    icon: TriangleAlert,
    kind: 'insert',
    snippet: '> [!NOTE]\n> Something worth highlighting.\n',
  },
  { label: 'Image', icon: ImageIcon, kind: 'image' },
];

type Values = Omit<PostInput, 'tags'> & { tagsText: string };

const EMPTY: Values = {
  title: '',
  slug: '',
  excerpt: '',
  body: '',
  category: 'software-engineering',
  tagsText: '',
  seoTitle: '',
  seoDescription: '',
  coverImageId: null,
  coverAlt: '',
  featured: false,
};

function toValues(post: Post | null): Values {
  if (!post) return EMPTY;
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    body: post.body,
    category: post.category,
    tagsText: post.tags.join(', '),
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    coverImageId: post.coverImageId,
    coverAlt: post.coverAlt,
    featured: post.featured,
  };
}

function toPayload(values: Values): PostInput {
  const { tagsText, ...rest } = values;
  return { ...rest, tags: parseTagList(tagsText) };
}

const fieldLabels: Partial<Record<FieldIssue['field'], string>> = {
  title: 'Title',
  slug: 'URL slug',
  excerpt: 'Excerpt',
  body: 'Article body',
  category: 'Category',
  tags: 'Tags',
  seoTitle: 'Search title',
  seoDescription: 'Search description',
  coverImageId: 'Cover image',
  coverAlt: 'Cover alt text',
};

const inputClass =
  'mt-1.5 w-full rounded-xl border bg-surface px-3.5 text-[0.95rem] text-ink outline-none transition-colors focus:border-accent focus-visible:ring-2 focus-visible:ring-accent/25';

export function PostEditor({
  initial,
  media: initialMedia,
  notice,
}: {
  initial: Post | null;
  media: MediaItem[];
  /** One-time confirmation carried over from the "new article" page after the first save. */
  notice?: string;
}) {
  const router = useRouter();
  const id = useId();
  const [post, setPost] = useState<Post | null>(initial);
  const [values, setValues] = useState<Values>(() => toValues(initial));
  const [snapshot, setSnapshot] = useState(() => JSON.stringify(toPayload(toValues(initial))));
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [issues, setIssues] = useState<FieldIssue[]>([]);
  const [status, setStatus] = useState<{ tone: 'ok' | 'error'; text: string } | null>(
    notice ? { tone: 'ok', text: notice } : null,
  );
  const [pending, startTransition] = useTransition();
  const [tab, setTab] = useState<'write' | 'preview'>('write');
  const [preview, setPreview] = useState<RenderedMarkdown | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [media, setMedia] = useState(initialMedia);
  const [picker, setPicker] = useState<'cover' | 'insert' | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  const payload = useMemo(() => toPayload(values), [values]);
  const dirty = JSON.stringify(payload) !== snapshot;
  const words = countWords(values.body);
  const issueFor = (field: FieldIssue['field']) =>
    issues.find((issue) => issue.field === field)?.message;
  const cover = media.find((item) => item.id === values.coverImageId) ?? null;

  const set = <K extends keyof Values>(key: K, value: Values[K]) =>
    setValues((current) => ({ ...current, [key]: value }));

  useEffect(() => {
    if (notice && window.location.search)
      window.history.replaceState(null, '', window.location.pathname);
  }, [notice]);

  /* ---------------------------------------------------- unsaved-changes guard */
  useEffect(() => {
    document.documentElement.dataset.unsaved = dirty ? 'true' : 'false';
    if (!dirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const anchor = (event.target as Element | null)?.closest?.('a[href]');
      if (
        !(anchor instanceof HTMLAnchorElement) ||
        anchor.target === '_blank' ||
        anchor.hasAttribute('download')
      )
        return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return; // beforeunload covers full page loads
      if (url.pathname === window.location.pathname && url.hash) return;
      if (!window.confirm('You have unsaved changes. Leave this page without saving them?')) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    document.addEventListener('click', onClick, true);
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
      document.removeEventListener('click', onClick, true);
    };
  }, [dirty]);

  useEffect(() => () => void (document.documentElement.dataset.unsaved = 'false'), []);

  /* ------------------------------------------------------------- server calls */
  const applyResult = useCallback(
    (result: SaveResult, sentPayload: PostInput) => {
      if (result.ok) {
        const wasNew = !post;
        setPost(result.post);
        setIssues([]);
        setSnapshot(JSON.stringify(sentPayload));
        setStatus({ tone: 'ok', text: result.message });
        if (wasNew) {
          // The article now has its own URL; the confirmation travels with the redirect.
          document.documentElement.dataset.unsaved = 'false';
          router.replace(`/admin/posts/${result.post.id}?created=${result.post.status}` as Route);
        } else {
          router.refresh();
        }
      } else {
        setIssues(result.issues);
        setStatus({ tone: 'error', text: result.message });
        requestAnimationFrame(() => summaryRef.current?.focus());
      }
    },
    [post, router],
  );

  const save = useCallback(() => {
    const sent = payload;
    startTransition(async () => applyResult(await savePost(post?.id ?? null, sent), sent));
  }, [applyResult, payload, post]);

  const publish = () => {
    const sent = payload;
    startTransition(async () => applyResult(await publishPost(post?.id ?? null, sent), sent));
  };

  const unpublish = () => {
    if (!post) return;
    startTransition(async () => {
      const result = await unpublishPost(post.id);
      if (result.ok) {
        setPost(result.post);
        setStatus({ tone: 'ok', text: result.message });
        router.refresh();
      } else setStatus({ tone: 'error', text: result.message });
    });
  };

  const destroy = () => {
    if (!post) return;
    startTransition(async () => {
      const result = await removePost(post.id);
      setConfirmDelete(false);
      if (result.ok) {
        document.documentElement.dataset.unsaved = 'false';
        setSnapshot(JSON.stringify(payload));
        router.push('/admin');
        router.refresh();
      } else setStatus({ tone: 'error', text: result.message });
    });
  };

  // Ctrl/Cmd + S saves.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        if (!pending) save();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pending, save]);

  // Server-rendered preview (identical pipeline to the public article page).
  useEffect(() => {
    if (tab !== 'preview') return;
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      try {
        const rendered = await renderPreview(values.body);
        if (!cancelled) {
          setPreview(rendered);
          setPreviewError(null);
        }
      } catch {
        if (!cancelled)
          setPreviewError('The preview could not be rendered. Your text is unchanged.');
      }
    }, 250);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [tab, values.body]);

  /* ------------------------------------------------------------ markdown tools */
  const editBody = (
    transform: (
      text: string,
      start: number,
      end: number,
    ) => { text: string; start: number; end: number },
  ) => {
    const area = bodyRef.current;
    if (!area) return;
    const { text, start, end } = transform(area.value, area.selectionStart, area.selectionEnd);
    set('body', text);
    requestAnimationFrame(() => {
      area.focus();
      area.setSelectionRange(start, end);
    });
  };

  const wrap = (before: string, after = before, placeholder = 'text') =>
    editBody((text, start, end) => {
      const selected = text.slice(start, end) || placeholder;
      const next = text.slice(0, start) + before + selected + after + text.slice(end);
      return {
        text: next,
        start: start + before.length,
        end: start + before.length + selected.length,
      };
    });

  const prefixLines = (prefix: (index: number) => string) =>
    editBody((text, start, end) => {
      const lineStart = text.lastIndexOf('\n', start - 1) + 1;
      const block = text.slice(lineStart, end) || 'Item';
      const lines = block.split('\n').map((line, index) => prefix(index) + line);
      const replaced = lines.join('\n');
      return {
        text: text.slice(0, lineStart) + replaced + text.slice(end || lineStart),
        start: lineStart,
        end: lineStart + replaced.length,
      };
    });

  const insert = (snippet: string) =>
    editBody((text, start, end) => {
      const needsBreak = start > 0 && text[start - 1] !== '\n' ? '\n\n' : '';
      const next = text.slice(0, start) + needsBreak + snippet + text.slice(end);
      const caret = start + needsBreak.length + snippet.length;
      return { text: next, start: caret, end: caret };
    });

  const applyTool = (tool: MarkdownTool) => {
    switch (tool.kind) {
      case 'wrap':
        return wrap(tool.before, tool.after, tool.placeholder);
      case 'prefix':
        return prefixLines(tool.numbered ? (index) => `${index + 1}. ` : () => tool.prefix);
      case 'insert':
        return insert(tool.snippet);
      case 'image':
        return setPicker('insert');
    }
  };

  const isPublished = post?.status === 'published';
  const errorCount = issues.length;
  const describedBy = (field: FieldIssue['field'], hint?: string) =>
    [issueFor(field) ? `${id}-${field}-error` : null, hint].filter(Boolean).join(' ') || undefined;

  const fieldError = (field: FieldIssue['field']) =>
    issueFor(field) ? (
      <p id={`${id}-${field}-error`} className="mt-1.5 text-sm text-danger">
        {issueFor(field)}
      </p>
    ) : null;

  const counter = (value: string, max: number) => (
    <span
      className={cn('text-xs tabular-nums', value.length > max ? 'text-danger' : 'text-ink-subtle')}
    >
      {value.length}/{max}
    </span>
  );

  return (
    <div className="container-page py-8 md:py-12" data-testid="post-editor">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin" className="text-sm text-ink-muted hover:text-ink">
            ← All articles
          </Link>
          <h1 className="mt-2 font-serif text-[clamp(2rem,3.4vw,2.8rem)] leading-none text-ink">
            {post ? 'Edit article' : 'New article'}
          </h1>
        </div>
        <div className="flex items-center gap-3 text-sm">
          {post ? (
            <StatusBadge status={post.status} isSample={post.isSample} />
          ) : (
            <StatusBadge status="draft" />
          )}
          <span className={cn('text-ink-muted', dirty && 'text-warn')} data-testid="save-state">
            {pending
              ? 'Saving…'
              : dirty
                ? 'Unsaved changes'
                : post
                  ? `Saved ${formatDate(post.updatedAt, 'short')}`
                  : 'Not saved yet'}
          </span>
        </div>
      </div>

      <div
        role="status"
        aria-live="polite"
        className="mt-4 min-h-6 text-sm"
        data-testid="editor-status"
      >
        {status ? (
          <p className={status.tone === 'ok' ? 'text-success' : 'text-danger'}>{status.text}</p>
        ) : null}
      </div>

      {errorCount ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="mt-2 rounded-xl border border-danger/40 bg-danger-soft p-4 text-sm focus:outline-none"
        >
          <p className="font-semibold text-ink">
            {errorCount === 1
              ? 'One thing needs attention:'
              : `${errorCount} things need attention:`}
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-ink">
            {issues.map((issue) => (
              <li key={`${issue.field}-${issue.message}`}>
                {issue.field !== 'form' ? (
                  <a href={`#${id}-${issue.field}`} className="underline">
                    {fieldLabels[issue.field] ?? issue.field}
                  </a>
                ) : null}
                {issue.field !== 'form' ? ': ' : ''}
                {issue.message}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-6 grid gap-8 lg:grid-cols-12">
        {/* ---------------------------------------------------------- main column */}
        <div className="min-w-0 space-y-6 lg:col-span-8">
          <div>
            <label htmlFor={`${id}-title`} className="text-sm font-medium text-ink">
              Title
            </label>
            <input
              id={`${id}-title`}
              value={values.title}
              onChange={(event) => {
                const title = event.target.value;
                setValues((current) => ({
                  ...current,
                  title,
                  slug: slugTouched ? current.slug : slugify(title),
                }));
              }}
              maxLength={140}
              aria-invalid={issueFor('title') ? true : undefined}
              aria-describedby={describedBy('title')}
              className={cn(
                inputClass,
                'h-14 font-serif text-2xl',
                issueFor('title') ? 'border-danger' : 'border-line-control',
              )}
              placeholder="A clear, specific headline"
            />
            {fieldError('title')}
          </div>

          <div>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div
                role="tablist"
                aria-label="Editor mode"
                className="inline-flex rounded-full border border-line bg-surface p-1"
              >
                {(['write', 'preview'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    role="tab"
                    id={`${id}-tab-${mode}`}
                    aria-selected={tab === mode}
                    aria-controls={`${id}-panel-${mode}`}
                    onClick={() => setTab(mode)}
                    className={cn(
                      'inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 text-sm capitalize',
                      tab === mode ? 'bg-ink text-bg' : 'text-ink-muted hover:text-ink',
                    )}
                  >
                    {mode === 'preview' ? <Eye size={14} aria-hidden="true" /> : null}
                    {mode}
                  </button>
                ))}
              </div>
              <p className="text-xs text-ink-subtle">
                {words} words · {readingMinutes(values.body)} min read · Markdown supported
              </p>
            </div>

            <div
              id={`${id}-panel-write`}
              role="tabpanel"
              aria-labelledby={`${id}-tab-write`}
              hidden={tab !== 'write'}
              className="mt-3"
            >
              <div
                role="toolbar"
                aria-label="Formatting"
                aria-controls={`${id}-body`}
                className="flex flex-wrap gap-1 rounded-t-xl border border-b-0 border-line bg-surface-2 p-1.5"
              >
                {markdownTools.map((tool) => (
                  <button
                    key={tool.label}
                    type="button"
                    onClick={() => applyTool(tool)}
                    title={tool.label}
                    aria-label={tool.label}
                    className="grid size-8 place-items-center rounded-lg text-ink-muted hover:bg-surface hover:text-ink"
                  >
                    <tool.icon size={16} aria-hidden="true" />
                  </button>
                ))}
              </div>
              <label htmlFor={`${id}-body`} className="sr-only">
                Article body (Markdown)
              </label>
              <textarea
                ref={bodyRef}
                id={`${id}-body`}
                value={values.body}
                onChange={(event) => set('body', event.target.value)}
                rows={24}
                spellCheck
                aria-invalid={issueFor('body') ? true : undefined}
                aria-describedby={describedBy('body', `${id}-body-hint`)}
                className={cn(
                  'block w-full rounded-b-xl border bg-surface px-4 py-3.5 font-mono text-[0.88rem] leading-relaxed text-ink outline-none focus:border-accent',
                  issueFor('body') ? 'border-danger' : 'border-line-control',
                )}
                placeholder={
                  'Write in Markdown.\n\n## A section heading\n\nParagraphs, **bold**, _italic_, [links](https://example.com), lists, tables,\n```code blocks```, > [!NOTE] callouts and images from the media library.'
                }
              />
              <p id={`${id}-body-hint`} className="mt-1.5 text-xs text-ink-subtle">
                Raw HTML is ignored for safety. Use the image button to insert pictures from the
                media library. Ctrl/⌘ + S saves.
              </p>
              {fieldError('body')}
            </div>

            <div
              id={`${id}-panel-preview`}
              role="tabpanel"
              aria-labelledby={`${id}-tab-preview`}
              hidden={tab !== 'preview'}
              className="mt-3"
            >
              <div
                className="rounded-xl border border-line bg-bg p-5 sm:p-8"
                data-testid="editor-preview"
              >
                <p className="eyebrow">
                  Preview · {post?.status === 'published' ? 'live article' : 'not published'}
                </p>
                <h2 className="mt-3 font-serif text-[2.4rem] leading-tight text-ink">
                  {values.title || 'Untitled article'}
                </h2>
                {values.excerpt ? (
                  <p className="mt-3 text-lead text-ink-muted">{values.excerpt}</p>
                ) : null}
                <hr className="my-6" />
                {previewError ? <p className="text-sm text-danger">{previewError}</p> : null}
                {preview ? (
                  <div
                    className="prose-article"
                    dangerouslySetInnerHTML={{ __html: preview.html }}
                  />
                ) : (
                  <p className="text-sm text-ink-muted">Rendering preview…</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- sidebar */}
        <aside className="space-y-5 lg:col-span-4" aria-label="Article settings">
          <section className="surface-card p-5">
            <h2 className="eyebrow text-ink">Publish</h2>
            {post?.publishedAt ? (
              <p className="mt-2 text-sm text-ink-muted">
                First published {formatDate(post.publishedAt)}
              </p>
            ) : (
              <p className="mt-2 text-sm text-ink-muted">
                Drafts are never shown on the public site, sitemap or feed.
              </p>
            )}
            <div className="mt-4 grid gap-2">
              <button
                type="button"
                onClick={save}
                disabled={pending}
                className={buttonClasses('secondary', 'md', 'w-full')}
                data-testid="save-button"
              >
                {isPublished ? 'Save changes' : 'Save draft'}
              </button>
              {isPublished ? (
                <button
                  type="button"
                  onClick={unpublish}
                  disabled={pending}
                  className={buttonClasses('ghost', 'md', 'w-full border border-line')}
                  data-testid="unpublish-button"
                >
                  Unpublish
                </button>
              ) : (
                <button
                  type="button"
                  onClick={publish}
                  disabled={pending}
                  className={buttonClasses('primary', 'md', 'w-full')}
                  data-testid="publish-button"
                >
                  Publish
                </button>
              )}
            </div>
            {post ? (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4 text-sm">
                {isPublished ? (
                  // No prefetch: the article may be unpublished while this page is open.
                  <Link
                    href={`/writing/${post.slug}`}
                    target="_blank"
                    prefetch={false}
                    className="link-inline"
                  >
                    View live article<span className="sr-only"> (opens in a new tab)</span>
                  </Link>
                ) : (
                  <Link
                    href={`/admin/posts/${post.id}/preview`}
                    target="_blank"
                    prefetch={false}
                    className="link-inline"
                  >
                    Full-page preview{dirty ? ' (saved version)' : ''}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  disabled={pending}
                  className="inline-flex items-center gap-1.5 text-ink-muted hover:text-danger"
                >
                  <Trash2 size={14} aria-hidden="true" /> Delete
                </button>
              </div>
            ) : null}
          </section>

          <section className="surface-card space-y-4 p-5">
            <h2 className="eyebrow text-ink">Details</h2>
            <div>
              <label htmlFor={`${id}-slug`} className="text-sm font-medium text-ink">
                URL slug
              </label>
              <div className="mt-1.5 flex items-center rounded-xl border border-line-control bg-surface focus-within:border-accent">
                <span className="pl-3.5 font-mono text-xs text-ink-subtle">/writing/</span>
                <input
                  id={`${id}-slug`}
                  value={values.slug}
                  onChange={(event) => {
                    setSlugTouched(true);
                    set('slug', event.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }}
                  maxLength={80}
                  aria-invalid={issueFor('slug') ? true : undefined}
                  aria-describedby={describedBy('slug', `${id}-slug-hint`)}
                  className="h-11 w-full min-w-0 bg-transparent pr-3 pl-1 font-mono text-sm text-ink outline-none"
                />
              </div>
              <p id={`${id}-slug-hint`} className="mt-1.5 text-xs text-ink-subtle">
                {isPublished
                  ? 'Changing it keeps the old URL working with a redirect.'
                  : 'Generated from the title until you edit it.'}
              </p>
              {fieldError('slug')}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor={`${id}-excerpt`} className="text-sm font-medium text-ink">
                  Excerpt
                </label>
                {counter(values.excerpt, 320)}
              </div>
              <textarea
                id={`${id}-excerpt`}
                value={values.excerpt}
                onChange={(event) => set('excerpt', event.target.value)}
                rows={4}
                aria-invalid={issueFor('excerpt') ? true : undefined}
                aria-describedby={describedBy('excerpt')}
                className={cn(
                  inputClass,
                  'py-2.5 text-sm',
                  issueFor('excerpt') ? 'border-danger' : 'border-line-control',
                )}
              />
              {fieldError('excerpt')}
            </div>

            <div>
              <label htmlFor={`${id}-category`} className="text-sm font-medium text-ink">
                Category
              </label>
              <select
                id={`${id}-category`}
                value={values.category}
                onChange={(event) => set('category', event.target.value)}
                aria-invalid={issueFor('category') ? true : undefined}
                aria-describedby={describedBy('category')}
                className={cn(
                  inputClass,
                  'h-11',
                  issueFor('category') ? 'border-danger' : 'border-line-control',
                )}
              >
                {writingCategories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.label}
                  </option>
                ))}
              </select>
              {fieldError('category')}
            </div>

            <div>
              <label htmlFor={`${id}-tags`} className="text-sm font-medium text-ink">
                Tags
              </label>
              <input
                id={`${id}-tags`}
                value={values.tagsText}
                onChange={(event) => set('tagsText', event.target.value)}
                aria-invalid={issueFor('tags') ? true : undefined}
                aria-describedby={describedBy('tags', `${id}-tags-hint`)}
                className={cn(
                  inputClass,
                  'h-11 text-sm',
                  issueFor('tags') ? 'border-danger' : 'border-line-control',
                )}
                placeholder="Power BI, SQL, Data quality"
              />
              <p id={`${id}-tags-hint`} className="mt-1.5 text-xs text-ink-subtle">
                Comma-separated, up to 8.
              </p>
              {fieldError('tags')}
            </div>

            <label className="flex items-start gap-3 text-sm text-ink">
              <input
                type="checkbox"
                checked={values.featured}
                onChange={(event) => set('featured', event.target.checked)}
                className="mt-0.5 size-4 accent-[var(--accent)]"
              />
              <span>
                Feature this article
                <span className="block text-xs text-ink-subtle">
                  Shown first on the Writing page.
                </span>
              </span>
            </label>
          </section>

          <section className="surface-card space-y-3 p-5">
            <h2 className="eyebrow text-ink" id={`${id}-coverImageId`}>
              Cover image
            </h2>
            {cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cover.url}
                alt=""
                className="aspect-[16/9] w-full rounded-lg border border-line object-cover"
              />
            ) : (
              <p className="text-sm text-ink-muted">
                Optional. Used on cards, at the top of the article and in social previews when set.
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setPicker('cover')}
                className={buttonClasses('secondary', 'sm')}
              >
                {cover ? 'Change image' : 'Choose image'}
              </button>
              {cover ? (
                <button
                  type="button"
                  onClick={() =>
                    setValues((current) => ({ ...current, coverImageId: null, coverAlt: '' }))
                  }
                  className={buttonClasses('ghost', 'sm')}
                >
                  Remove
                </button>
              ) : null}
            </div>
            {fieldError('coverImageId')}
            {cover ? (
              <div>
                <label htmlFor={`${id}-coverAlt`} className="text-sm font-medium text-ink">
                  Alt text
                </label>
                <input
                  id={`${id}-coverAlt`}
                  value={values.coverAlt}
                  onChange={(event) => set('coverAlt', event.target.value)}
                  maxLength={240}
                  aria-invalid={issueFor('coverAlt') ? true : undefined}
                  aria-describedby={describedBy('coverAlt')}
                  className={cn(
                    inputClass,
                    'h-11 text-sm',
                    issueFor('coverAlt') ? 'border-danger' : 'border-line-control',
                  )}
                  placeholder="Describe what the image shows"
                />
                {fieldError('coverAlt')}
              </div>
            ) : null}
          </section>

          <section className="surface-card space-y-4 p-5">
            <h2 className="eyebrow text-ink">Search & social</h2>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor={`${id}-seoTitle`} className="text-sm font-medium text-ink">
                  Search title <span className="font-normal text-ink-subtle">(optional)</span>
                </label>
                {counter(values.seoTitle, 70)}
              </div>
              <input
                id={`${id}-seoTitle`}
                value={values.seoTitle}
                onChange={(event) => set('seoTitle', event.target.value)}
                aria-invalid={issueFor('seoTitle') ? true : undefined}
                aria-describedby={describedBy('seoTitle')}
                className={cn(
                  inputClass,
                  'h-11 text-sm',
                  issueFor('seoTitle') ? 'border-danger' : 'border-line-control',
                )}
                placeholder={values.title || 'Defaults to the title'}
              />
              {fieldError('seoTitle')}
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor={`${id}-seoDescription`} className="text-sm font-medium text-ink">
                  Search description <span className="font-normal text-ink-subtle">(optional)</span>
                </label>
                {counter(values.seoDescription, 170)}
              </div>
              <textarea
                id={`${id}-seoDescription`}
                value={values.seoDescription}
                onChange={(event) => set('seoDescription', event.target.value)}
                rows={3}
                aria-invalid={issueFor('seoDescription') ? true : undefined}
                aria-describedby={describedBy('seoDescription')}
                className={cn(
                  inputClass,
                  'py-2.5 text-sm',
                  issueFor('seoDescription') ? 'border-danger' : 'border-line-control',
                )}
                placeholder="Defaults to the excerpt"
              />
              {fieldError('seoDescription')}
            </div>
          </section>
        </aside>
      </div>

      <MediaPicker
        open={picker !== null}
        media={media}
        title={picker === 'cover' ? 'Choose a cover image' : 'Insert an image'}
        onClose={() => setPicker(null)}
        onUploaded={(item) =>
          setMedia((current) => [item, ...current.filter((existing) => existing.id !== item.id)])
        }
        onSelect={(item) => {
          if (picker === 'cover') {
            setValues((current) => ({
              ...current,
              coverImageId: item.id,
              coverAlt: current.coverAlt || item.alt,
            }));
          } else {
            const alt = (item.alt || 'Describe this image').replace(/[[\]]/g, '');
            insert(`![${alt}](${item.url} "Optional caption")\n`);
          }
          setPicker(null);
        }}
      />

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this article?"
        confirmLabel="Delete permanently"
        pending={pending}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={destroy}
      >
        <p>
          “{values.title || 'Untitled'}” will be removed from the site and the database. This can’t
          be undone.
        </p>
      </ConfirmDialog>
    </div>
  );
}
