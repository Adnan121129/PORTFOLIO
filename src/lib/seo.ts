import type { Metadata } from 'next';
import { EMAIL, GITHUB_URL, LINKEDIN_URL, site } from '@/content/site';
import { absoluteUrl } from './env';

type PageMetaInput = {
  title: string;
  description: string;
  /** Path beginning with "/", used for the canonical URL. */
  path: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  noindex?: boolean;
  /** Use the full title verbatim instead of applying the "· Muhammad Adnan" template. */
  absoluteTitle?: boolean;
};

/**
 * Site-wide social image (src/app/opengraph-image.tsx). Pages that set `openGraph` replace the
 * parent's Open Graph object, so it is listed explicitly; routes with their own
 * opengraph-image file (case studies, research, articles) still override it.
 */
const DEFAULT_OG_IMAGE = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: `${site.name} — MIS, Business Intelligence & Full-Stack Engineering`,
};

/** Consistent metadata for every public page: title, description, canonical, Open Graph, Twitter. */
export function pageMetadata(input: PageMetaInput): Metadata {
  const fullTitle = input.absoluteTitle ? input.title : `${input.title} · ${site.name}`;
  return {
    title: input.absoluteTitle ? { absolute: input.title } : input.title,
    description: input.description,
    alternates: {
      canonical: input.path,
      types: {
        'application/rss+xml': [{ url: '/writing/feed.xml', title: `${site.name} — Writing` }],
      },
    },
    openGraph: {
      title: fullTitle,
      description: input.description,
      url: input.path,
      siteName: site.name,
      locale: site.locale,
      type: input.type ?? 'website',
      images: [DEFAULT_OG_IMAGE],
      ...(input.type === 'article'
        ? {
            publishedTime: input.publishedTime,
            modifiedTime: input.modifiedTime,
            authors: [absoluteUrl('/about')],
            tags: input.tags,
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: input.description,
    },
    robots: input.noindex ? { index: false, follow: false } : undefined,
  };
}

export type JsonLdObject = Record<string, unknown>;

export function personJsonLd(): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': absoluteUrl('/#person'),
    name: site.name,
    url: absoluteUrl('/'),
    image: absoluteUrl('/images/muhammad-adnan-avatar.jpg'),
    email: `mailto:${EMAIL}`,
    description: site.about,
    sameAs: [LINKEDIN_URL, GITHUB_URL],
    alumniOf: [
      {
        '@type': 'CollegeOrUniversity',
        name: 'United International University (UIU)',
        address: 'Dhaka, Bangladesh',
      },
    ],
    knowsAbout: [
      'Management Information Systems',
      'Business Intelligence',
      'Data Analysis',
      'SQL',
      'Power BI',
      'Python',
      'Backend Development',
      'Machine Learning',
      'Computer Vision',
    ],
  };
}

export function websiteJsonLd(): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': absoluteUrl('/#website'),
    name: site.name,
    url: absoluteUrl('/'),
    description: site.description,
    inLanguage: 'en',
    publisher: { '@id': absoluteUrl('/#person') },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function softwareSourceCodeJsonLd(input: {
  name: string;
  description: string;
  path: string;
  repo?: string;
  keywords: string[];
}): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    ...(input.repo ? { codeRepository: input.repo.replace(/\.git$/, '') } : {}),
    keywords: input.keywords.join(', '),
    author: { '@id': absoluteUrl('/#person') },
  };
}

export function blogPostingJsonLd(input: {
  title: string;
  description: string;
  path: string;
  publishedAt: string;
  updatedAt: string;
  image?: string;
  tags: string[];
  category: string;
}): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
    mainEntityOfPage: absoluteUrl(input.path),
    datePublished: input.publishedAt,
    dateModified: input.updatedAt,
    ...(input.image ? { image: absoluteUrl(input.image) } : {}),
    articleSection: input.category,
    keywords: input.tags.join(', '),
    inLanguage: 'en',
    author: {
      '@type': 'Person',
      '@id': absoluteUrl('/#person'),
      name: site.name,
      url: absoluteUrl('/about'),
    },
    publisher: { '@id': absoluteUrl('/#person') },
  };
}

/** Serialise JSON-LD safely for inline <script> tags. */
export function serializeJsonLd(data: JsonLdObject | JsonLdObject[]): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(new RegExp('\\u2028', 'g'), '\\u2028')
    .replace(new RegExp('\\u2029', 'g'), '\\u2029');
}
