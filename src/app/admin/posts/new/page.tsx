import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AdminLoading } from '@/components/admin/admin-loading';
import { FreshOnNavigation } from '@/components/admin/fresh-on-navigation';
import { PostEditor } from '@/components/admin/post-editor';
import { requireAdmin } from '@/lib/auth/session';
import { listMedia } from '@/lib/media';

export const metadata: Metadata = { title: 'New article' };

async function NewPost() {
  await requireAdmin('/admin/posts/new');
  const media = await listMedia();
  return (
    <FreshOnNavigation>
      <PostEditor initial={null} media={media} />
    </FreshOnNavigation>
  );
}

export default function NewPostPage() {
  return (
    <Suspense fallback={<AdminLoading label="Loading editor…" />}>
      <NewPost />
    </Suspense>
  );
}
