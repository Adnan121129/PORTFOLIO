import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { categoryLabels, formatProjectIndex, getAdjacentProjects } from '@/content/projects';
import type { Project } from '@/content/types';
import { repoWebUrl } from '@/lib/contact';
import { SectionView } from '../content/blocks';
import { MobileToc, TableOfContents } from '../content/toc';
import { GitHubIcon } from '../icons/brand-icons';
import { ProjectIllustration } from '../illustrations/project-illustrations';
import { CopyButton } from '../contact/copy-button';
import { buttonClasses, ButtonLink } from '../ui/button';
import { Breadcrumbs, Chip, Notice } from '../ui/primitives';

export function CaseStudy({ project }: { project: Project }) {
  const { previous, next } = getAdjacentProjects(project.slug);
  const toc = [
    ...project.sections.map((section) => ({ id: section.id, label: section.title })),
    ...(project.repo ? [{ id: 'links', label: 'Links' }] : []),
  ];

  return (
    <article className="project-tint" style={{ '--hue': project.hue } as CSSProperties}>
      <header className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden="true"
          className="bg-grid mask-fade pointer-events-none absolute inset-0 opacity-80"
        />
        <div className="container-page relative pt-8 pb-12 md:pt-10 md:pb-16">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Projects', href: '/projects' },
              { label: project.title },
            ]}
          />
          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <p className="eyebrow flex flex-wrap items-center gap-3">
                <span className="text-(--project)">{formatProjectIndex(project.index)}</span>
                <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
                <span>Case study</span>
                <span aria-hidden="true">·</span>
                <span>
                  {project.categories.map((category) => categoryLabels[category]).join(' · ')}
                </span>
              </p>
              <h1 className="mt-5 font-serif text-display text-ink">{project.title}</h1>
              <p className="mt-4 text-[1.05rem] font-medium text-ink-muted">{project.subtitle}</p>
              <p className="mt-6 max-w-[34ch] font-serif text-[clamp(1.4rem,2.4vw,1.9rem)] leading-snug text-ink italic">
                “{project.tagline}”
              </p>
              <ul className="mt-7 flex flex-wrap gap-1.5" aria-label="Technologies and tags">
                {project.tags.map((tag) => (
                  <li key={tag}>
                    <Chip tone="outline">{tag}</Chip>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {project.repo ? (
                  <a
                    href={repoWebUrl(project.repo)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonClasses('primary', 'md')}
                    data-testid="repo-link"
                  >
                    <GitHubIcon size={16} />
                    View source on GitHub
                    <ArrowUpRight size={15} aria-hidden="true" className="opacity-70" />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : null}
                <ButtonLink href="/projects" variant="secondary">
                  <ArrowLeft size={15} aria-hidden="true" />
                  Back to Projects
                </ButtonLink>
              </div>
            </div>
            <div className="lg:col-span-5">
              <ProjectIllustration name={project.illustration} hue={project.hue} caption />
            </div>
          </div>

          {project.notices?.length ? (
            <div className="mt-10 grid gap-3 lg:max-w-[calc(7/12*100%)]">
              {project.notices.map((notice) => (
                <Notice key={notice.title} tone={notice.tone} title={notice.title}>
                  {notice.text}
                </Notice>
              ))}
            </div>
          ) : null}
        </div>
      </header>

      {project.stats?.length ? (
        <section aria-label="Key numbers" className="border-b border-line bg-bg-elevated">
          <ul className="container-page grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {project.stats.map((stat) => (
              <li
                key={`${stat.value}-${stat.label}`}
                className="py-6 pr-4 lg:border-r lg:border-line lg:px-5 lg:first:pl-0 lg:last:border-r-0"
              >
                <span className="block font-serif text-[clamp(2rem,3vw,2.6rem)] leading-none text-ink">
                  {stat.value}
                </span>
                <span className="mt-2 block text-[0.85rem] leading-snug text-ink-muted">
                  {stat.label}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="container-page grid gap-12 py-14 lg:grid-cols-12 lg:gap-12 lg:py-20">
        <aside className="lg:col-span-3">
          <MobileToc items={toc} />
          <TableOfContents items={toc} className="sticky top-24 hidden lg:block" />
        </aside>
        <div className="min-w-0 space-y-16 lg:col-span-9">
          {project.sections.map((section, index) => (
            <SectionView key={section.id} section={section} index={index} scope={project.slug} />
          ))}

          {project.repo ? (
            <section
              id="links"
              aria-labelledby={`${project.slug}-links-title`}
              className="scroll-mt-28"
            >
              <div className="flex items-baseline gap-4 border-t border-line pt-8">
                <span className="font-mono text-[0.75rem] text-accent">
                  {String(project.sections.length + 1).padStart(2, '0')}
                </span>
                <h2
                  id={`${project.slug}-links-title`}
                  className="font-serif text-[clamp(1.9rem,3.2vw,2.6rem)] leading-[1.05] tracking-tight text-ink"
                >
                  Links
                </h2>
              </div>
              <div className="surface-card mt-7 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-[0.95rem] font-semibold text-ink">Source repository</p>
                  <p className="mt-1 truncate font-mono text-[0.82rem] text-ink-muted">
                    {project.repo}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-4">
                  <CopyButton
                    value={project.repo}
                    label="Copy clone URL"
                    copiedLabel="Clone URL copied"
                  />
                  <a
                    href={repoWebUrl(project.repo)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-ink hover:text-accent"
                  >
                    Open on GitHub <ArrowUpRight size={15} aria-hidden="true" />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </div>
              </div>
            </section>
          ) : null}
        </div>
      </div>

      <nav aria-label="More case studies" className="border-t border-line bg-bg-elevated">
        <div className="container-page grid gap-4 py-12 md:grid-cols-3 md:items-stretch">
          <Link
            href="/projects"
            className="group flex items-center gap-3 rounded-[var(--radius-card)] border border-line bg-surface p-5 hover:border-line-strong"
          >
            <ArrowLeft
              size={18}
              aria-hidden="true"
              className="transition-transform group-hover:-translate-x-1"
            />
            <span>
              <span className="eyebrow block">All work</span>
              <span className="mt-1 block font-medium text-ink">Back to Projects</span>
            </span>
          </Link>
          <Link
            href={`/projects/${previous.slug}`}
            className="group flex flex-col justify-center rounded-[var(--radius-card)] border border-line bg-surface p-5 hover:border-line-strong"
          >
            <span className="eyebrow">Previous case study</span>
            <span className="mt-1 font-serif text-2xl leading-tight text-ink">
              {previous.title}
            </span>
          </Link>
          <Link
            href={`/projects/${next.slug}`}
            className="group flex items-center justify-between gap-3 rounded-[var(--radius-card)] border border-line bg-surface p-5 hover:border-line-strong md:text-right"
            data-testid="next-case-study"
          >
            <span className="md:ml-auto">
              <span className="eyebrow block">Next case study</span>
              <span className="mt-1 block font-serif text-2xl leading-tight text-ink">
                {next.title}
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
