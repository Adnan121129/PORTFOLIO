export type PostStatus = 'draft' | 'published';

export type PostCover = {
  id: string;
  url: string;
  width: number;
  height: number;
  alt: string;
};

/** Everything except the markdown body — used for listings. */
export type PostSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  cover: PostCover | null;
  status: PostStatus;
  featured: boolean;
  isSample: boolean;
  readingMinutes: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Post = PostSummary & {
  body: string;
  coverImageId: string | null;
  coverAlt: string;
};

export type PostInput = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  coverImageId: string | null;
  coverAlt: string;
  featured: boolean;
};

export type MediaItem = {
  id: string;
  url: string;
  filename: string;
  mime: string;
  width: number;
  height: number;
  bytes: number;
  alt: string;
  createdAt: string;
};

export type FieldIssue = { field: keyof PostInput | 'form'; message: string };
