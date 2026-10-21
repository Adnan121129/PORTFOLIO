import { Plus } from 'lucide-react';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AdminLoading } from '@/components/admin/admin-loading';
import { PostTable } from '@/components/admin/post-table';
import { ButtonLink } from '@/components/ui/button';
import { requireAdmin } from '@/lib/auth/session';
import { listAllPosts } from '@/lib/writing/posts';

export const metadata: Metadata = { title: 'Articles' };

async function Dashboard() {
  const admin = await requireAdmin('/admin');
  const posts = await listAllPosts();
  return (
    <div className="container-page py-10 md:py-14">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow">Signed in as {admin.email}</p>
          <h1 className="mt-3 font-serif text-[clamp(2.4rem,4vw,3.4rem)] leading-none text-ink">
            Articles
          </h1>
        </div>
        <ButtonLink href="/admin/posts/new" variant="primary">
          <Plus size={17} aria-hidden="true" /> New article
        </ButtonLink>
      </div>
      <div className="mt-10">
        <PostTable posts={posts} />
      </div>
    </div>
  );
}

export default function AdminHome() {
  return (
    <Suspense fallback={<AdminLoading label="Loading articles…" />}>
      <Dashboard />
    </Suspense>
  );
}
