import GithubSlugger from 'github-slugger';
import type { Element, ElementContent, Root, RootContent, Text } from 'hast';
import { toString as hastToString } from 'hast-util-to-string';
import rehypeSanitize, { defaultSchema, type Options as SanitizeSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { visit, SKIP } from 'unist-util-visit';
import { countWords } from '@/lib/utils';
import { highlightToHast, normaliseLanguage } from './highlight';

export type TocEntry = { id: string; text: string; depth: 2 | 3 };

export type RenderedMarkdown = {
  html: string;
  toc: TocEntry[];
  words: number;
};

export type ImageResolver = (
  ids: string[],
) => Promise<Map<string, { width: number; height: number; alt: string }>>;

const MEDIA_SRC = /^\/media\/([a-f0-9]{32})$/;
const CALLOUT = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i;

/*
 * Sanitisation: raw HTML in markdown is never passed through (remark-rehype drops it),
 * and rehype-sanitize (GitHub's schema) removes unsafe URLs such as javascript:.
 * Enhancements below run *after* sanitising and only add trusted structure.
 */
const sanitizeSchema: SanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [
      ...(defaultSchema.attributes?.code ?? []),
      ['className', /^language-[\w+-]+$/] as [string, RegExp],
    ],
  },
};

function el(
  tagName: string,
  properties: Element['properties'],
  children: ElementContent[] = [],
): Element {
  return { type: 'element', tagName, properties, children };
}

function textNode(value: string): Text {
  return { type: 'text', value };
}

function isElement(node: RootContent | ElementContent | undefined, tag?: string): node is Element {
  return Boolean(node && node.type === 'element' && (!tag || node.tagName === tag));
}

function rehypeCallouts() {
  return (tree: Root) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'blockquote' || !parent || index === undefined) return;
      const firstPara = node.children.find((child) => isElement(child, 'p')) as Element | undefined;
      const firstText = firstPara?.children[0];
      if (!firstPara || !firstText || firstText.type !== 'text') return;
      const match = CALLOUT.exec(firstText.value);
      if (!match) return;
      const kind = match[1].toLowerCase();
      firstText.value = firstText.value.slice(match[0].length);
      if (!firstText.value.trim() && firstPara.children.length === 1) {
        node.children = node.children.filter((child) => child !== firstPara);
      }
      const title = kind.charAt(0).toUpperCase() + kind.slice(1);
      const aside = el(
        'aside',
        { className: ['callout'], dataKind: kind, role: 'note', ariaLabel: title },
        [
          el('p', { className: ['callout-title'] }, [textNode(title)]),
          ...node.children.filter((child) => !(child.type === 'text' && !child.value.trim())),
        ],
      );
      parent.children[index] = aside;
      return SKIP;
    });
  };
}

function rehypeHeadings(toc: TocEntry[]) {
  return () => (tree: Root) => {
    const slugger = new GithubSlugger();
    visit(tree, 'element', (node) => {
      if (!/^h[1-6]$/.test(node.tagName)) return;
      // Articles start at h2 (the page title is the only h1).
      if (node.tagName === 'h1') node.tagName = 'h2';
      const text = hastToString(node).trim();
      if (!text) return;
      const id = slugger.slug(text);
      node.properties = { ...node.properties, id };
      const depth = Number(node.tagName.slice(1));
      if (depth === 2 || depth === 3) toc.push({ id, text, depth });
      node.children.push(
        el(
          'a',
          { className: ['heading-anchor'], href: `#${id}`, ariaLabel: `Link to section: ${text}` },
          [textNode('#')],
        ),
      );
    });
  };
}

function rehypeLinksAndTables() {
  return (tree: Root) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName === 'a') {
        // Links whose URL was removed by the sanitiser (e.g. javascript:) become plain text.
        if (node.properties?.href === undefined && parent && index !== undefined) {
          parent.children.splice(index, 1, ...node.children);
          return [SKIP, index];
        }
        const href = String(node.properties?.href ?? '');
        if (/^https?:\/\//i.test(href)) {
          node.properties = {
            ...node.properties,
            target: '_blank',
            rel: ['noopener', 'noreferrer'],
          };
          node.children.push(
            el('span', { className: ['sr-only'] }, [textNode(' (opens in a new tab)')]),
          );
        }
      }
      if (node.tagName === 'table' && parent && index !== undefined) {
        parent.children[index] = el(
          'div',
          { className: ['table-wrap'], tabIndex: 0, role: 'region', ariaLabel: 'Scrollable table' },
          [node],
        );
        return SKIP;
      }
    });
  };
}

function rehypeImages(resolve?: ImageResolver) {
  return () => async (tree: Root) => {
    const images: Element[] = [];
    visit(tree, 'element', (node) => {
      if (node.tagName === 'img') images.push(node);
    });
    const ids = images
      .map((image) => MEDIA_SRC.exec(String(image.properties?.src ?? ''))?.[1])
      .filter((id): id is string => Boolean(id));
    const dimensions = resolve && ids.length ? await resolve(ids) : new Map();

    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'img' || !parent || index === undefined) return;
      const src = String(node.properties?.src ?? '');
      const media = MEDIA_SRC.exec(src);
      const alt = String(node.properties?.alt ?? '');
      if (!src) {
        // The sanitiser removed an unsafe or unsupported URL (e.g. data:); keep only the alt text.
        parent.children.splice(index, 1, ...(alt ? [textNode(alt)] : []));
        return [SKIP, index];
      }
      if (!media) {
        // External images would be blocked by the site's Content Security Policy; link to them instead.
        parent.children[index] = el(
          'a',
          { href: src, target: '_blank', rel: ['noopener', 'noreferrer'] },
          [textNode(alt ? `External image: ${alt}` : 'External image')],
        );
        return SKIP;
      }
      const meta = dimensions.get(media[1]);
      node.properties = {
        ...node.properties,
        alt: alt || meta?.alt || '',
        loading: 'lazy',
        decoding: 'async',
        ...(meta ? { width: meta.width, height: meta.height } : {}),
      };
    });

    // A paragraph that only holds an image becomes a <figure>, with the title as caption.
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'p' || !parent || index === undefined) return;
      const meaningful = node.children.filter(
        (child) => !(child.type === 'text' && !child.value.trim()),
      );
      if (meaningful.length !== 1 || !isElement(meaningful[0], 'img')) return;
      const image = meaningful[0];
      const caption = String(image.properties?.title ?? '').trim();
      const figure = el('figure', {}, [image]);
      if (caption) figure.children.push(el('figcaption', {}, [textNode(caption)]));
      parent.children[index] = figure;
      return SKIP;
    });
  };
}

function rehypeHighlight() {
  return async (tree: Root) => {
    const jobs: Promise<void>[] = [];
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'pre' || !parent || index === undefined) return;
      const code = node.children.find((child): child is Element => isElement(child, 'code'));
      if (!code) return;
      const className = (code.properties?.className as string[] | undefined) ?? [];
      const lang = className
        .find((name) => name.startsWith('language-'))
        ?.slice('language-'.length);
      const source = hastToString(code).replace(/\n$/, '');
      const label = normaliseLanguage(lang) ?? lang ?? '';
      const wrapperIndex = index;
      const wrap = (pre: Element) => {
        parent.children[wrapperIndex] = el(
          'div',
          { className: ['code-block'], ...(label ? { dataLanguage: label } : {}) },
          [pre],
        );
      };
      jobs.push(
        (lang ? highlightToHast(source, lang) : Promise.resolve(null)).then((highlighted) => {
          if (highlighted) {
            // Shiki already makes the <pre> focusable (tabindex="0") for keyboard scrolling.
            wrap(highlighted);
          } else {
            node.properties = { ...node.properties, tabIndex: 0 };
            wrap(node);
          }
        }),
      );
      return SKIP;
    });
    await Promise.all(jobs);
  };
}

/**
 * Render article markdown to sanitised HTML with heading anchors, a table of contents,
 * callouts (> [!NOTE]), figures, accessible tables and syntax-highlighted code.
 */
export async function renderMarkdown(
  markdown: string,
  options: { resolveImages?: ImageResolver } = {},
): Promise<RenderedMarkdown> {
  const toc: TocEntry[] = [];
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: false })
    .use(rehypeSanitize, sanitizeSchema)
    .use(rehypeCallouts)
    .use(rehypeHeadings(toc))
    .use(rehypeImages(options.resolveImages))
    .use(rehypeLinksAndTables)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(markdown);
  return { html: String(file), toc, words: countWords(markdown) };
}
