import { PenLine } from 'lucide-react';
import Link from 'next/link';
import { getLatestPosts } from '@/lib/writing/queries';
import { ArticleCard } from '../writing/article-card';
import { Reveal, SectionHeading } from '../ui/primitives';

export async function LatestWritingSection() {
  const posts = await getLatestPosts(3);
  return (
    <section aria-labelledby="writing-title" className="border-b border-line py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          id="writing-title"
          index="05"
          eyebrow="Writing"
          title="Notes on data, systems and software."
          description="Explainers, reviews and reflections on data and BI, software engineering, AI/ML, tools and IT."
          action={{ href: '/writing', label: 'All writing' }}
        />
        {posts.length ? (
          <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Reveal as="li" key={post.id}>
                <ArticleCard post={post} />
              </Reveal>
            ))}
          </ul>
        ) : (
          <div className="mt-14 flex flex-col items-start gap-4 rounded-[var(--radius-card)] border border-dashed border-line-strong bg-surface p-8">
            <PenLine size={22} aria-hidden="true" className="text-accent" />
            <p className="font-serif text-2xl text-ink">No articles published yet.</p>
            <p className="max-w-md text-ink-muted">
              New writing will appear here as soon as it is published.{' '}
              <Link href="/writing" className="link-inline">
                Visit the journal
              </Link>
              .
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
