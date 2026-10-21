import 'server-only';
import type { Row } from '@libsql/client';
import { createHash, randomBytes } from 'node:crypto';
import sharp from 'sharp';
import { getDb } from '@/lib/db/client';
import { mediaUrl } from '@/lib/writing/posts';
import type { MediaItem } from '@/lib/writing/types';

/** Raw upload limit. Kept under common serverless request-body limits (~4.5 MB). */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
const MAX_INPUT_PIXELS = 40_000_000;
const MAX_WIDTH = 2000;
const ALLOWED_FORMATS = new Set(['jpeg', 'png', 'webp', 'gif', 'avif']);

export class MediaError extends Error {
  constructor(
    message: string,
    readonly status = 400,
  ) {
    super(message);
  }
}

function mapMedia(row: Row): MediaItem {
  const id = String(row.id);
  return {
    id,
    url: mediaUrl(id),
    filename: String(row.filename),
    mime: String(row.mime),
    width: Number(row.width),
    height: Number(row.height),
    bytes: Number(row.bytes),
    alt: String(row.alt ?? ''),
    createdAt: String(row.created_at),
  };
}

function safeFilename(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? 'image';
  return (
    base
      .replace(/[^\w.-]+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 120) || 'image'
  );
}

/**
 * Validate and re-encode an uploaded image. Decoding with sharp verifies the file really
 * is an image (not just its extension or MIME type); re-encoding to WebP strips EXIF/GPS
 * metadata and any trailing payload. SVG is rejected because it can carry scripts.
 */
export async function processImage(
  input: Buffer,
): Promise<{ data: Buffer; width: number; height: number }> {
  if (input.byteLength === 0) throw new MediaError('The file is empty.');
  if (input.byteLength > MAX_UPLOAD_BYTES) {
    throw new MediaError('Images must be 4 MB or smaller.', 413);
  }
  let metadata: Awaited<ReturnType<ReturnType<typeof sharp>['metadata']>>;
  try {
    metadata = await sharp(input, { limitInputPixels: MAX_INPUT_PIXELS }).metadata();
  } catch {
    throw new MediaError(
      'That file could not be read as an image. Use JPEG, PNG, WebP, GIF or AVIF.',
    );
  }
  if (!metadata.format || !ALLOWED_FORMATS.has(metadata.format)) {
    throw new MediaError('Unsupported image type. Use JPEG, PNG, WebP, GIF or AVIF.');
  }
  const animated = (metadata.pages ?? 1) > 1;
  try {
    const { data, info } = await sharp(input, { limitInputPixels: MAX_INPUT_PIXELS, animated })
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: 82, effort: 4 })
      .toBuffer({ resolveWithObject: true });
    const height =
      animated && metadata.pageHeight
        ? Math.round((metadata.pageHeight * info.width) / (metadata.width ?? info.width))
        : info.height;
    return { data, width: info.width, height };
  } catch {
    throw new MediaError(
      'The image could not be processed. Try exporting it again as JPEG or PNG.',
    );
  }
}

export async function saveImage(
  file: { name: string; data: Buffer },
  alt = '',
): Promise<MediaItem> {
  const processed = await processImage(file.data);
  const sha256 = createHash('sha256').update(processed.data).digest('hex');
  const db = await getDb();

  const existing = await db.execute({
    sql: 'SELECT id, filename, mime, width, height, bytes, alt, created_at FROM media WHERE sha256 = ?',
    args: [sha256],
  });
  if (existing.rows[0]) return mapMedia(existing.rows[0]);

  const id = randomBytes(16).toString('hex');
  const now = new Date().toISOString();
  const stem = safeFilename(file.name)
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/^[-.]+|[-.]+$/g, '');
  const filename = `${stem || 'image'}.webp`;
  await db.execute({
    sql: `INSERT INTO media (id, filename, mime, width, height, bytes, sha256, alt, data, created_at)
          VALUES (?, ?, 'image/webp', ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      filename,
      processed.width,
      processed.height,
      processed.data.byteLength,
      sha256,
      alt.trim().slice(0, 240),
      processed.data,
      now,
    ],
  });
  return {
    id,
    url: mediaUrl(id),
    filename,
    mime: 'image/webp',
    width: processed.width,
    height: processed.height,
    bytes: processed.data.byteLength,
    alt: alt.trim().slice(0, 240),
    createdAt: now,
  };
}

export async function listMedia(): Promise<MediaItem[]> {
  const db = await getDb();
  const result = await db.execute(
    'SELECT id, filename, mime, width, height, bytes, alt, created_at FROM media ORDER BY created_at DESC',
  );
  return result.rows.map(mapMedia);
}

export async function getMediaMeta(id: string): Promise<MediaItem | null> {
  const db = await getDb();
  const result = await db.execute({
    sql: 'SELECT id, filename, mime, width, height, bytes, alt, created_at FROM media WHERE id = ?',
    args: [id],
  });
  return result.rows[0] ? mapMedia(result.rows[0]) : null;
}

/** Dimensions for many media ids at once (used to size images inside articles). */
export async function getMediaDimensions(
  ids: string[],
): Promise<Map<string, { width: number; height: number; alt: string }>> {
  const unique = [...new Set(ids)].slice(0, 100);
  if (!unique.length) return new Map();
  const db = await getDb();
  const result = await db.execute({
    sql: `SELECT id, width, height, alt FROM media WHERE id IN (${unique.map(() => '?').join(',')})`,
    args: unique,
  });
  return new Map(
    result.rows.map((row) => [
      String(row.id),
      { width: Number(row.width), height: Number(row.height), alt: String(row.alt ?? '') },
    ]),
  );
}

export async function getMediaData(
  id: string,
): Promise<{ data: Uint8Array; mime: string; sha256: string } | null> {
  const db = await getDb();
  const result = await db.execute({
    sql: 'SELECT data, mime, sha256 FROM media WHERE id = ?',
    args: [id],
  });
  const row = result.rows[0];
  if (!row) return null;
  const raw = row.data as ArrayBuffer | Uint8Array;
  return {
    data: raw instanceof Uint8Array ? raw : new Uint8Array(raw),
    mime: String(row.mime),
    sha256: String(row.sha256),
  };
}

export async function updateMediaAlt(id: string, alt: string): Promise<void> {
  const db = await getDb();
  await db.execute({
    sql: 'UPDATE media SET alt = ? WHERE id = ?',
    args: [alt.trim().slice(0, 240), id],
  });
}

/** Posts that use an image as their cover or inside their body. */
export async function mediaUsage(id: string): Promise<{ id: string; title: string }[]> {
  const db = await getDb();
  const result = await db.execute({
    sql: `SELECT id, title FROM posts WHERE cover_image_id = ? OR instr(body, ?) > 0`,
    args: [id, `/media/${id}`],
  });
  return result.rows.map((row) => ({ id: String(row.id), title: String(row.title) }));
}

export async function deleteMedia(id: string): Promise<void> {
  const db = await getDb();
  await db.execute({ sql: 'DELETE FROM media WHERE id = ?', args: [id] });
}
