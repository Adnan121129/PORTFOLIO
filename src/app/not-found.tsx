import type { Metadata } from 'next';
import { NotFoundContent } from '@/components/layout/not-found-content';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

/** Rendered for URLs that match no route at all; includes the full site chrome. */
export default function RootNotFound() {
  return (
    <div className="grain flex min-h-dvh flex-col">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <NotFoundContent />
      </main>
      <SiteFooter />
    </div>
  );
}
