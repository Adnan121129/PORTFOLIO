import type { Metadata, Viewport } from 'next';
import { headScript } from '@/components/theme/head-script';
import { site } from '@/content/site';
import { siteUrl } from '@/lib/env';
import { geistMono, geistSans, instrumentSerif } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: site.title,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: '/about' }],
  creator: site.name,
  keywords: [
    'Muhammad Adnan',
    'Management Information Systems',
    'Business Intelligence',
    'Data Analysis',
    'Power BI',
    'Full-stack developer',
    'Backend developer',
    'Machine learning',
    'CSE graduate',
    'Bangladesh',
  ],
  openGraph: {
    type: 'website',
    siteName: site.name,
    locale: site.locale,
    title: site.title,
    description: site.description,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: site.title }],
  },
  twitter: {
    card: 'summary_large_image',
    title: site.title,
    description: site.description,
  },
  alternates: {
    types: {
      'application/rss+xml': [{ url: '/writing/feed.xml', title: `${site.name} — Writing` }],
    },
  },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4f2ed' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0d10' },
  ],
  colorScheme: 'light dark',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
    >
      <head>
        {/* Applies the theme before first paint and enables scroll reveals. */}
        <script dangerouslySetInnerHTML={{ __html: headScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
