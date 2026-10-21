import type { Metadata } from 'next';
import { AdminHeader } from '@/components/admin/admin-header';

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s · Admin · Muhammad Adnan' },
  robots: { index: false, follow: false, nocache: true },
};

// The admin area is request-specific (it reads the session), so it is exempt from
// static-shell validation; every page still streams behind a Suspense boundary.
export const instant = false;

export default function AdminLayout({ children }: LayoutProps<'/admin'>) {
  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <a href="#admin-main" className="skip-link">
        Skip to content
      </a>
      <AdminHeader />
      <main id="admin-main" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
    </div>
  );
}
