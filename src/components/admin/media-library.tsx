'use client';

import { Check, Copy, Trash2, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useId, useState, useTransition } from 'react';
import { removeMedia, saveMediaAlt } from '@/app/admin/actions';
import { formatDate } from '@/lib/utils';
import type { MediaItem } from '@/lib/writing/types';
import { copyText } from '../contact/copy-button';
import { buttonClasses } from '../ui/button';
import { ConfirmDialog } from './confirm-dialog';
import { uploadImage } from './media-picker';

function formatBytes(bytes: number) {
  return bytes > 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.round(bytes / 1024)} KB`;
}

function MediaCard({ item, onDeleted }: { item: MediaItem; onDeleted: (message: string) => void }) {
  const altId = useId();
  const [alt, setAlt] = useState(item.alt);
  const [state, setState] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [confirm, setConfirm] = useState<{ usedBy: string[] } | null>(null);
  const [pending, startTransition] = useTransition();
  const markdown = `![${(alt || 'Describe this image').replace(/[[\]]/g, '')}](${item.url})`;

  const del = (force: boolean) =>
    startTransition(async () => {
      const result = await removeMedia(item.id, force);
      if (result.ok) {
        setConfirm(null);
        onDeleted(result.message);
      } else if (result.usedBy) {
        setConfirm({ usedBy: result.usedBy });
      } else {
        setState(result.message);
      }
    });

  return (
    <li className="surface-card overflow-hidden" data-media={item.id}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.url}
        alt=""
        loading="lazy"
        className="aspect-[4/3] w-full border-b border-line bg-surface-2 object-cover"
      />
      <div className="space-y-3 p-4">
        <p className="truncate font-mono text-xs text-ink-subtle">
          {item.width}×{item.height} · {formatBytes(item.bytes)} ·{' '}
          {formatDate(item.createdAt, 'short')}
        </p>
        <div>
          <label htmlFor={altId} className="text-xs font-medium text-ink-muted">
            Alt text
          </label>
          <div className="mt-1 flex gap-2">
            <input
              id={altId}
              value={alt}
              onChange={(event) => setAlt(event.target.value)}
              maxLength={240}
              className="h-9 min-w-0 flex-1 rounded-lg border border-line-control bg-bg px-2.5 text-sm outline-none focus:border-accent"
            />
            <button
              type="button"
              disabled={pending || alt === item.alt}
              onClick={() =>
                startTransition(async () => {
                  const result = await saveMediaAlt(item.id, alt);
                  setState(result.message);
                })
              }
              className={buttonClasses('secondary', 'sm')}
            >
              Save
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={async () => {
              setCopied(await copyText(markdown));
              window.setTimeout(() => setCopied(false), 2000);
            }}
            className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink"
          >
            {copied ? (
              <Check size={14} aria-hidden="true" className="text-success" />
            ) : (
              <Copy size={14} aria-hidden="true" />
            )}
            {copied ? 'Copied' : 'Copy Markdown'}
          </button>
          <button
            type="button"
            onClick={() => del(false)}
            disabled={pending}
            className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-danger"
          >
            <Trash2 size={14} aria-hidden="true" /> Delete
            <span className="sr-only"> image {item.filename}</span>
          </button>
        </div>
        <p role="status" aria-live="polite" className="min-h-5 text-xs text-ink-muted">
          {state}
        </p>
      </div>
      <ConfirmDialog
        open={Boolean(confirm)}
        title="This image is in use"
        confirmLabel="Delete anyway"
        pending={pending}
        onCancel={() => setConfirm(null)}
        onConfirm={() => del(true)}
      >
        <p>
          It appears in: {confirm?.usedBy.join(', ')}. Deleting it will leave a gap in those
          articles.
        </p>
      </ConfirmDialog>
    </li>
  );
}

export function MediaLibrary({ media }: { media: MediaItem[] }) {
  const router = useRouter();
  const fileId = useId();
  const altId = useId();
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null);

  const upload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      setMessage({ tone: 'error', text: 'Choose an image file first.' });
      return;
    }
    setBusy(true);
    const result = await uploadImage(file, alt);
    setBusy(false);
    if (result.ok) {
      setMessage({ tone: 'ok', text: `Uploaded ${result.media.filename}.` });
      setFile(null);
      setAlt('');
      (event.target as HTMLFormElement).reset();
      router.refresh();
    } else {
      setMessage({ tone: 'error', text: result.message });
    }
  };

  return (
    <div>
      <form
        onSubmit={upload}
        className="surface-card grid gap-4 p-5 md:grid-cols-[1fr_1fr_auto] md:items-end"
      >
        <div>
          <label htmlFor={fileId} className="text-sm font-medium text-ink">
            Image file
          </label>
          <input
            id={fileId}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="mt-1.5 block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-surface-2 file:px-3 file:py-2 file:text-sm file:text-ink"
          />
        </div>
        <div>
          <label htmlFor={altId} className="text-sm font-medium text-ink">
            Alt text
          </label>
          <input
            id={altId}
            value={alt}
            onChange={(event) => setAlt(event.target.value)}
            maxLength={240}
            className="mt-1.5 h-11 w-full rounded-xl border border-line-control bg-surface px-3.5 text-sm outline-none focus:border-accent"
            placeholder="Describe what the image shows"
          />
        </div>
        <button type="submit" disabled={busy} className={buttonClasses('primary', 'md')}>
          <Upload size={16} aria-hidden="true" /> {busy ? 'Uploading…' : 'Upload'}
        </button>
        <p className="text-xs text-ink-subtle md:col-span-3">
          JPEG, PNG, WebP, GIF or AVIF up to 4 MB. Images are checked, resized to at most 2000px
          wide, converted to WebP and stripped of metadata such as GPS location.
        </p>
      </form>
      <p
        role="status"
        aria-live="polite"
        className={`mt-4 min-h-6 text-sm ${message?.tone === 'error' ? 'text-danger' : 'text-success'}`}
      >
        {message?.text}
      </p>

      {media.length ? (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {media.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              onDeleted={(text) => {
                setMessage({ tone: 'ok', text });
                router.refresh();
              }}
            />
          ))}
        </ul>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-line-strong bg-surface px-6 py-12 text-center">
          <p className="font-serif text-2xl text-ink">No images yet.</p>
          <p className="mt-2 text-sm text-ink-muted">
            Upload an image to use it as a cover or inside an article.
          </p>
        </div>
      )}
    </div>
  );
}
