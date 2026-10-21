'use client';

import { useEffect, useId, useRef, type ReactNode } from 'react';
import { buttonClasses } from '../ui/button';

/**
 * Accessible confirmation built on <dialog>.showModal(): focus moves into the dialog,
 * Escape cancels, and focus returns to the trigger when it closes.
 */
export function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel,
  tone = 'danger',
  pending = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  tone?: 'danger' | 'default';
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const bodyId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const opener = useRef<Element | null>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      opener.current = document.activeElement;
      dialog.showModal();
      cancelRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
      if (opener.current instanceof HTMLElement) opener.current.focus();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={bodyId}
      onCancel={(event) => {
        event.preventDefault();
        if (!pending) onCancel();
      }}
      className="m-auto w-[min(92vw,28rem)] rounded-2xl border border-line bg-bg-elevated p-0 text-ink shadow-[var(--shadow-pop)]"
    >
      <div className="p-6">
        <h2 id={titleId} className="font-serif text-3xl leading-tight">
          {title}
        </h2>
        <div id={bodyId} className="mt-3 text-[0.95rem] leading-relaxed text-ink-muted">
          {children}
        </div>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            disabled={pending}
            className={buttonClasses('secondary', 'md')}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className={buttonClasses(tone === 'danger' ? 'danger' : 'primary', 'md')}
          >
            {pending ? 'Working…' : confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
