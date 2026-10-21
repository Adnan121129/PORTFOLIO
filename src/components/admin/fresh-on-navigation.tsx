'use client';

import { useRouter } from 'next/navigation';
import { Fragment, type ReactNode } from 'react';

/**
 * The router keeps recently visited pages alive (hidden) to restore them on back/forward.
 * For the editor that would mean "New article" reopening the previous draft's state, so the
 * subtree is remounted on every fresh navigation (Link click, push, replace) while browser
 * back/forward still restores it.
 */
export function FreshOnNavigation({ children }: { children: ReactNode }) {
  const { bfcacheId } = useRouter();
  return <Fragment key={bfcacheId}>{children}</Fragment>;
}
