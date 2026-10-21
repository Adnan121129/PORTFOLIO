'use client';

import { ArrowUp } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Floating "Back to top" control. It appears once the visitor has scrolled well past
 * the first screen (tracked with an IntersectionObserver on a sentinel, not scroll
 * events) and moves keyboard focus to the top of the page as well as scrolling.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const sentinel = document.getElementById('top-sentinel');
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), {
      rootMargin: '0px',
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [pathname]);

  const goTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    const target = document.getElementById('top');
    target?.focus({ preventScroll: true });
  };

  return (
    <button
      type="button"
      onClick={goTop}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={cn(
        'no-print fixed right-4 bottom-4 z-40 grid size-11 place-items-center rounded-full border border-line bg-bg-elevated/90 text-ink shadow-[var(--shadow-card)] backdrop-blur transition-all duration-300 hover:border-line-strong sm:right-6 sm:bottom-6',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0',
      )}
    >
      <ArrowUp size={18} strokeWidth={1.75} aria-hidden="true" />
    </button>
  );
}
