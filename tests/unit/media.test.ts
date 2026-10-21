import sharp from 'sharp';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { closeDb } from '@/lib/db/client';
import {
  MAX_UPLOAD_BYTES,
  MediaError,
  deleteMedia,
  getMediaData,
  mediaUsage,
  processImage,
  saveImage,
} from '@/lib/media';
import { createPost, getPostById } from '@/lib/writing/posts';
import { useTemporaryDatabase } from './helpers';

let cleanup: () => void;
beforeAll(() => {
  cleanup = useTemporaryDatabase();
});
afterAll(() => {
  closeDb();
  cleanup();
});

async function jpegWithExif(width = 64, height = 48) {
  return sharp({ create: { width, height, channels: 3, background: '#07707f' } })
    .jpeg()
    .withExif({
      IFD0: { Copyright: 'Test', Artist: 'Someone' },
      IFD3: { GPSLatitudeRef: 'N', GPSLatitude: '23/1 48/1 0/1' },
    })
    .toBuffer();
}

describe('image processing', () => {
  it('re-encodes uploads as WebP and strips EXIF/GPS metadata', async () => {
    const input = await jpegWithExif();
    expect((await sharp(input).metadata()).exif).toBeDefined();
    const output = await processImage(input);
    const meta = await sharp(output.data).metadata();
    expect(meta.format).toBe('webp');
    expect(meta.exif).toBeUndefined();
    expect([output.width, output.height]).toEqual([64, 48]);
  });

  it('downsizes very wide images to at most 2000px', async () => {
    const wide = await sharp({
      create: { width: 3000, height: 1000, channels: 3, background: '#000' },
    })
      .png()
      .toBuffer();
    const output = await processImage(wide);
    expect([output.width, output.height]).toEqual([2000, 667]);
  });

  it('rejects SVG, non-images, empty and oversized files', async () => {
    const svg = Buffer.from(
      '<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"><rect width="10" height="10"/></svg>',
    );
    await expect(processImage(svg)).rejects.toBeInstanceOf(MediaError);
    await expect(processImage(Buffer.from('not an image at all'))).rejects.toThrow(
      /could not be read/,
    );
    await expect(processImage(Buffer.alloc(0))).rejects.toThrow(/empty/);
    await expect(processImage(Buffer.alloc(MAX_UPLOAD_BYTES + 1))).rejects.toMatchObject({
      status: 413,
    });
  });
});

describe('media library', () => {
  it('stores images in the database, de-duplicates identical uploads and sanitises names', async () => {
    const input = await jpegWithExif(20, 10);
    const first = await saveImage(
      { name: '../../My Photo (1).JPG', data: input },
      '  A teal rectangle  ',
    );
    expect(first.id).toMatch(/^[a-f0-9]{32}$/);
    expect(first.filename).toBe('My-Photo-1.webp');
    expect(first.alt).toBe('A teal rectangle');
    expect(first.url).toBe(`/media/${first.id}`);
    const again = await saveImage({ name: 'copy.jpg', data: input });
    expect(again.id).toBe(first.id);
    const stored = await getMediaData(first.id);
    expect(stored?.mime).toBe('image/webp');
    expect(stored?.data.byteLength).toBeGreaterThan(0);
  });

  it('reports where an image is used and clears covers when it is deleted', async () => {
    const image = await saveImage({ name: 'cover.png', data: await jpegWithExif(30, 30) });
    const post = await createPost({
      title: 'Post with a cover',
      slug: 'post-with-a-cover',
      excerpt: 'An excerpt that is long enough.',
      body: `Body with an inline image ![x](/media/${image.id}).`,
      category: 'tools',
      tags: [],
      seoTitle: '',
      seoDescription: '',
      coverImageId: image.id,
      coverAlt: 'Cover',
      featured: false,
    });
    expect((await mediaUsage(image.id)).map((usage) => usage.id)).toEqual([post.id]);
    await deleteMedia(image.id);
    expect(await getMediaData(image.id)).toBeNull();
    const after = await getPostById(post.id);
    expect(after?.coverImageId).toBeNull();
    expect(after?.cover).toBeNull();
  });
});
