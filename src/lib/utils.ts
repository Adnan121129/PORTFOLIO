/** Join class names, skipping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

const shortDateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

/** Format an ISO timestamp as "12 March 2026" (UTC, so server and client agree). */
export function formatDate(iso: string, style: 'long' | 'short' = 'long'): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return (style === 'long' ? dateFormatter : shortDateFormatter).format(date);
}

/** Lowercase, ASCII, hyphen-separated slug. */
export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '');
}

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Words in a markdown string, ignoring code fences, images and link URLs. */
export function countWords(markdown: string): number {
  const text = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~|-]/g, ' ');
  const words = text.match(/[\p{L}\p{N}'’]+/gu);
  return words ? words.length : 0;
}

/** Reading time at ~220 words per minute, never less than one minute. */
export function readingMinutes(markdown: string): number {
  return Math.max(1, Math.round(countWords(markdown) / 220));
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}
