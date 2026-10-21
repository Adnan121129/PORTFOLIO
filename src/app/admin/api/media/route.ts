import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth/session';
import { MAX_UPLOAD_BYTES, MediaError, saveImage } from '@/lib/media';

/**
 * Image upload for the admin editor (multipart/form-data, field "file", optional "alt").
 * Requires a valid admin session and a same-origin request; the image is decoded and
 * re-encoded server-side before it is stored (see lib/media.ts).
 */
export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  if (!origin || !host || new URL(origin).host !== host) {
    return NextResponse.json(
      { ok: false, message: 'Cross-origin uploads are not allowed.' },
      { status: 403 },
    );
  }

  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json(
      { ok: false, message: 'Your session has expired. Please sign in again.' },
      { status: 401 },
    );
  }

  const declaredLength = Number(request.headers.get('content-length') ?? 0);
  if (declaredLength > MAX_UPLOAD_BYTES + 64 * 1024) {
    return NextResponse.json(
      { ok: false, message: 'Images must be 4 MB or smaller.' },
      { status: 413 },
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, message: 'The upload could not be read.' },
      { status: 400 },
    );
  }
  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, message: 'Choose an image to upload.' }, { status: 400 });
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { ok: false, message: 'Images must be 4 MB or smaller.' },
      { status: 413 },
    );
  }

  try {
    const media = await saveImage(
      { name: file.name, data: Buffer.from(await file.arrayBuffer()) },
      String(form.get('alt') ?? ''),
    );
    return NextResponse.json({ ok: true, media }, { status: 201 });
  } catch (error) {
    if (error instanceof MediaError) {
      return NextResponse.json({ ok: false, message: error.message }, { status: error.status });
    }
    console.error('Upload failed', error);
    return NextResponse.json(
      { ok: false, message: 'The upload failed. Please try again.' },
      { status: 500 },
    );
  }
}
