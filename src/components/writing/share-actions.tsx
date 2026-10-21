'use client';

import { Check, Link2, Mail, Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { LinkedInIcon, WhatsAppIcon } from '../icons/brand-icons';
import { copyText } from '../contact/copy-button';

/**
 * Real share controls: copy link (with a textarea fallback), the native share sheet when
 * the browser supports it, and plain links for LinkedIn, WhatsApp and email.
 */
export function ShareActions({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState<'idle' | 'copied' | 'failed'>('idle');
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    // Feature detection must run in the browser.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCanShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
  }, []);

  const onCopy = async () => {
    const ok = await copyText(url);
    setCopied(ok ? 'copied' : 'failed');
    window.setTimeout(() => setCopied('idle'), 2500);
  };

  const onShare = async () => {
    try {
      await navigator.share({ title, url });
    } catch {
      // The visitor closed the share sheet — nothing to do.
    }
  };

  const encodedUrl = encodeURIComponent(url);
  const linkClass =
    'inline-flex h-10 items-center gap-2 rounded-full border border-line bg-surface px-3.5 text-sm text-ink-muted transition-colors hover:border-line-strong hover:text-ink';

  return (
    <div>
      <p className="eyebrow mb-3" id="share-label">
        Share this article
      </p>
      <ul className="flex flex-wrap gap-2" aria-labelledby="share-label">
        <li>
          <button type="button" onClick={onCopy} className={linkClass} data-testid="copy-link">
            {copied === 'copied' ? (
              <Check size={15} aria-hidden="true" className="text-success" />
            ) : (
              <Link2 size={15} aria-hidden="true" />
            )}
            {copied === 'copied' ? 'Link copied' : 'Copy link'}
          </button>
        </li>
        {canShare ? (
          <li>
            <button type="button" onClick={onShare} className={linkClass}>
              <Share2 size={15} aria-hidden="true" />
              Share…
            </button>
          </li>
        ) : null}
        <li>
          <a
            className={linkClass}
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedInIcon size={14} />
            LinkedIn
            <span className="sr-only"> (share, opens in a new tab)</span>
          </a>
        </li>
        <li>
          <a
            className={linkClass}
            href={`https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon size={14} />
            WhatsApp
            <span className="sr-only"> (share, opens in a new tab)</span>
          </a>
        </li>
        <li>
          <a
            className={linkClass}
            href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodedUrl}`}
          >
            <Mail size={15} aria-hidden="true" />
            Email
          </a>
        </li>
      </ul>
      <p role="status" aria-live="polite" className="sr-only">
        {copied === 'copied'
          ? 'Link copied to clipboard'
          : copied === 'failed'
            ? 'Copy failed. The address is shown below.'
            : ''}
      </p>
      {copied === 'failed' ? (
        <p className="mt-3 text-sm break-all text-ink-muted">
          Copy this address: <span className="font-mono text-ink">{url}</span>
        </p>
      ) : null}
    </div>
  );
}
