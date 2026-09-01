import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Post, PostType } from '@/domain/models/post';
import { parseFrontMatter } from '@/infrastructure/loaders/parseFrontMatter';

interface FrontMatter {
  id?: string;
  title?: string;
  date?: string;
  type?: PostType;
  excerpt?: string;
  coverQuote?: string;
  updatedAt?: string;
  order?: number;
  seriesSlug?: string;
  seriesTitle?: string;
  chapterNumber?: number;
  chapterTitle?: string;
  seoDescription?: string;
}

const CONTENT_DIR = join(process.cwd(), 'content');

const readMarkdownFiles = (): Record<string, string> => {
  const entries = readdirSync(CONTENT_DIR, { recursive: true, withFileTypes: true });
  const modules: Record<string, string> = {};

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) {
      continue;
    }

    const absolutePath = join(entry.parentPath ?? entry.path, entry.name);
    const relativePath = absolutePath.slice(process.cwd().length + 1).split('\\').join('/');
    modules[relativePath] = readFileSync(absolutePath, 'utf-8');
  }

  return modules;
};

const detectPostType = (path: string): PostType => {
  if (path.includes('/poemas/')) {
    return 'poema';
  }

  if (path.includes('/reflexiones/')) {
    return 'reflexion';
  }

  return 'novela';
};

const slugFromPath = (path: string): string => {
  const segments = path.split('/');
  const last = segments.at(-1) ?? '';

  return last.replace(/\.md$/i, '');
};

const deriveId = (path: string, metadata: FrontMatter): string => {
  if (metadata.id) {
    return metadata.id;
  }

  const slug = slugFromPath(path);

  if (path.includes('/novelas/')) {
    const seriesSlug = path.split('/novelas/')[1]?.split('/')[0] ?? 'novela';
    return `${seriesSlug}-${slug}`;
  }

  return slug;
};

const deriveSeriesMetadata = (path: string, metadata: FrontMatter) => {
  if (!path.includes('/novelas/')) {
    return {};
  }

  const [, remainder] = path.split('/novelas/');
  const [seriesFolder] = remainder.split('/');

  return {
    seriesSlug: metadata.seriesSlug ?? seriesFolder,
    seriesTitle: metadata.seriesTitle ?? seriesFolder.replace(/-/g, ' '),
  };
};

const deriveExcerpt = (body: string, metadata: FrontMatter): string => {
  if (metadata.excerpt) {
    return metadata.excerpt;
  }

  const normalized = body
    .replace(/[#>*_`\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return normalized.slice(0, 180);
};

const toPost = (path: string, rawMarkdown: string): Post => {
  const { data, content } = parseFrontMatter<FrontMatter>(rawMarkdown);
  const metadata = data as FrontMatter;
  const type = metadata.type ?? detectPostType(path);
  const slug = slugFromPath(path);
  const seriesMetadata = deriveSeriesMetadata(path, metadata);

  return {
    id: deriveId(path, metadata),
    title: metadata.title ?? slug.replace(/-/g, ' '),
    type,
    content: content.trim(),
    createdAt: metadata.date ?? new Date().toISOString(),
    excerpt: deriveExcerpt(content, metadata),
    coverQuote: metadata.coverQuote,
    slug,
    updatedAt: metadata.updatedAt,
    order: metadata.order,
    chapterNumber: metadata.chapterNumber,
    chapterTitle: metadata.chapterTitle,
    seoDescription: metadata.seoDescription,
    // Los .md no tienen estos campos — solo existen desde el Admin.
    // El migrateContentToDb.ts es quien realmente decide "published"
    // para el contenido que ya estaba en vivo; esto es solo para
    // que el tipo Post quede completo mientras tanto.
    status: 'published',
    tags: [],
    ...seriesMetadata,
  };
};

export const loadMarkdownPosts = async (): Promise<Post[]> => {
  const markdownModules = readMarkdownFiles();
  return Object.entries(markdownModules).map(([path, rawMarkdown]) => toPost(path, rawMarkdown));
};
