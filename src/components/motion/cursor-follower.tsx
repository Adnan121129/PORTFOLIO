'use client';

import { useEffect, useRef } from 'react';

const INTERACTIVE =
  'a[href], button:not(:disabled), [role="button"], summary, label[for], [data-cursor="hover"]';
const TEXT_ENTRY = 'input, textarea, select, [contenteditable="true"], [data-cursor="none"]';
const MAGNET_RANGE = 6; // px — restrained on purpose

/**
 * A subtle ring that trails the native cursor on desktop. The native cursor is never
 * hidden; the ring is pointer-events:none and aria-hidden. It only runs for fine
 * pointers that can hover, never for touch, and never when reduced motion is requested.
 * The animation loop only runs while the ring is catching up, then stops.
 */
export function CursorFollower() {
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || reduce.matches) return;

    let targetX = -100;
    let targetY = -100;
    let x = targetX;
    let y = targetY;
    let frame = 0;
    let magnet: HTMLElement | null = null;

    const render = () => {
      x += (targetX - x) * 0.22;
      y += (targetY - y) * 0.22;
      ring.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (Math.abs(targetX - x) > 0.1 || Math.abs(targetY - y) > 0.1) {
        frame = requestAnimationFrame(render);
      } else {
        frame = 0;
      }
    };

    const releaseMagnet = () => {
      if (magnet) {
        magnet.style.removeProperty('--mx');
        magnet.style.removeProperty('--my');
        magnet = null;
      }
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') {
        ring.dataset.visible = 'false';
        return;
      }
      targetX = event.clientX;
      targetY = event.clientY;
      const target = event.target instanceof Element ? event.target : null;
      const overText = Boolean(target?.closest(TEXT_ENTRY));
      ring.dataset.visible = overText ? 'false' : 'true';
      ring.dataset.hover = target?.closest(INTERACTIVE) ? 'true' : 'false';

      const magnetic = target?.closest<HTMLElement>('[data-magnetic]') ?? null;
      if (magnetic !== magnet) releaseMagnet();
      if (magnetic) {
        magnet = magnetic;
        const rect = magnetic.getBoundingClientRect();
        const dx =
          ((event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)) * MAGNET_RANGE;
        const dy =
          ((event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)) * MAGNET_RANGE;
        magnetic.style.setProperty('--mx', `${dx.toFixed(2)}px`);
        magnetic.style.setProperty('--my', `${dy.toFixed(2)}px`);
      }

      if (!frame) frame = requestAnimationFrame(render);
    };

    const onLeave = () => {
      ring.dataset.visible = 'false';
      releaseMagnet();
    };
    const onDown = () => (ring.dataset.pressed = 'true');
    const onUp = () => (ring.dataset.pressed = 'false');

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', onLeave);
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      releaseMagnet();
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
    };
  }, []);

  return (
    <div
      ref={ringRef}
      className="cursor-ring no-print"
      aria-hidden="true"
      data-testid="cursor-ring"
    />
  );
}
