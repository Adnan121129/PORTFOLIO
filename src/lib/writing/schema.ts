import { z } from 'zod';
import { writingCategorySlugs } from '@/content/writing-categories';
import { countWords, SLUG_PATTERN } from '@/lib/utils';
import type { FieldIssue, PostInput } from './types';

export const MEDIA_ID_PATTERN = /^[a-f0-9]{32}$/;

const tagSchema = z.string().trim().min(1).max(32, 'Tags can be at most 32 characters');

/** Validation for saving a post (drafts may be incomplete, but must be well-formed). */
export const postInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Add a title (at least 3 characters).')
    .max(140, 'Keep the title under 140 characters.'),
  slug: z
    .string()
    .trim()
    .min(3, 'The URL slug needs at least 3 characters.')
    .max(80, 'Keep the URL slug under 80 characters.')
    .regex(
      SLUG_PATTERN,
      'Use lowercase letters, numbers and single hyphens only (e.g. my-first-post).',
    ),
  excerpt: z.string().trim().max(320, 'Keep the excerpt under 320 characters.'),
  body: z.string().max(200_000, 'The article is too long to save (200,000 characters maximum).'),
  category: z.enum(writingCategorySlugs, { message: 'Choose a category.' }),
  tags: z
    .array(tagSchema)
    .max(8, 'Use at most 8 tags.')
    .transform((tags) => {
      const seen = new Set<string>();
      return tags.filter((tag) => {
        const key = tag.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }),
  seoTitle: z.string().trim().max(70, 'Search titles are truncated after about 60–70 characters.'),
  seoDescription: z.string().trim().max(170, 'Keep the search description under 170 characters.'),
  coverImageId: z
    .string()
    .regex(MEDIA_ID_PATTERN, 'Choose a cover image from the media library.')
    .nullable(),
  coverAlt: z.string().trim().max(240, 'Keep alt text under 240 characters.'),
  featured: z.boolean(),
});

export type ParsedPostInput = z.infer<typeof postInputSchema>;

export function parsePostInput(
  input: unknown,
): { ok: true; data: PostInput } | { ok: false; issues: FieldIssue[] } {
  const result = postInputSchema.safeParse(input);
  if (result.success) return { ok: true, data: result.data };
  return {
    ok: false,
    issues: result.error.issues.map((issue) => ({
      field: (issue.path[0] as keyof PostInput | undefined) ?? 'form',
      message: issue.message,
    })),
  };
}

/** Extra requirements before a post can be published. */
export function publishIssues(post: PostInput): FieldIssue[] {
  const issues: FieldIssue[] = [];
  if (post.excerpt.trim().length < 20) {
    issues.push({
      field: 'excerpt',
      message: 'Write an excerpt of at least 20 characters before publishing.',
    });
  }
  if (countWords(post.body) < 30) {
    issues.push({
      field: 'body',
      message: 'The article needs at least 30 words before it can be published.',
    });
  }
  if (post.coverImageId && post.coverAlt.trim().length < 3) {
    issues.push({
      field: 'coverAlt',
      message: 'Describe the cover image (alt text) for screen-reader users.',
    });
  }
  return issues;
}

/** Normalise a comma-separated tag string from the editor. */
export function parseTagList(value: string): string[] {
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}
