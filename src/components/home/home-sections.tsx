import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { capabilities } from '@/content/profile';
import {
  featuredProjectSlugs,
  getProject,
  getProjectsBySlugs,
  moreProjectSlugs,
} from '@/content/projects';
import { formatResearchIndex, getResearch, research } from '@/content/research';
import { ContactActions } from '../contact/contact-actions';
import { ActivityList } from '../content/activity-list';
import { ProjectCard } from '../projects/project-card';
import { Chip, Reveal, SectionHeading } from '../ui/primitives';

export function SelectedProjectsSection() {
  const featured = getProjectsBySlugs(featuredProjectSlugs);
  const more = getProjectsBySlugs(moreProjectSlugs);
  return (
    <section aria-labelledby="projects-title" className="border-b border-line py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          id="projects-title"
          index="01"
          eyebrow="Selected projects"
          title={
            <>
              Systems that turn records into <em className="text-accent">decisions</em>.
            </>
          }
          description="Eight case studies across MIS, business intelligence, applied AI and full-stack engineering — each with the problem, the architecture, the workflows and how it was tested."
          action={{ href: '/projects', label: 'All projects' }}
        />

        <ul className="mt-14 grid gap-5 md:grid-cols-2">
          {featured.map((project, index) => (
            <Reveal as="li" key={project.slug} delay={index % 2 ? 80 : 0}>
              <ProjectCard project={project} variant="feature" priority />
            </Reveal>
          ))}
        </ul>

        <div className="mt-16 flex items-center gap-4">
          <h3 className="eyebrow text-ink">More work</h3>
          <span aria-hidden="true" className="h-px flex-1 bg-line" />
        </div>
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {more.map((project) => (
            <Reveal as="li" key={project.slug}>
              <ProjectCard project={project} variant="compact" />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ResearchSection() {
  return (
    <section
      aria-labelledby="research-title"
      className="border-b border-line bg-bg-elevated py-20 md:py-28"
    >
      <div className="container-page">
        <SectionHeading
          id="research-title"
          index="02"
          eyebrow="Research"
          title="Questions I’ve investigated."
          description="Mobile safety ML, computer vision for waste detection, green federated learning, AI-generated media detection and NLP bias analysis — summarised faithfully, with each item’s status stated plainly."
          action={{ href: '/research', label: 'All research' }}
        />
        <ol className="mt-14 border-t border-line">
          {research.map((item) => (
            <Reveal as="li" key={item.slug} className="border-b border-line">
              <article className="group relative grid gap-3 py-7 transition-colors md:grid-cols-12 md:items-baseline md:gap-6">
                <span className="font-mono text-[0.75rem] tracking-[0.12em] text-accent md:col-span-1">
                  {formatResearchIndex(item.index)}
                </span>
                <div className="md:col-span-6">
                  <h3 className="font-serif text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.1] text-ink">
                    {item.shortTitle}
                  </h3>
                  <p className="mt-2 max-w-[60ch] text-[0.95rem] leading-relaxed text-ink-muted">
                    {item.summary}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 md:col-span-3">
                  <Chip tone="accent">{item.status.label}</Chip>
                  {item.area.slice(0, 2).map((area) => (
                    <Chip key={area}>{area}</Chip>
                  ))}
                </div>
                <div className="md:col-span-2 md:justify-self-end">
                  <Link
                    href={`/research/${item.slug}`}
                    aria-label={`Read research: ${item.shortTitle}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium whitespace-nowrap text-ink after:absolute after:inset-0 after:content-['']"
                  >
                    <span className="link-sweep">Read research</span>
                    <ArrowRight
                      size={18}
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function evidenceLink(kind: 'project' | 'research', slug: string) {
  if (kind === 'project') {
    const project = getProject(slug);
    return project
      ? { href: `/projects/${slug}` as const, label: project.title.split(' · ')[0] }
      : null;
  }
  const item = getResearch(slug);
  return item ? { href: `/research/${slug}` as const, label: item.shortTitle } : null;
}

export function CapabilitiesSection() {
  return (
    <section aria-labelledby="capabilities-title" className="border-b border-line py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          id="capabilities-title"
          index="03"
          eyebrow="Capabilities"
          title="What I work across."
          description="Five areas, each grounded in the skills I list and the work you can inspect."
        />
        <ul className="mt-14 grid gap-4 md:grid-cols-6">
          {capabilities.map((capability, index) => (
            <Reveal
              as="li"
              key={capability.id}
              className={index < 2 ? 'md:col-span-3' : 'md:col-span-2'}
            >
              <div className="surface-card flex h-full flex-col p-6">
                <span className="font-mono text-[0.72rem] tracking-[0.12em] text-accent">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4 font-serif text-[1.85rem] leading-[1.05] text-ink">
                  {capability.title}
                </h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-muted">
                  {capability.description}
                </p>
                <ul
                  className="mt-5 flex flex-wrap gap-1.5"
                  aria-label={`${capability.title} skills`}
                >
                  {capability.skills.map((skill) => (
                    <li key={skill}>
                      <Chip>{skill}</Chip>
                    </li>
                  ))}
                </ul>
                <p className="mt-auto pt-6 text-sm text-ink-subtle">
                  <span className="font-mono text-[0.7rem] tracking-[0.12em] uppercase">
                    Seen in{' '}
                  </span>
                  {capability.evidence
                    .map((item) => evidenceLink(item.kind, item.slug))
                    .filter((link): link is NonNullable<typeof link> => Boolean(link))
                    .map((link, i) => (
                      <span key={link.href}>
                        {i > 0 ? ', ' : ''}
                        <Link href={link.href} className="link-inline">
                          {link.label}
                        </Link>
                      </span>
                    ))}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ExperienceSection() {
  return (
    <section
      aria-labelledby="experience-title"
      className="border-b border-line bg-bg-elevated py-20 md:py-28"
    >
      <div className="container-page">
        <SectionHeading
          id="experience-title"
          index="04"
          eyebrow="Experience & activities"
          title="Community, showcases and leadership."
          action={{ href: '/about', label: 'Full background' }}
        />
        <ActivityList className="mt-14" />
      </div>
    </section>
  );
}

export function ContactCta({ headingLevel = 'h2' }: { headingLevel?: 'h2' | 'h3' }) {
  const Heading = headingLevel;
  return (
    <section
      aria-labelledby="contact-cta-title"
      className="relative overflow-hidden py-20 md:py-28"
    >
      <div aria-hidden="true" className="bg-grid mask-fade pointer-events-none absolute inset-0" />
      <div className="container-page relative">
        <p className="eyebrow flex items-center gap-3">
          <span className="text-accent">06</span>
          <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
          Contact
        </p>
        <Heading
          id="contact-cta-title"
          className="mt-5 max-w-[21ch] font-serif text-display text-ink"
        >
          Have data, a decision or a system in mind? <em className="text-accent">Let’s talk.</em>
        </Heading>
        <p className="mt-6 max-w-xl text-lead text-ink-muted">
          Start a conversation on WhatsApp, or reach me by email, LinkedIn or GitHub.
        </p>
        <ContactActions className="mt-10" />
        <p className="mt-8 text-sm text-ink-subtle">
          Or see every option on the{' '}
          <Link href="/contact" className="link-inline inline-flex items-center gap-1">
            contact page <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </p>
      </div>
    </section>
  );
}
