'use client';

import { Check, Copy } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

/** Copy text to the clipboard, with a textarea fallback for browsers without the async API. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to the legacy path
  }
  try {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  } catch {
    return false;
  }
}

/**
 * Button that copies a value and announces the result in a polite live region.
 * If copying is impossible, it tells the visitor to copy the visible text manually.
 */
export function CopyButton({
  value,
  label,
  copiedLabel = 'Copied',
  className,
  iconOnly = false,
}: {
  value: string;
  label: string;
  copiedLabel?: string;
  className?: string;
  iconOnly?: boolean;
}) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onClick = async () => {
    const ok = await copyText(value);
    setState(ok ? 'copied' : 'failed');
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState('idle'), 2400);
  };

  const message =
    state === 'copied'
      ? copiedLabel
      : state === 'failed'
        ? 'Copy failed — please copy it manually'
        : '';

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        aria-label={iconOnly ? label : undefined}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full text-sm text-ink-muted transition-colors hover:text-ink',
          className,
        )}
      >
        {state === 'copied' ? (
          <Check size={15} aria-hidden="true" className="text-success" />
        ) : (
          <Copy size={15} aria-hidden="true" />
        )}
        {iconOnly ? null : <span>{state === 'copied' ? copiedLabel : label}</span>}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {message}
      </span>
    </>
  );
}
