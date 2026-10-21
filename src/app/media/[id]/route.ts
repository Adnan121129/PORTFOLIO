import { getMediaData } from '@/lib/media';
import { MEDIA_ID_PATTERN } from '@/lib/writing/schema';

/**
 * Serves images uploaded through the admin media library. Files are stored (already
 * re-encoded to WebP) in the database; ids are random and content never changes for a
 * given id, so responses are cached as immutable.
 */
export async function GET(request: Request, { params }: RouteContext<'/media/[id]'>) {
  const { id } = await params;
  if (!MEDIA_ID_PATTERN.test(id)) return new Response('Not found', { status: 404 });
  const media = await getMediaData(id);
  if (!media) return new Response('Not found', { status: 404 });

  const etag = `"${media.sha256}"`;
  const headers = {
    'Content-Type': media.mime,
    'Cache-Control': 'public, max-age=31536000, immutable',
    ETag: etag,
    'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy': "default-src 'none'; sandbox",
  };
  if (request.headers.get('if-none-match') === etag) {
    return new Response(null, { status: 304, headers });
  }
  return new Response(new Uint8Array(media.data), {
    headers: { ...headers, 'Content-Length': String(media.data.byteLength) },
  });
}
