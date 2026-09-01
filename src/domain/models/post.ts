export const POST_TYPES = ['poema', 'reflexion', 'novela'] as const;

export type PostType = (typeof POST_TYPES)[number];

export const POST_STATUSES = ['draft', 'published'] as const;

export type PostStatus = (typeof POST_STATUSES)[number];

export interface Post {
  id: string;
  title: string;
  type: PostType;
  content: string;
  createdAt: string;
  excerpt?: string;
  coverQuote?: string;
  slug?: string;
  updatedAt?: string;
  order?: number;
  seriesSlug?: string;
  seriesTitle?: string;
  chapterNumber?: number;
  chapterTitle?: string;
  seoDescription?: string;
  // El sitio público (PostRepository) solo entrega posts "published".
  // El panel de Admin ve y edita ambos estados.
  status: PostStatus;
  tags: string[];
}

export interface NovelSummary {
  seriesSlug: string;
  seriesTitle: string;
  description?: string;
  chapters: Post[];
  updatedAt: string;
}
