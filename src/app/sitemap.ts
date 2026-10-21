import type { MetadataRoute } from 'next';
import { projects } from '@/content/projects';
import { research } from '@/content/research';
import { absoluteUrl } from '@/lib/env';
import { getPublishedSlugs } from '@/lib/writing/queries';

/** Public pages only: drafts, admin and preview routes are never listed. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedSlugs();
  const staticRoutes = ['/', '/projects', '/research', '/writing', '/about', '/contact'].map(
    (path) => ({
      url: absoluteUrl(path),
      changeFrequency: (path === '/writing' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
      priority: path === '/' ? 1 : 0.8,
    }),
  );
  return [
    ...staticRoutes,
    ...projects.map((project) => ({
      url: absoluteUrl(`/projects/${project.slug}`),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...research.map((item) => ({
      url: absoluteUrl(`/research/${item.slug}`),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...posts.map((post) => ({
      url: absoluteUrl(`/writing/${post.slug}`),
      lastModified: post.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
