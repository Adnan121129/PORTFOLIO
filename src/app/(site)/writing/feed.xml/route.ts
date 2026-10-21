import { site } from '@/content/site';
import { categoryLabel } from '@/content/writing-categories';
import { absoluteUrl } from '@/lib/env';
import { getFeedPosts } from '@/lib/writing/queries';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** RSS 2.0 feed of published articles (drafts are never included). */
export async function GET() {
  const posts = await getFeedPosts(30);
  const feedUrl = absoluteUrl('/writing/feed.xml');
  const items = posts
    .map((post) => {
      const url = absoluteUrl(`/writing/${post.slug}`);
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <category>${escapeXml(categoryLabel(post.category))}</category>
      ${post.publishedAt ? `<pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>` : ''}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${site.name} — Writing`)}</title>
    <link>${escapeXml(absoluteUrl('/writing'))}</link>
    <description>${escapeXml('Notes on data, business intelligence, software engineering and AI.')}</description>
    <language>en</language>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
