import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AdminLoading } from '@/components/admin/admin-loading';
import { MediaLibrary } from '@/components/admin/media-library';
import { requireAdmin } from '@/lib/auth/session';
import { listMedia } from '@/lib/media';

export const metadata: Metadata = { title: 'Media' };

async function Media() {
  await requireAdmin('/admin/media');
  const media = await listMedia();
  return (
    <div className="container-page py-10 md:py-14">
      <p className="eyebrow">Images for articles</p>
      <h1 className="mt-3 font-serif text-[clamp(2.4rem,4vw,3.4rem)] leading-none text-ink">
        Media library
      </h1>
      <div className="mt-10">
        <MediaLibrary media={media} />
      </div>
    </div>
  );
}

export default function MediaPage() {
  return (
    <Suspense fallback={<AdminLoading label="Loading media…" />}>
      <Media />
    </Suspense>
  );
}
