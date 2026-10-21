'use client';

import { useEffect } from 'react';

/**
 * Next.js keeps up to three visited pages in the document (hidden with display: none) so
 * back/forward navigation restores them instantly. Two case studies can therefore both
 * contain id="features"; browsers jump to the first match, which may be on a hidden page.
 * This sends same-page links (tables of contents, heading anchors) to the visible element.
 */
export function HashLinkHandler() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const link = (event.target as Element | null)?.closest?.('a[href^="#"]');
      if (!(link instanceof HTMLAnchorElement) || !link.hash) return;
      const id = decodeURIComponent(link.hash.slice(1));
      const matches = Array.from(
        document.querySelectorAll<HTMLElement>(`[id="${CSS.escape(id)}"]`),
      );
      const target = matches.find((element) => element.getClientRects().length > 0);
      // A single match, or a visible first match, is already handled correctly by the browser.
      if (!target || target === matches[0]) return;
      event.preventDefault();
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      window.history.pushState(null, '', `#${encodeURIComponent(id)}`);
      if (target.hasAttribute('tabindex')) target.focus({ preventScroll: true });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return null;
}
