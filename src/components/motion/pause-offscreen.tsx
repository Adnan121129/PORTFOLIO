'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Sets data-paused="true" on its wrapper while it is off screen, which pauses the
 * decorative CSS animations inside (see .animate-flow / .animate-pulse-dot).
 */
export function PauseOffscreen({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      element.dataset.paused = entry.isIntersecting ? 'false' : 'true';
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} data-paused="false">
      {children}
    </div>
  );
}
