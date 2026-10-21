import localFont from 'next/font/local';

/*
 * Self-hosted fonts (see src/fonts/README.md). Geist and Geist Mono are Latin subsets of the
 * variable fonts from the `geist` package, limited to the weights in use, which keeps the
 * preloaded font payload about half the size of the full files.
 */

export const geistSans = localFont({
  src: '../fonts/Geist-Latin-wght400-700.woff2',
  variable: '--font-geist-sans',
  weight: '400 700',
  display: 'swap',
  fallback: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
});

export const geistMono = localFont({
  src: '../fonts/GeistMono-Latin-wght400-600.woff2',
  variable: '--font-geist-mono',
  weight: '400 600',
  display: 'swap',
  // Only small labels and code use it, so it should not compete with the fonts above the fold.
  preload: false,
  adjustFontFallback: false,
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'Liberation Mono', 'monospace'],
});

/** Instrument Serif (SIL OFL 1.1, see src/fonts/InstrumentSerif-OFL.txt) for display headings. */
export const instrumentSerif = localFont({
  src: [
    { path: '../fonts/InstrumentSerif-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/InstrumentSerif-Italic.woff2', weight: '400', style: 'italic' },
  ],
  variable: '--font-instrument-serif',
  display: 'swap',
  fallback: ['ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
});
