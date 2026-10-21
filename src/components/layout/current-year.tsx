'use client';

import { useSyncExternalStore } from 'react';

const noop = () => () => {};

/**
 * The current year, computed in the visitor's browser so a statically generated
 * footer never shows a stale year. The server renders a fallback (the build year);
 * after hydration the live value is used.
 */
export function CurrentYear({ fallback }: { fallback: number }) {
  const year = useSyncExternalStore(
    noop,
    () => new Date().getFullYear(),
    () => fallback,
  );
  return <span suppressHydrationWarning>{year}</span>;
}
