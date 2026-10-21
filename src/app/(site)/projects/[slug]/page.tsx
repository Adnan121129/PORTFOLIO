import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CaseStudy } from '@/components/projects/case-study';
import { JsonLd } from '@/components/ui/json-ld';
import { getProject, projects } from '@/content/projects';
import { breadcrumbJsonLd, pageMetadata, softwareSourceCodeJsonLd } from '@/lib/seo';

// Every case study is generated at build time; unknown slugs render the 404 page.
export const ensureStatic = 'navigation';

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<'/projects/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: 'Project not found', robots: { index: false } };
  return {
    ...pageMetadata({
      title: `${project.title} · Case study`,
      description: project.seoDescription,
      path: `/projects/${project.slug}`,
      type: 'article',
    }),
    keywords: project.keywords,
  };
}

export default async function ProjectPage({ params }: PageProps<'/projects/[slug]'>) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Projects', path: '/projects' },
            { name: project.title, path: `/projects/${project.slug}` },
          ]),
          softwareSourceCodeJsonLd({
            name: project.title,
            description: project.seoDescription,
            path: `/projects/${project.slug}`,
            repo: project.repo,
            keywords: project.keywords,
          }),
        ]}
      />
      <CaseStudy project={project} />
    </>
  );
}
