import { Suspense } from 'react';
import { ProjectCard } from '@/components/projects/project-card';
import {
  ProjectLibrary,
  ProjectLibraryView,
  type LibraryItem,
} from '@/components/projects/project-library';
import { JsonLd } from '@/components/ui/json-ld';
import { PageIntro } from '@/components/ui/primitives';
import { categoryLabels, categoryOrder, projects, projectSearchText } from '@/content/projects';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Projects',
  description:
    'Case studies by Muhammad Adnan: PlantOps Intelligence, GreenFactory BI, InfraVision AI, LinguaSI, OmniManager, Muhibbi Tea House, The Ottoman Empire and ChatMate — MIS, BI, applied AI and full-stack engineering.',
  path: '/projects',
});

export default function ProjectsPage() {
  const items: LibraryItem[] = projects.map((project) => ({
    slug: project.slug,
    title: project.title,
    searchText: projectSearchText(project),
    categories: project.categories,
  }));
  const cards = Object.fromEntries(
    projects.map((project) => [
      project.slug,
      <ProjectCard key={project.slug} project={project} headingLevel="h2" />,
    ]),
  );
  const categories = categoryOrder
    .filter((category) => projects.some((project) => project.categories.includes(category)))
    .map((category) => ({ value: category, label: categoryLabels[category] }));

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Projects', path: '/projects' },
        ])}
      />
      <PageIntro eyebrow="Selected projects" title="Projects">
        <p>
          Eight case studies — from management information systems and BI platforms to applied
          computer vision, adaptive learning, SaaS billing, real-time ordering and interactive
          history. Search or filter, then open any case study for the full architecture, workflows
          and testing.
        </p>
      </PageIntro>
      <section aria-label="Project library" className="container-page py-12 md:py-16">
        <Suspense
          fallback={<ProjectLibraryView items={items} cards={cards} categories={categories} />}
        >
          <ProjectLibrary items={items} cards={cards} categories={categories} />
        </Suspense>
        <p className="mt-10 font-mono text-xs tracking-wide text-ink-subtle">
          Illustrations on these cards are representative visuals drawn from each project’s
          documented features, not screenshots of deployed products.
        </p>
      </section>
    </>
  );
}
