import { ViewTransition } from 'react';

/**
 * Templates remount on every navigation, so wrapping each page here gives a short
 * enter/exit transition between routes via the View Transitions API. Browsers without
 * support (and visitors who prefer reduced motion) simply navigate without animation.
 */
export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-in" exit="page-out" default="none">
      {children}
    </ViewTransition>
  );
}
