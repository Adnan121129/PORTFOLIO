import { NextResponse, type NextRequest } from 'next/server';

const SESSION_COOKIE_NAMES = ['__Host-adnan_admin', 'adnan_admin'];

/**
 * Optimistic check only: visitors without a session cookie are redirected to the sign-in
 * page before any admin page renders. Real authorisation happens on the server in every
 * admin page and server action (requireAdmin), which also validates the session itself.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (pathname === '/admin/login') return NextResponse.next();
  const hasCookie = SESSION_COOKIE_NAMES.some((name) => request.cookies.has(name));
  if (hasCookie) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = '/admin/login';
  url.search = `?next=${encodeURIComponent(pathname + search)}`;
  return NextResponse.redirect(url);
}

export const config = {
  // The upload API authenticates itself (and returns JSON), so it is not redirected here.
  matcher: ['/admin', '/admin/((?!login$|api/).*)'],
};
