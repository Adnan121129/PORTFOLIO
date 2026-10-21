import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ResearchDetail } from '@/components/research/research-detail';
import { JsonLd } from '@/components/ui/json-ld';
import { getResearch, research } from '@/content/research';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';

export const ensureStatic = 'navigation';

export function generateStaticParams() {
  return research.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<'/research/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const item = getResearch(slug);
  if (!item) return { title: 'Research not found', robots: { index: false } };
  return {
    ...pageMetadata({
      title: `${item.shortTitle} · Research`,
      description: item.seoDescription,
      path: `/research/${item.slug}`,
      type: 'article',
    }),
    keywords: item.keywords,
  };
}

export default async function ResearchItemPage({ params }: PageProps<'/research/[slug]'>) {
  const { slug } = await params;
  const item = getResearch(slug);
  if (!item) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Research', path: '/research' },
          { name: item.shortTitle, path: `/research/${item.slug}` },
        ])}
      />
      <ResearchDetail item={item} />
    </>
  );
}
