import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const destinations = [
  { href: '/' as const, label: 'Home', text: 'Start from the overview.' },
  { href: '/projects' as const, label: 'Projects', text: 'Eight full case studies.' },
  { href: '/research' as const, label: 'Research', text: 'Five research topics.' },
  { href: '/writing' as const, label: 'Writing', text: 'Articles and notes.' },
  { href: '/contact' as const, label: 'Contact', text: 'WhatsApp, email, LinkedIn, GitHub.' },
];

export function NotFoundContent() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="bg-grid mask-fade pointer-events-none absolute inset-0" />
      <div className="container-page relative py-20 md:py-28">
        <p className="eyebrow flex items-center gap-3">
          <span className="text-accent">Error 404</span>
          <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
          Page not found
        </p>
        <h1 className="mt-6 max-w-[14ch] font-serif text-display text-ink">
          This page isn’t in the <em className="text-accent">dataset</em>.
        </h1>
        <p className="mt-6 max-w-xl text-lead text-ink-muted">
          The link may be mistyped, or the page may have moved. Here are the places most visitors
          are looking for:
        </p>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {destinations.map((destination) => (
            <li key={destination.href}>
              <Link
                href={destination.href}
                className="group flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-surface p-5 transition-colors hover:border-line-strong"
              >
                <span className="flex items-center justify-between font-medium text-ink">
                  {destination.label}
                  <ArrowRight
                    size={16}
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
                <span className="mt-1 text-sm text-ink-muted">{destination.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
