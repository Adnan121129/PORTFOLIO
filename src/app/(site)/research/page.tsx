import { ArrowRight, Info } from 'lucide-react';
import Link from 'next/link';
import { JsonLd } from '@/components/ui/json-ld';
import { Chip, PageIntro, Reveal } from '@/components/ui/primitives';
import { formatResearchIndex, research } from '@/content/research';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Research',
  description:
    'Research by Muhammad Adnan: Nirapotta (on-device ML for public safety), garbage detection with classical image processing and SVM, energy-efficient federated learning, AI-generated media detection, and gender bias in social media comments.',
  path: '/research',
});

export default function ResearchPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Research', path: '/research' },
        ])}
      />
      <PageIntro
        eyebrow="Research portfolio"
        title="Research"
        aside={
          <div className="flex gap-3 rounded-xl border border-line bg-surface p-4 text-[0.9rem] leading-relaxed text-ink-muted">
            <Info size={17} aria-hidden="true" className="mt-0.5 shrink-0 text-accent" />
            <p>
              Abstracts are reproduced as supplied. Each status label states only what the source
              material supports — no publication, peer-review or benchmark claims are added.
            </p>
          </div>
        }
      >
        <p>
          Five research topics spanning mobile safety with on-device machine learning, computer
          vision for urban waste detection, green federated learning, multimodal detection of
          AI-generated media, and NLP analysis of gender bias in multilingual comments.
        </p>
      </PageIntro>

      <section aria-label="Research topics" className="container-page py-12 md:py-16">
        <ol className="grid gap-5 md:grid-cols-2">
          {research.map((item, index) => (
            <Reveal as="li" key={item.slug} className={index === 0 ? 'md:col-span-2' : undefined}>
              <article className="group relative flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-surface p-6 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[var(--shadow-card)] sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="font-mono text-[0.75rem] tracking-[0.12em] text-accent">
                    {formatResearchIndex(item.index)}
                  </span>
                  <Chip tone="accent">{item.status.label}</Chip>
                </div>
                <h2 className="mt-5 font-serif text-[clamp(1.6rem,2.6vw,2.2rem)] leading-[1.08] text-ink">
                  {item.title}
                </h2>
                <p className="mt-4 max-w-[70ch] text-[0.97rem] leading-relaxed text-ink-muted">
                  {item.summary}
                </p>
                <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Areas">
                  {item.area.map((area) => (
                    <li key={area}>
                      <Chip>{area}</Chip>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-6">
                  <Link
                    href={`/research/${item.slug}`}
                    aria-label={`Read Research: ${item.shortTitle}`}
                    className="inline-flex items-center gap-2 text-[0.95rem] font-medium text-ink after:absolute after:inset-0 after:rounded-[var(--radius-card)] after:content-['']"
                  >
                    <span className="link-sweep">Read Research</span>
                    <ArrowRight
                      size={16}
                      aria-hidden="true"
                      className="text-accent transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </ol>
      </section>
    </>
  );
}
