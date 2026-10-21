import type { Element, Root } from 'hast';
import { createHighlighterCore, type HighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

/**
 * Server-side syntax highlighting with Shiki's JavaScript regex engine (no WASM) and a
 * small set of languages. The theme pair was chosen because every token colour reaches
 * WCAG AA contrast (4.5:1) on the site's code background in both colour schemes. Output carries both light and dark colours as CSS variables
 * (--shiki-light / --shiki-dark); globals.css picks the one for the active theme.
 */

const LANG_ALIASES: Record<string, string> = {
  ts: 'typescript',
  js: 'javascript',
  py: 'python',
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
  yml: 'yaml',
  md: 'markdown',
  'c++': 'cpp',
};

export const SUPPORTED_LANGUAGES = [
  'typescript',
  'tsx',
  'javascript',
  'python',
  'sql',
  'bash',
  'json',
  'html',
  'css',
  'dart',
  'php',
  'cpp',
  'yaml',
  'diff',
  'markdown',
  'dax',
] as const;

let highlighter: Promise<HighlighterCore> | undefined;

function getHighlighter(): Promise<HighlighterCore> {
  highlighter ??= createHighlighterCore({
    themes: [
      import('shiki/themes/github-light-high-contrast.mjs'),
      import('shiki/themes/github-dark-default.mjs'),
    ],
    langs: [
      import('shiki/langs/typescript.mjs'),
      import('shiki/langs/tsx.mjs'),
      import('shiki/langs/javascript.mjs'),
      import('shiki/langs/python.mjs'),
      import('shiki/langs/sql.mjs'),
      import('shiki/langs/bash.mjs'),
      import('shiki/langs/json.mjs'),
      import('shiki/langs/html.mjs'),
      import('shiki/langs/css.mjs'),
      import('shiki/langs/dart.mjs'),
      import('shiki/langs/php.mjs'),
      import('shiki/langs/cpp.mjs'),
      import('shiki/langs/yaml.mjs'),
      import('shiki/langs/diff.mjs'),
      import('shiki/langs/markdown.mjs'),
      import('shiki/langs/dax.mjs'),
    ],
    engine: createJavaScriptRegexEngine({ forgiving: true }),
  });
  return highlighter;
}

export function normaliseLanguage(lang: string | undefined): string | null {
  if (!lang) return null;
  const key = lang.toLowerCase();
  const resolved = LANG_ALIASES[key] ?? key;
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(resolved) ? resolved : null;
}

/** Returns a highlighted <pre> element, or null when the language is unsupported. */
export async function highlightToHast(code: string, lang: string): Promise<Element | null> {
  const language = normaliseLanguage(lang);
  if (!language) return null;
  const shiki = await getHighlighter();
  const root = shiki.codeToHast(code, {
    lang: language,
    themes: { light: 'github-light-high-contrast', dark: 'github-dark-default' },
    defaultColor: false,
  }) as Root;
  const pre = root.children.find(
    (node): node is Element => node.type === 'element' && node.tagName === 'pre',
  );
  return pre ?? null;
}
