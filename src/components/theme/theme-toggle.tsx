'use client';

import { Moon, Sun } from 'lucide-react';
import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { cn } from '@/lib/utils';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';
const listeners = new Set<() => void>();

function readTheme(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
  listeners.forEach((listener) => listener());
}

function storedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

/**
 * Light/dark toggle. The pre-paint head script has already applied the initial theme;
 * this button flips it, persists the choice in localStorage and follows OS changes
 * until the visitor makes an explicit choice. State is exposed with aria-pressed.
 */
export function ThemeToggle({
  className,
  showLabel = false,
}: {
  className?: string;
  showLabel?: boolean;
}) {
  // null on the server and during hydration, so markup matches; icons swap via CSS.
  const theme = useSyncExternalStore<Theme | null>(subscribe, readTheme, () => null);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (event: MediaQueryListEvent) => {
      if (!storedTheme()) applyTheme(event.matches ? 'dark' : 'light');
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const toggle = useCallback(() => {
    const next: Theme = readTheme() === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage can be unavailable (private mode); the theme still switches for this visit.
    }
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion && typeof document.startViewTransition === 'function') {
      const root = document.documentElement;
      root.dataset.vt = 'theme';
      const transition = document.startViewTransition(() => applyTheme(next));
      transition.finished.finally(() => delete root.dataset.vt);
    } else {
      applyTheme(next);
    }
  }, []);

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={theme === null ? undefined : isDark}
      aria-label={showLabel ? undefined : 'Dark theme'}
      title={
        showLabel
          ? undefined
          : theme === null
            ? 'Toggle dark theme'
            : isDark
              ? 'Switch to light theme'
              : 'Switch to dark theme'
      }
      data-testid="theme-toggle"
      className={cn(
        'group relative inline-flex h-10 items-center justify-center gap-2 rounded-full border border-line bg-surface/70 text-ink-muted transition-colors hover:border-line-strong hover:text-ink',
        showLabel ? 'px-4' : 'w-10',
        className,
      )}
    >
      <span
        className="relative inline-flex size-[18px] items-center justify-center"
        aria-hidden="true"
      >
        <Sun
          size={18}
          strokeWidth={1.75}
          className="absolute transition-all duration-300 dark:scale-50 dark:rotate-90 dark:opacity-0"
        />
        <Moon
          size={17}
          strokeWidth={1.75}
          className="absolute scale-50 -rotate-90 opacity-0 transition-all duration-300 dark:scale-100 dark:rotate-0 dark:opacity-100"
        />
      </span>
      {showLabel ? (
        <>
          {/* A fixed label plus aria-pressed: the name never contradicts the visible text. */}
          <span className="text-sm font-medium">Dark theme</span>
          <span
            aria-hidden="true"
            className="relative h-[18px] w-8 rounded-full bg-line-strong transition-colors duration-300 dark:bg-accent"
          >
            <span className="absolute top-[3px] left-[3px] size-3 rounded-full bg-surface shadow-sm transition-transform duration-300 dark:translate-x-3.5" />
          </span>
        </>
      ) : null}
    </button>
  );
}
