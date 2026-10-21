import { categoryLabel } from '@/content/writing-categories';
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/og';
import { getPublishedArticle, getPublishedSlugs } from '@/lib/writing/queries';

export const alt = 'Article by Muhammad Adnan';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs();
  return slugs.length ? slugs.map(({ slug }) => ({ slug })) : [{ slug: '__no-published-posts__' }];
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);
  return renderOgImage({
    eyebrow: article
      ? `Writing · ${categoryLabel(article.post.category)} · ${article.post.readingMinutes} min read`
      : 'Writing',
    title: article?.post.title ?? 'Writing by Muhammad Adnan',
  });
}
