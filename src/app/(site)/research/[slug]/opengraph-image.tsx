import { formatResearchIndex, getResearch, research } from '@/content/research';
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/og';

export const alt = 'Research by Muhammad Adnan';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return research.map((item) => ({ slug: item.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getResearch(slug);
  return renderOgImage({
    eyebrow: item
      ? `${formatResearchIndex(item.index)} · Research · ${item.status.label}`
      : 'Research',
    title: item?.title ?? 'Research',
  });
}
