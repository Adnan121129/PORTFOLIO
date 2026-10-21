/**
 * Canonical site origin used for metadata, sitemap, RSS and share links.
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://muhammadadnan.dev).
 */
export function siteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/+$/, '');
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/+$/, '')}`;
  return 'http://localhost:3000';
}

export function absoluteUrl(path = '/'): string {
  return new URL(path, `${siteUrl()}/`).toString();
}
