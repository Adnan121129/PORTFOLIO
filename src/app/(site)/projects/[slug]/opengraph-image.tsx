import { categoryLabels, formatProjectIndex, getProject, projects } from '@/content/projects';
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/og';

export const alt = 'Project case study by Muhammad Adnan';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  return renderOgImage({
    eyebrow: project
      ? `${formatProjectIndex(project.index)} · Case study · ${project.categories.map((c) => categoryLabels[c]).join(' · ')}`
      : 'Case study',
    title: project?.title ?? 'Project',
    subtitle: project?.tagline,
  });
}
