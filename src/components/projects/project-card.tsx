import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Fragment, type CSSProperties } from 'react';
import { categoryLabels, formatProjectIndex } from '@/content/projects';
import type { Project } from '@/content/types';
import { cn } from '@/lib/utils';
import { ProjectIllustration } from '../illustrations/project-illustrations';
import { Chip } from '../ui/primitives';

type Variant = 'feature' | 'grid' | 'compact';

/**
 * Project card. The “Read case study” link is stretched over the whole card, so the
 * card is a single focus stop whose accessible name includes the project title.
 */
export function ProjectCard({
  project,
  variant = 'grid',
  headingLevel = 'h3',
  priority = false,
}: {
  project: Project;
  variant?: Variant;
  headingLevel?: 'h2' | 'h3';
  priority?: boolean;
}) {
  const Heading = headingLevel;
  const tagCount = variant === 'compact' ? 3 : variant === 'feature' ? 6 : 5;
  return (
    <article
      className={cn(
        'project-tint group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-[var(--shadow-card)]',
        'focus-within:border-line-strong',
      )}
      style={{ '--hue': project.hue } as CSSProperties}
      data-project={project.slug}
    >
      <div className="relative border-b border-line">
        <ProjectIllustration name={project.illustration} hue={project.hue} />
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-(--project) transition-transform duration-500 group-hover:scale-x-100"
        />
      </div>

      <div className={cn('flex flex-1 flex-col', variant === 'compact' ? 'p-4' : 'p-5 sm:p-6')}>
        <p className="eyebrow">
          <span className="text-(--project)">{formatProjectIndex(project.index)}</span>
          {/* The separator binds to the preceding label, so lines never start with a dot. */}
          {project.categories.map((category) => (
            <Fragment key={category}>
              {'\u00a0· '}
              <span className="whitespace-nowrap">{categoryLabels[category]}</span>
            </Fragment>
          ))}
        </p>
        <Heading
          className={cn(
            'mt-2.5 font-serif leading-[1.05] tracking-tight text-ink',
            variant === 'compact' ? 'text-[1.6rem]' : 'text-title',
          )}
        >
          {project.title}
        </Heading>
        <p
          className={cn(
            'mt-2 text-ink-muted',
            variant === 'compact' ? 'text-[0.9rem]' : 'text-[0.95rem]',
          )}
        >
          {variant === 'compact' ? project.tagline : project.subtitle}
        </p>
        {variant !== 'compact' ? (
          <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-muted">{project.summary}</p>
        ) : null}
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={`${project.title} technologies`}>
          {project.tags.slice(0, tagCount).map((tag) => (
            <li key={tag}>
              <Chip>{tag}</Chip>
            </li>
          ))}
          {project.tags.length > tagCount ? (
            <li>
              <Chip tone="outline">+{project.tags.length - tagCount}</Chip>
            </li>
          ) : null}
        </ul>
        <div className="mt-auto pt-5">
          <Link
            href={`/projects/${project.slug}`}
            prefetch={priority ? true : undefined}
            className="inline-flex items-center gap-2 text-[0.95rem] font-medium text-ink after:absolute after:inset-0 after:rounded-[var(--radius-card)] after:content-['']"
            // Starts with the visible text (WCAG 2.5.3) and names the project for screen readers.
            aria-label={`Read Case Study: ${project.title}`}
            data-testid="read-case-study"
          >
            <span className="link-sweep">Read Case Study</span>
            <ArrowRight
              size={16}
              aria-hidden="true"
              className="text-(--project) transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
