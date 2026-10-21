import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { LoginForm } from '@/components/admin/login-form';
import { getCurrentAdmin } from '@/lib/auth/session';

export const metadata: Metadata = { title: 'Sign in' };

function LoginCard({ withNext }: { withNext: boolean }) {
  return (
    <div className="container-page grid min-h-[calc(100dvh-4rem)] place-items-center py-16">
      <div className="w-full max-w-md">
        <p className="eyebrow">Private area</p>
        <h1 className="mt-4 font-serif text-[2.75rem] leading-none text-ink">Sign in to write</h1>
        <p className="mt-4 text-ink-muted">
          This area is for the site owner to draft, publish and manage articles.
        </p>
        <div className="surface-card mt-8 p-6 sm:p-8">
          {withNext ? (
            <Suspense fallback={<LoginForm />}>
              <LoginForm nextField />
            </Suspense>
          ) : (
            <LoginForm />
          )}
        </div>
      </div>
    </div>
  );
}

/** Already signed in? Go straight to the dashboard. */
async function LoginGate() {
  const admin = await getCurrentAdmin();
  if (admin) redirect('/admin');
  return <LoginCard withNext />;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginCard withNext={false} />}>
      <LoginGate />
    </Suspense>
  );
}
