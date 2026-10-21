import { BackToTop } from '@/components/layout/back-to-top';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { HashLinkHandler } from '@/components/layout/hash-link-handler';
import { CursorFollower } from '@/components/motion/cursor-follower';

/** Public site chrome: skip link, header, main landmark, footer and motion helpers. */
export default function SiteLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className="grain flex min-h-dvh flex-col">
      <span id="top" tabIndex={-1} className="sr-only focus:outline-none">
        Top of page
      </span>
      <div
        id="top-sentinel"
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 h-[140vh] w-px"
      />
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <SiteFooter />
      <BackToTop />
      <CursorFollower />
      <HashLinkHandler />
    </div>
  );
}
