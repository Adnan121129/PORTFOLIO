import { GraduationCap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import portrait from '@/assets/muhammad-adnan.jpg';
import { ActivityList } from '@/components/content/activity-list';
import { ContactCta } from '@/components/home/home-sections';
import { JsonLd } from '@/components/ui/json-ld';
import { Chip, Reveal, SectionHeading } from '@/components/ui/primitives';
import { capabilities, education, skillGroups } from '@/content/profile';
import { site } from '@/content/site';
import { breadcrumbJsonLd, pageMetadata, personJsonLd } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'About',
  description:
    'About Muhammad Adnan — a data-driven CSE graduate (BSc in Computer Science & Engineering, UIU) focused on MIS and business intelligence, with backend-focused full-stack and applied AI/ML experience. Education, skills and activities.',
  path: '/about',
  type: 'profile',
});

/** Patterns that recur across the documented projects, each with the evidence behind it. */
const principles = [
  {
    title: 'Capture once, validate early',
    text: 'Records are entered once, checked against business rules and approved before they count — e.g. no overlapping downtime, no stock issued beyond what exists, second-person verification for factory data.',
    evidence: [
      { href: '/projects/plantops-intelligence' as const, label: 'PlantOps Intelligence' },
      { href: '/projects/greenfactory-bi' as const, label: 'GreenFactory BI' },
    ],
  },
  {
    title: 'One definition per number',
    text: 'KPIs are defined once and reused by dashboards, reports and the BI layer, and Power BI measures are reconciled against the application instead of being trusted to match.',
    evidence: [
      { href: '/projects/plantops-intelligence' as const, label: 'PlantOps Intelligence' },
      { href: '/projects/greenfactory-bi' as const, label: 'GreenFactory BI' },
    ],
  },
  {
    title: 'Make gaps and uncertainty visible',
    text: 'Missing data is never treated as zero, pronunciation is marked “not assessed” without evidence, and a demo model is labelled as a demo model.',
    evidence: [
      { href: '/projects/greenfactory-bi' as const, label: 'GreenFactory BI' },
      { href: '/projects/linguasi' as const, label: 'LinguaSI' },
      { href: '/projects/infravision-ai' as const, label: 'InfraVision AI' },
    ],
  },
  {
    title: 'Keep people in the loop',
    text: 'Engineers confirm or reject every AI finding; timesheets need a manager’s approval with a reason for rejection and no self-approval.',
    evidence: [
      { href: '/projects/infravision-ai' as const, label: 'InfraVision AI' },
      { href: '/projects/omnimanager' as const, label: 'OmniManager' },
    ],
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          personJsonLd(),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
          ]),
        ]}
      />

      <header className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden="true"
          className="bg-grid mask-fade pointer-events-none absolute inset-0 opacity-80"
        />
        <div className="container-page relative grid gap-12 pt-14 pb-14 md:grid-cols-12 md:pt-20 md:pb-20">
          <div className="md:col-span-7">
            <p className="eyebrow flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
              About
            </p>
            <h1 className="mt-5 font-serif text-display text-ink">
              {site.firstName} <em className="text-accent">{site.lastName}</em>
            </h1>
            <p className="mt-8 max-w-[58ch] text-[clamp(1.15rem,1.8vw,1.4rem)] leading-[1.6] text-ink">
              {site.about}
            </p>
            <ul className="mt-8 flex flex-wrap gap-2" aria-label="Focus areas">
              {[
                'MIS',
                'Business Intelligence',
                'Data analysis',
                'Backend & full-stack',
                'Applied AI/ML',
              ].map((item) => (
                <li key={item}>
                  <Chip tone="outline">{item}</Chip>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-5">
            <figure className="relative mx-auto max-w-sm md:max-w-none">
              <div className="overflow-hidden rounded-2xl border border-line bg-surface-2">
                <Image
                  src={portrait}
                  alt="Portrait of Muhammad Adnan wearing glasses and a brown pinstripe blazer over a white shirt"
                  placeholder="blur"
                  quality={85}
                  preload
                  sizes="(min-width: 1240px) 440px, (min-width: 768px) 40vw, 90vw"
                  className="aspect-[4/5] h-auto w-full object-cover object-[50%_22%]"
                />
              </div>
              <figcaption className="mt-4 font-mono text-[0.7rem] tracking-[0.12em] text-ink-subtle uppercase">
                {site.name} · BSc CSE, United International University
              </figcaption>
            </figure>
          </div>
        </div>
      </header>

      <section aria-labelledby="focus-title" className="border-b border-line py-20 md:py-24">
        <div className="container-page">
          <SectionHeading
            id="focus-title"
            index="01"
            eyebrow="Career focus"
            title="Where I focus."
          />
          <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((capability) => (
              <Reveal as="li" key={capability.id}>
                <div className="surface-card h-full p-6">
                  <h3 className="font-serif text-[1.65rem] leading-tight text-ink">
                    {capability.title}
                  </h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-muted">
                    {capability.description}
                  </p>
                </div>
              </Reveal>
            ))}
            <Reveal as="li">
              <div className="h-full rounded-[var(--radius-card)] border border-dashed border-line-strong p-6">
                <h3 className="font-serif text-[1.65rem] leading-tight text-ink">
                  Operations & administration
                </h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-muted">
                  Equally comfortable with administrative and operational tasks — documentation,
                  record-keeping, reporting and the coordination that keeps work moving.
                </p>
              </div>
            </Reveal>
          </ul>
        </div>
      </section>

      <section
        aria-labelledby="education-title"
        className="border-b border-line bg-bg-elevated py-20 md:py-24"
      >
        <div className="container-page">
          <SectionHeading id="education-title" index="02" eyebrow="Education" title="Education." />
          <ol className="mt-12 grid gap-4 md:grid-cols-3">
            {education.map((entry) => (
              <Reveal as="li" key={entry.institution}>
                <div className="surface-card flex h-full flex-col p-6">
                  <GraduationCap
                    size={20}
                    strokeWidth={1.6}
                    aria-hidden="true"
                    className="text-accent"
                  />
                  <h3 className="mt-4 text-[1.1rem] leading-snug font-semibold text-ink">
                    {entry.institution}
                  </h3>
                  <p className="mt-1 text-sm text-ink-subtle">{entry.location}</p>
                  <p className="mt-4 text-[0.97rem] leading-relaxed text-ink-muted">
                    {entry.credential}
                  </p>
                  {entry.detail ? (
                    <p className="mt-auto pt-4">
                      <Chip tone="accent">{entry.detail}</Chip>
                    </p>
                  ) : null}
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="skills-title" className="border-b border-line py-20 md:py-24">
        <div className="container-page">
          <SectionHeading
            id="skills-title"
            index="03"
            eyebrow="Technical skills"
            title="Skills."
            description="Grouped as I use them. No proficiency bars — the case studies show the work."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {skillGroups.map((group) => (
              <Reveal key={group.id}>
                <section aria-label={group.label} className="surface-card h-full p-6">
                  <h3 className="eyebrow text-ink">{group.label}</h3>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {group.items.map((skill) => (
                      <li key={skill}>
                        <Chip>{skill}</Chip>
                      </li>
                    ))}
                  </ul>
                </section>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="activities-title"
        className="border-b border-line bg-bg-elevated py-20 md:py-24"
      >
        <div className="container-page">
          <SectionHeading
            id="activities-title"
            index="04"
            eyebrow="Experience & extracurricular activities"
            title="Experience & activities."
          />
          <ActivityList className="mt-12" />
        </div>
      </section>

      <section aria-labelledby="principles-title" className="border-b border-line py-20 md:py-24">
        <div className="container-page">
          <SectionHeading
            id="principles-title"
            index="05"
            eyebrow="How I work"
            title="Patterns you’ll find in the work."
            description="Recurring design decisions across the case studies — each one links to where it is documented."
          />
          <ol className="mt-12 grid gap-4 md:grid-cols-2">
            {principles.map((principle, index) => (
              <Reveal as="li" key={principle.title}>
                <div className="surface-card h-full p-6">
                  <span className="font-mono text-[0.72rem] text-accent">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-3 font-serif text-[1.7rem] leading-tight text-ink">
                    {principle.title}
                  </h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-muted">
                    {principle.text}
                  </p>
                  <p className="mt-4 text-sm text-ink-subtle">
                    <span className="font-mono text-[0.7rem] tracking-[0.12em] uppercase">
                      Evidence{' '}
                    </span>
                    {principle.evidence.map((link, i) => (
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
          </ol>
        </div>
      </section>

      <ContactCta />
    </>
  );
}
