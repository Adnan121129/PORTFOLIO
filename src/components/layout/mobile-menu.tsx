'use client';

import { ArrowUpRight, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { mainNav } from '@/content/site';
import { contactChannels } from '@/lib/contact';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '../theme/theme-toggle';
import { isActivePath } from './nav-links';

/**
 * Compact navigation for small screens, built on the native <dialog> element:
 * showModal() gives focus containment, Escape-to-close and an inert background.
 * Focus returns to the menu button on close; the menu also closes on navigation.
 */
export function MobileMenu() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? '/';

  const close = useCallback(() => {
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
  }, []);

  const show = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    setOpen(true);
  }, []);

  // Close whenever the route changes (e.g. after following a link).
  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      setOpen(false);
      buttonRef.current?.focus();
    };
    dialog.addEventListener('close', onClose);
    return () => dialog.removeEventListener('close', onClose);
  }, []);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={show}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="inline-flex h-10 min-w-10 items-center justify-center gap-2 rounded-full border border-line bg-surface/70 px-3 text-sm font-medium text-ink transition-colors hover:border-line-strong min-[360px]:px-4 md:hidden"
      >
        <Menu size={17} strokeWidth={1.75} aria-hidden="true" />
        {/* Icon-only on very narrow screens; the label stays available to assistive tech. */}
        <span className="sr-only min-[360px]:not-sr-only">Menu</span>
      </button>

      <dialog
        ref={dialogRef}
        id="mobile-menu"
        aria-label="Site menu"
        data-scroll-lock=""
        onClick={(event) => {
          // A click on the backdrop targets the dialog element itself.
          if (event.target === dialogRef.current) close();
        }}
        className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-transparent open:flex"
      >
        <div className="ml-auto flex h-full w-full max-w-sm flex-col border-l border-line bg-bg-elevated shadow-[var(--shadow-pop)]">
          <div className="flex h-16 items-center justify-between border-b border-line px-4">
            <span className="eyebrow">Menu</span>
            <button
              type="button"
              onClick={close}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium"
            >
              <X size={17} strokeWidth={1.75} aria-hidden="true" />
              Close
            </button>
          </div>

          <nav aria-label="Main" className="flex-1 overflow-y-auto px-4 py-6">
            <ul className="space-y-1">
              <li>
                <Link
                  href="/"
                  onClick={close}
                  aria-current={pathname === '/' ? 'page' : undefined}
                  className={cn(
                    'flex items-center justify-between rounded-xl px-3 py-3 font-serif text-3xl',
                    pathname === '/' ? 'text-ink' : 'text-ink-muted',
                  )}
                >
                  Home
                </Link>
              </li>
              {mainNav.map((item) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={close}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'flex items-center justify-between rounded-xl px-3 py-3 font-serif text-3xl transition-colors',
                        active ? 'text-ink' : 'text-ink-muted hover:text-ink',
                      )}
                    >
                      {item.label}
                      {active ? (
                        <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 border-t border-line pt-6">
              <p className="eyebrow mb-3">Get in touch</p>
              <ul className="space-y-1">
                {contactChannels.map((channel) => (
                  <li key={channel.id}>
                    <a
                      href={channel.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-lg px-3 py-2.5 text-[0.95rem] text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
                    >
                      <span>
                        {channel.label}
                        <span className="sr-only">{channel.srDetail} (opens in a new tab)</span>
                      </span>
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="flex items-center justify-between border-t border-line px-4 py-4">
            <span className="text-sm text-ink-muted">Appearance</span>
            <ThemeToggle showLabel />
          </div>
        </div>
      </dialog>
    </>
  );
}
