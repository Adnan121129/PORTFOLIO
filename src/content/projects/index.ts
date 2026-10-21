import type { Project, ProjectCategory } from '../types';
import { chatmate } from './chatmate';
import { greenfactoryBi } from './greenfactory-bi';
import { infravisionAi } from './infravision-ai';
import { linguasi } from './linguasi';
import { muhibbiTeaHouse } from './muhibbi-tea-house';
import { omnimanager } from './omnimanager';
import { plantopsIntelligence } from './plantops-intelligence';
import { theOttomanEmpire } from './the-ottoman-empire';

/** All projects in the order of the source file (P/01 … P/08). */
export const projects: Project[] = [
  plantopsIntelligence,
  infravisionAi,
  linguasi,
  omnimanager,
  greenfactoryBi,
  muhibbiTeaHouse,
  theOttomanEmpire,
  chatmate,
];

/** Homepage order: the four flagship case studies first, as requested in the brief. */
export const featuredProjectSlugs = [
  'plantops-intelligence',
  'greenfactory-bi',
  'infravision-ai',
  'linguasi',
] as const;

export const moreProjectSlugs = [
  'omnimanager',
  'muhibbi-tea-house',
  'the-ottoman-empire',
  'chatmate',
] as const;

export const categoryLabels: Record<ProjectCategory, string> = {
  'mis-bi': 'MIS & BI',
  'ai-ml': 'AI & ML',
  'full-stack': 'Full-stack',
  mobile: 'Mobile',
  'interactive-3d': 'Interactive & 3D',
  desktop: 'Desktop & OOP',
};

export const categoryOrder: ProjectCategory[] = [
  'mis-bi',
  'ai-ml',
  'full-stack',
  'mobile',
  'interactive-3d',
  'desktop',
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getProjectsBySlugs(slugs: readonly string[]): Project[] {
  return slugs.map((slug) => {
    const project = getProject(slug);
    if (!project) throw new Error(`Unknown project slug: ${slug}`);
    return project;
  });
}

/** Neighbouring case study for “Next case study” navigation (wraps around). */
export function getAdjacentProjects(slug: string): { previous: Project; next: Project } {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) throw new Error(`Unknown project slug: ${slug}`);
  const previous = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  return { previous, next };
}

export function formatProjectIndex(index: number): string {
  return `P/${String(index).padStart(2, '0')}`;
}

/** Text used by the project library search. */
export function projectSearchText(project: Project): string {
  return [
    project.title,
    project.subtitle,
    project.tagline,
    project.summary,
    ...project.tags,
    ...project.keywords,
    ...project.categories.map((category) => categoryLabels[category]),
  ]
    .join(' ')
    .toLowerCase();
}
