import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { AdminLoading } from '@/components/admin/admin-loading';
import { FreshOnNavigation } from '@/components/admin/fresh-on-navigation';
import { PostEditor } from '@/components/admin/post-editor';
import { requireAdmin } from '@/lib/auth/session';
import { listMedia } from '@/lib/media';
import { getPostById } from '@/lib/writing/posts';

export const metadata: Metadata = { title: 'Edit article' };

const CREATED_NOTICES: Record<string, string> = {
  draft: 'Draft created.',
  published: 'Published — the article is now live.',
};

async function EditPost({ params, searchParams }: PageProps<'/admin/posts/[id]'>) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  await requireAdmin(`/admin/posts/${id}`);
  const [post, media] = await Promise.all([getPostById(id), listMedia()]);
  if (!post) notFound();
  const created = typeof query.created === 'string' ? CREATED_NOTICES[query.created] : undefined;
  return (
    <FreshOnNavigation>
      <PostEditor key={post.id} initial={post} media={media} notice={created} />
    </FreshOnNavigation>
  );
}

export default function EditPostPage(props: PageProps<'/admin/posts/[id]'>) {
  return (
    <Suspense fallback={<AdminLoading label="Loading article…" />}>
      <EditPost {...props} />
    </Suspense>
  );
}
