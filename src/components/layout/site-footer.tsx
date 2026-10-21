import { ArrowUpRight, Rss } from 'lucide-react';
import Link from 'next/link';
import {
  EMAIL,
  GITHUB_URL,
  LINKEDIN_URL,
  mainNav,
  site,
  WHATSAPP_GREETING,
  WHATSAPP_NUMBER_DISPLAY,
} from '@/content/site';
import { gmailComposeUrl, mailtoUrl, whatsappUrl } from '@/lib/contact';
import { CurrentYear } from './current-year';
import { Monogram } from './site-header';

const BUILD_YEAR = 2026;

const contactLinks = [
  { label: 'WhatsApp', detail: WHATSAPP_NUMBER_DISPLAY, href: whatsappUrl(WHATSAPP_GREETING) },
  { label: 'Email (Gmail)', detail: EMAIL, href: gmailComposeUrl() },
  { label: 'LinkedIn', detail: 'muhammad-adnan-55778b242', href: LINKEDIN_URL },
  { label: 'GitHub', detail: 'Adnan121129', href: GITHUB_URL },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-bg-elevated">
      <div className="container-page grid gap-12 py-14 md:grid-cols-12 md:py-16">
        <div className="md:col-span-5">
          <Link href="/" className="inline-flex items-center gap-3 rounded-xl">
            <Monogram />
            <span className="text-base font-semibold tracking-tight">{site.name}</span>
          </Link>
          <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-ink-muted">
            CSE graduate working across MIS, business intelligence, data analysis, applied AI/ML and
            backend-focused full-stack development.
          </p>
          <p className="mt-6 text-sm text-ink-muted">
            Prefer your own mail app?{' '}
            <a className="link-inline" href={mailtoUrl()}>
              {EMAIL}
            </a>
          </p>
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <p className="eyebrow mb-4">Navigate</p>
          <ul className="space-y-2.5 text-[0.95rem]">
            <li>
              <Link className="link-sweep text-ink-muted hover:text-ink" href="/">
                Home
              </Link>
            </li>
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link className="link-sweep text-ink-muted hover:text-ink" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                className="inline-flex items-center gap-1.5 text-ink-muted hover:text-ink"
                href="/writing/feed.xml"
              >
                <Rss size={14} aria-hidden="true" />
                RSS feed
              </a>
            </li>
          </ul>
        </nav>

        <div className="md:col-span-4">
          <p className="eyebrow mb-4">Contact</p>
          <ul className="space-y-3">
            {contactLinks.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-baseline justify-between gap-4 border-b border-line pb-3 text-[0.95rem]"
                >
                  <span className="text-ink">{item.label}</span>
                  <span className="flex min-w-0 items-center gap-1 truncate text-sm text-ink-muted group-hover:text-ink">
                    <span className="truncate">{item.detail}</span>
                    <ArrowUpRight size={14} aria-hidden="true" className="shrink-0" />
                  </span>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-2 py-6 text-sm text-ink-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CurrentYear fallback={BUILD_YEAR} /> {site.name}. All rights reserved.
          </p>
          <p className="font-mono text-xs tracking-wide">
            Project illustrations are representative, not product screenshots.
          </p>
        </div>
      </div>
    </footer>
  );
}
