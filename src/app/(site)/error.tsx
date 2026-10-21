'use client';

import { RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

/** Route-level error boundary for public pages. */
export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="container-page py-24 md:py-32" role="alert">
      <p className="eyebrow text-danger">Something went wrong</p>
      <h1 className="mt-5 max-w-[16ch] font-serif text-display text-ink">
        This page couldn’t load.
      </h1>
      <p className="mt-6 max-w-xl text-lead text-ink-muted">
        It may be a temporary problem with the connection or the server. Try again, or head back to
        the home page.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-bg hover:bg-accent-strong"
        >
          <RotateCcw size={16} aria-hidden="true" /> Try again
        </button>
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-full border border-line-strong px-5 text-sm font-medium text-ink"
        >
          Go to the home page
        </Link>
      </div>
      {error.digest ? (
        <p className="mt-8 font-mono text-xs text-ink-subtle">Reference: {error.digest}</p>
      ) : null}
    </section>
  );
}
