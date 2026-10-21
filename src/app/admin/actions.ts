'use server';

import type { Route } from 'next';
import { updateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { getDummyHash, verifyPassword } from '@/lib/auth/password';
import { checkLoginAllowed, recordLoginAttempt } from '@/lib/auth/rate-limit';
import { clientIp, createSession, destroySession, requireAdmin } from '@/lib/auth/session';
import { findUserByEmail } from '@/lib/auth/users';
import { renderMarkdown, type RenderedMarkdown } from '@/lib/markdown/render';
import { deleteMedia, getMediaDimensions, mediaUsage, updateMediaAlt } from '@/lib/media';
import {
  clearSampleFlag,
  createPost,
  deletePost,
  deleteSamplePosts,
  getPostById,
  isSlugTaken,
  mediaExists,
  setPostStatus,
  updatePost,
} from '@/lib/writing/posts';
import { POSTS_TAG } from '@/lib/writing/queries';
import { MEDIA_ID_PATTERN, parsePostInput, publishIssues } from '@/lib/writing/schema';
import type { FieldIssue, Post } from '@/lib/writing/types';

/*
 * Every action re-checks the session on the server (requireAdmin) — the admin UI being
 * hidden is never treated as authorisation. Next.js also rejects cross-origin action calls.
 */

/* ------------------------------------------------------------------ auth */

export type LoginState = { error?: string; email?: string };

const loginSchema = z.object({
  email: z.email('Enter a valid email address.').max(254),
  password: z.string().min(1, 'Enter your password.').max(256),
  next: z.string().optional(),
});

export async function login(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: String(formData.get('email') ?? '').trim(),
    password: String(formData.get('password') ?? ''),
    next: String(formData.get('next') ?? ''),
  });
  const email = String(formData.get('email') ?? '').trim();
  if (!parsed.success)
    return { error: parsed.error.issues[0]?.message ?? 'Check your details.', email };

  const ip = await clientIp();
  const limit = await checkLoginAllowed(ip, parsed.data.email);
  if (!limit.allowed) {
    return {
      error: `Too many sign-in attempts. Please wait about ${limit.retryAfterMinutes} minute${limit.retryAfterMinutes === 1 ? '' : 's'} and try again.`,
      email,
    };
  }

  const user = await findUserByEmail(parsed.data.email);
  // Verify against a dummy hash for unknown accounts so timing doesn't reveal which emails exist.
  const valid = await verifyPassword(
    parsed.data.password,
    user?.passwordHash ?? (await getDummyHash()),
  );
  if (!user || !valid) {
    await recordLoginAttempt(ip, parsed.data.email, false);
    return { error: 'The email or password is incorrect.', email };
  }

  await recordLoginAttempt(ip, parsed.data.email, true);
  await createSession(user.id);
  // Only same-site admin paths are allowed as the post-login destination (no open redirects).
  const next = parsed.data.next ?? '';
  const safeNext =
    /^\/admin(?:\/[\w-]+)*$/.test(next) && !next.startsWith('/admin/login') ? next : '/admin';
  redirect(safeNext as Route);
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect('/admin/login');
}

/* ----------------------------------------------------------------- posts */

export type SaveResult =
  { ok: true; post: Post; message: string } | { ok: false; issues: FieldIssue[]; message: string };

async function validateForSave(values: unknown, id?: string) {
  const parsed = parsePostInput(values);
  if (!parsed.ok) return { ok: false as const, issues: parsed.issues };
  const issues: FieldIssue[] = [];
  if (await isSlugTaken(parsed.data.slug, id)) {
    issues.push({
      field: 'slug',
      message: 'Another article already uses this URL slug. Choose a different one.',
    });
  }
  if (parsed.data.coverImageId && !(await mediaExists(parsed.data.coverImageId))) {
    issues.push({ field: 'coverImageId', message: 'The selected cover image no longer exists.' });
  }
  if (issues.length) return { ok: false as const, issues };
  return { ok: true as const, data: parsed.data };
}

/** Create or update an article without changing its published/draft status. */
export async function savePost(id: string | null, values: unknown): Promise<SaveResult> {
  await requireAdmin();
  const result = await validateForSave(values, id ?? undefined);
  if (!result.ok)
    return {
      ok: false,
      issues: result.issues,
      message: 'Not saved — please fix the highlighted fields.',
    };

  if (!id) {
    const post = await createPost(result.data);
    updateTag(POSTS_TAG);
    return { ok: true, post, message: 'Draft created.' };
  }
  const updated = await updatePost(id, result.data);
  if (!updated)
    return {
      ok: false,
      issues: [{ field: 'form', message: 'This article no longer exists.' }],
      message: 'Not saved.',
    };
  await clearSampleFlag(id);
  updateTag(POSTS_TAG);
  const post = (await getPostById(id)) ?? updated.post;
  return {
    ok: true,
    post,
    message: post.status === 'published' ? 'Changes saved and published.' : 'Draft saved.',
  };
}

/** Save the latest edits, check publishing requirements, then publish. */
export async function publishPost(id: string | null, values: unknown): Promise<SaveResult> {
  await requireAdmin();
  const result = await validateForSave(values, id ?? undefined);
  if (!result.ok)
    return {
      ok: false,
      issues: result.issues,
      message: 'Not published — please fix the highlighted fields.',
    };
  const requirements = publishIssues(result.data);
  if (requirements.length) {
    return {
      ok: false,
      issues: requirements,
      message: 'Not published yet — a few things are needed first.',
    };
  }

  let postId = id;
  if (!postId) {
    postId = (await createPost(result.data)).id;
  } else {
    const updated = await updatePost(postId, result.data);
    if (!updated)
      return {
        ok: false,
        issues: [{ field: 'form', message: 'This article no longer exists.' }],
        message: 'Not published.',
      };
    await clearSampleFlag(postId);
  }
  const post = await setPostStatus(postId, 'published');
  updateTag(POSTS_TAG);
  if (!post)
    return {
      ok: false,
      issues: [{ field: 'form', message: 'Publishing failed.' }],
      message: 'Not published.',
    };
  return { ok: true, post, message: 'Published — the article is now live.' };
}

export async function unpublishPost(id: string): Promise<SaveResult> {
  await requireAdmin();
  const post = await setPostStatus(id, 'draft');
  updateTag(POSTS_TAG);
  if (!post)
    return {
      ok: false,
      issues: [{ field: 'form', message: 'This article no longer exists.' }],
      message: 'Not changed.',
    };
  return {
    ok: true,
    post,
    message: 'Unpublished — the article is now a draft and hidden from the site.',
  };
}

export async function removePost(id: string): Promise<{ ok: boolean; message: string }> {
  await requireAdmin();
  const removed = await deletePost(id);
  updateTag(POSTS_TAG);
  return removed
    ? { ok: true, message: `Deleted “${removed.title}”.` }
    : { ok: false, message: 'This article was already deleted.' };
}

export async function removeSamplePosts(): Promise<{ ok: boolean; message: string }> {
  await requireAdmin();
  const removed = await deleteSamplePosts();
  updateTag(POSTS_TAG);
  return {
    ok: true,
    message: removed.length ? `Removed ${removed.length} sample post(s).` : 'No sample posts left.',
  };
}

/** Render markdown exactly as the public article page will (sanitised). */
export async function renderPreview(markdown: string): Promise<RenderedMarkdown> {
  await requireAdmin();
  return renderMarkdown(String(markdown ?? '').slice(0, 200_000), {
    resolveImages: getMediaDimensions,
  });
}

/* ----------------------------------------------------------------- media */

export async function saveMediaAlt(
  id: string,
  alt: string,
): Promise<{ ok: boolean; message: string }> {
  await requireAdmin();
  if (!MEDIA_ID_PATTERN.test(id)) return { ok: false, message: 'Unknown image.' };
  await updateMediaAlt(id, String(alt ?? ''));
  updateTag(POSTS_TAG);
  return { ok: true, message: 'Alt text saved.' };
}

export async function removeMedia(
  id: string,
  force = false,
): Promise<{ ok: boolean; message: string; usedBy?: string[] }> {
  await requireAdmin();
  if (!MEDIA_ID_PATTERN.test(id)) return { ok: false, message: 'Unknown image.' };
  const usage = await mediaUsage(id);
  if (usage.length && !force) {
    return {
      ok: false,
      message: `This image is used in ${usage.length} article${usage.length === 1 ? '' : 's'}.`,
      usedBy: usage.map((post) => post.title),
    };
  }
  await deleteMedia(id);
  updateTag(POSTS_TAG);
  return { ok: true, message: 'Image deleted.' };
}
