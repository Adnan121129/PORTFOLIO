import { ArrowLeft, ArrowRight, FileText } from 'lucide-react';
import Link from 'next/link';
import { formatResearchIndex, getAdjacentResearch } from '@/content/research';
import type { Research } from '@/content/types';
import { SectionView } from '../content/blocks';
import { MobileToc, TableOfContents } from '../content/toc';
import { Breadcrumbs, Chip } from '../ui/primitives';

export function ResearchDetail({ item }: { item: Research }) {
  const { previous, next } = getAdjacentResearch(item.slug);
  const toc = [
    { id: 'abstract', label: item.abstractLabel },
    ...item.sections.map((section) => ({ id: section.id, label: section.title })),
  ];

  return (
    <article>
      <header className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden="true"
          className="bg-grid mask-fade pointer-events-none absolute inset-0 opacity-80"
        />
        <div className="container-page relative pt-8 pb-12 md:pt-10 md:pb-16">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Research', href: '/research' },
              { label: item.shortTitle },
            ]}
          />
          <div className="mt-10 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="eyebrow flex flex-wrap items-center gap-3">
                <span className="text-accent">{formatResearchIndex(item.index)}</span>
                <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
                <span>Research</span>
              </p>
              <h1 className="mt-5 font-serif text-[clamp(2.2rem,4.6vw,3.9rem)] leading-[1.02] tracking-tight text-ink">
                {item.title}
              </h1>
              <p className="mt-6 max-w-[62ch] text-lead text-ink-muted">{item.summary}</p>
            </div>
            <aside aria-label="At a glance" className="lg:col-span-4 lg:pt-12">
              <dl className="surface-card divide-y divide-line text-[0.92rem]">
                <div className="p-5">
                  <dt className="eyebrow">Status</dt>
                  <dd className="mt-2">
                    <Chip tone="accent">{item.status.label}</Chip>
                    <p className="mt-3 leading-relaxed text-ink-muted">{item.status.detail}</p>
                  </dd>
                </div>
                <div className="p-5">
                  <dt className="eyebrow">Areas</dt>
                  <dd className="mt-2 text-ink">{item.area.join(' · ')}</dd>
                </div>
              </dl>
            </aside>
          </div>
        </div>
      </header>

      <div className="container-page grid gap-12 py-14 lg:grid-cols-12 lg:gap-12 lg:py-20">
        <aside className="lg:col-span-3">
          <MobileToc items={toc} />
          <TableOfContents items={toc} className="sticky top-24 hidden lg:block" />
        </aside>
        <div className="min-w-0 space-y-16 lg:col-span-9">
          <section
            id="abstract"
            aria-labelledby={`${item.slug}-abstract-title`}
            className="scroll-mt-28"
          >
            <div className="flex items-baseline gap-4 border-t border-line pt-8">
              <FileText size={16} aria-hidden="true" className="text-accent" />
              <h2
                id={`${item.slug}-abstract-title`}
                className="font-serif text-[clamp(1.9rem,3.2vw,2.6rem)] leading-[1.05] tracking-tight text-ink"
              >
                {item.abstractLabel}
              </h2>
            </div>
            <div className="mt-7 rounded-[var(--radius-card)] border border-line bg-surface p-6 sm:p-8">
              <p className="eyebrow mb-4">
                {item.abstractLabel === 'Abstract'
                  ? 'Abstract, as supplied'
                  : 'Summary, as supplied'}
              </p>
              <div className="space-y-4">
                {item.abstract.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="max-w-[72ch] text-[1.02rem] leading-[1.8] text-ink"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="mt-6 border-t border-line pt-5">
                <p className="eyebrow mb-3">{item.keywordsLabel}</p>
                <ul className="flex flex-wrap gap-1.5" aria-label={item.keywordsLabel}>
                  {item.keywords.map((keyword) => (
                    <li key={keyword}>
                      <Chip tone="outline">{keyword}</Chip>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {item.sections.map((section, index) => (
            <SectionView key={section.id} section={section} index={index} scope={item.slug} />
          ))}
        </div>
      </div>

      <nav aria-label="More research" className="border-t border-line bg-bg-elevated">
        <div className="container-page grid gap-4 py-12 md:grid-cols-3">
          <Link
            href="/research"
            className="group flex items-center gap-3 rounded-[var(--radius-card)] border border-line bg-surface p-5 hover:border-line-strong"
          >
            <ArrowLeft
              size={18}
              aria-hidden="true"
              className="transition-transform group-hover:-translate-x-1"
            />
            <span>
              <span className="eyebrow block">All research</span>
              <span className="mt-1 block font-medium text-ink">Back to Research</span>
            </span>
          </Link>
          <Link
            href={`/research/${previous.slug}`}
            className="flex flex-col justify-center rounded-[var(--radius-card)] border border-line bg-surface p-5 hover:border-line-strong"
          >
            <span className="eyebrow">Previous</span>
            <span className="mt-1 font-serif text-2xl leading-tight text-ink">
              {previous.shortTitle}
            </span>
          </Link>
          <Link
            href={`/research/${next.slug}`}
            className="group flex items-center justify-between gap-3 rounded-[var(--radius-card)] border border-line bg-surface p-5 hover:border-line-strong md:text-right"
          >
            <span className="md:ml-auto">
              <span className="eyebrow block">Next</span>
              <span className="mt-1 block font-serif text-2xl leading-tight text-ink">
                {next.shortTitle}
              </span>
            </span>
            <ArrowRight
              size={18}
              aria-hidden="true"
              className="shrink-0 transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </nav>
    </article>
  );
}
