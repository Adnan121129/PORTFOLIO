'use client';

import { ImagePlus, Upload, X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import type { MediaItem } from '@/lib/writing/types';
import { cn } from '@/lib/utils';
import { buttonClasses } from '../ui/button';

export async function uploadImage(
  file: File,
  alt: string,
): Promise<{ ok: true; media: MediaItem } | { ok: false; message: string }> {
  const body = new FormData();
  body.set('file', file);
  body.set('alt', alt);
  try {
    const response = await fetch('/admin/api/media', { method: 'POST', body });
    const json = (await response.json().catch(() => null)) as {
      ok?: boolean;
      media?: MediaItem;
      message?: string;
    } | null;
    if (response.ok && json?.ok && json.media) return { ok: true, media: json.media };
    return { ok: false, message: json?.message ?? `Upload failed (${response.status}).` };
  } catch {
    return { ok: false, message: 'Upload failed — check your connection and try again.' };
  }
}

/**
 * Choose an image from the media library or upload a new one. Used both for the cover
 * image and for inserting images into the article body.
 */
export function MediaPicker({
  open,
  media,
  title,
  onClose,
  onSelect,
  onUploaded,
}: {
  open: boolean;
  media: MediaItem[];
  title: string;
  onClose: () => void;
  onSelect: (item: MediaItem) => void;
  onUploaded: (item: MediaItem) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const fileId = useId();
  const altId = useId();
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const upload = async () => {
    if (!file) {
      setError('Choose an image file first.');
      return;
    }
    setBusy(true);
    setError(null);
    const result = await uploadImage(file, alt);
    setBusy(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    onUploaded(result.media);
    setFile(null);
    setAlt('');
    onSelect(result.media);
  };

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="m-auto max-h-[90dvh] w-[min(94vw,52rem)] overflow-hidden rounded-2xl border border-line bg-bg-elevated p-0 text-ink shadow-[var(--shadow-pop)]"
    >
      <div className="flex max-h-[90dvh] flex-col">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-serif text-2xl">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-full hover:bg-surface-2"
            aria-label="Close"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="overflow-y-auto p-5">
          <section
            aria-labelledby={`${fileId}-heading`}
            className="rounded-xl border border-dashed border-line-strong bg-surface p-4"
          >
            <h3 id={`${fileId}-heading`} className="flex items-center gap-2 text-sm font-semibold">
              <Upload size={16} aria-hidden="true" /> Upload a new image
            </h3>
            <p className="mt-1 text-xs text-ink-muted">
              JPEG, PNG, WebP, GIF or AVIF, up to 4 MB. Images are resized to 2000px and metadata
              (including location) is removed.
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
              <div>
                <label htmlFor={fileId} className="text-xs font-medium text-ink-muted">
                  Image file
                </label>
                <input
                  id={fileId}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                  onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                  className="mt-1 block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-surface-2 file:px-3 file:py-2 file:text-sm file:text-ink"
                />
              </div>
              <div>
                <label htmlFor={altId} className="text-xs font-medium text-ink-muted">
                  Alt text (describe the image)
                </label>
                <input
                  id={altId}
                  value={alt}
                  onChange={(event) => setAlt(event.target.value)}
                  maxLength={240}
                  className="mt-1 h-10 w-full rounded-lg border border-line-control bg-bg px-3 text-sm outline-none focus:border-accent"
                />
              </div>
              <button
                type="button"
                onClick={upload}
                disabled={busy}
                className={buttonClasses('primary', 'sm')}
              >
                <ImagePlus size={15} aria-hidden="true" /> {busy ? 'Uploading…' : 'Upload & use'}
              </button>
            </div>
            <p role="status" aria-live="polite" className="mt-2 text-sm text-danger">
              {error}
            </p>
          </section>

          <h3 className="mt-6 text-sm font-semibold">Media library</h3>
          {media.length ? (
            <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {media.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(item)}
                    className={cn(
                      'group block w-full overflow-hidden rounded-xl border border-line bg-surface text-left hover:border-accent focus-visible:border-accent',
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.url}
                      alt=""
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover"
                    />
                    <span className="block truncate px-2.5 py-2 text-xs text-ink-muted">
                      {item.alt || item.filename}
                      <span className="sr-only"> — use this image</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-ink-muted">No images yet — upload one above.</p>
          )}
        </div>
      </div>
    </dialog>
  );
}
