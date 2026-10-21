/** Categories for the Writing / Journal section. Slugs are stored in the database. */
export const writingCategories = [
  {
    slug: 'news-analysis',
    label: 'News & Analysis',
    description: 'Context on technology and IT news.',
  },
  {
    slug: 'reviews',
    label: 'Reviews',
    description: 'Hands-on reviews of tools, products and platforms.',
  },
  {
    slug: 'software-engineering',
    label: 'Software Engineering',
    description: 'Architecture, backend systems and engineering practice.',
  },
  {
    slug: 'data-bi',
    label: 'Data & BI',
    description: 'Data analysis, reporting, KPIs and business intelligence.',
  },
  {
    slug: 'ai-ml',
    label: 'AI & ML',
    description: 'Applied machine learning, computer vision and AI systems.',
  },
  {
    slug: 'it-infrastructure',
    label: 'IT & Infrastructure',
    description: 'Operations, deployment and IT topics.',
  },
  { slug: 'tools', label: 'Tools', description: 'Notes on the tools in a day-to-day workflow.' },
  {
    slug: 'tutorials',
    label: 'Tutorials & Explainers',
    description: 'Step-by-step guides and explainers.',
  },
  {
    slug: 'reflections',
    label: 'Reflections',
    description: 'Professional notes and lessons learned.',
  },
] as const;

export type WritingCategorySlug = (typeof writingCategories)[number]['slug'];

export const writingCategorySlugs = writingCategories.map((category) => category.slug) as [
  WritingCategorySlug,
  ...WritingCategorySlug[],
];

export function isWritingCategory(value: unknown): value is WritingCategorySlug {
  return typeof value === 'string' && writingCategories.some((category) => category.slug === value);
}

export function categoryLabel(slug: string): string {
  return writingCategories.find((category) => category.slug === slug)?.label ?? slug;
}
