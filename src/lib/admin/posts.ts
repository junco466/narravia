// Acceso a datos para el panel de Admin — a propósito, esto NO
// implementa PostRepository ni pasa por PostQueryService.
//
// PostRepository existe porque el lado PUBLICO tiene varias
// implementaciones intercambiables (archivos .md, Postgres...) y
// necesitábamos poder cambiar entre ellas sin tocar el resto de la
// app. Aquí, en cambio, solo va a existir UNA forma de escribir en la
// base de datos — crear una interfaz para una sola implementación no
// protege de nada, solo agrega una capa extra sin beneficio real.
// Por eso este archivo habla con Prisma directo.
import 'server-only';
import type { Post, PostStatus, PostType } from '@/domain/models/post';
import { prisma } from '@/lib/prisma';
import type { Post as PrismaPost, Prisma } from '@/generated/prisma/client';

const toDomainPost = (row: PrismaPost): Post => ({
  id: row.id,
  title: row.title,
  type: row.type as PostType,
  content: row.content,
  createdAt: row.createdAt.toISOString(),
  excerpt: row.excerpt ?? undefined,
  coverQuote: row.coverQuote ?? undefined,
  slug: row.slug ?? undefined,
  updatedAt: row.updatedAt?.toISOString(),
  order: row.order ?? undefined,
  seriesSlug: row.seriesSlug ?? undefined,
  seriesTitle: row.seriesTitle ?? undefined,
  chapterNumber: row.chapterNumber ?? undefined,
  chapterTitle: row.chapterTitle ?? undefined,
  seoDescription: row.seoDescription ?? undefined,
  status: row.status as PostStatus,
  tags: row.tags,
});

// Convierte "Un Título Con Ñ y Espacios" en "un-titulo-con-n-y-espacios".
// Se usa para generar el id/slug de posts nuevos a partir del título.
export const slugify = (title: string): string =>
  title
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // quita tildes (á -> a, ñ se maneja aparte)
    .replace(/ñ/gi, 'n')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export interface PostFormInput {
  title: string;
  type: PostType;
  content: string;
  excerpt?: string;
  coverQuote?: string;
  seoDescription?: string;
  status: PostStatus;
  tags: string[];
  seriesSlug?: string;
  seriesTitle?: string;
  chapterNumber?: number;
  chapterTitle?: string;
}

interface ListFilters {
  type?: PostType;
  status?: PostStatus;
}

export const listPostsForAdmin = async (filters: ListFilters = {}): Promise<Post[]> => {
  const where: Prisma.PostWhereInput = {};
  if (filters.type) where.type = filters.type;
  if (filters.status) where.status = filters.status;

  const rows = await prisma.post.findMany({ where, orderBy: { createdAt: 'desc' } });
  return rows.map(toDomainPost);
};

export interface NovelSeriesOption {
  seriesSlug: string;
  seriesTitle: string;
}

// Lista las series de novela que ya existen, para que el formulario
// ofrezca un selector en vez de dejarte re-escribir el slug a mano en
// cada capítulo nuevo (un typo ahí crearía una serie "huérfana" sin
// que nadie lo note).
export const listNovelSeries = async (): Promise<NovelSeriesOption[]> => {
  const rows = await prisma.post.findMany({
    where: { type: 'novela', seriesSlug: { not: null } },
    distinct: ['seriesSlug'],
    select: { seriesSlug: true, seriesTitle: true },
    orderBy: { seriesTitle: 'asc' },
  });

  return rows.map((row) => ({
    seriesSlug: row.seriesSlug as string,
    seriesTitle: row.seriesTitle ?? (row.seriesSlug as string),
  }));
};

// A diferencia de PostgresPostRepository.getPostById, esta NO lanza
// NotFoundError — el admin decide él mismo cómo reaccionar (mostrar
// su propia página de "no encontrado", por ejemplo).
export const getPostForAdmin = async (id: string): Promise<Post | null> => {
  const row = await prisma.post.findUnique({ where: { id } });
  return row ? toDomainPost(row) : null;
};

export const createPostRecord = async (input: PostFormInput): Promise<Post> => {
  const baseId = slugify(input.title) || 'post';
  let id = baseId;
  let attempt = 1;

  // Si ya existe un post con ese id (dos títulos parecidos, por
  // ejemplo), le agregamos un sufijo numérico hasta encontrar uno libre.
  while (await prisma.post.findUnique({ where: { id }, select: { id: true } })) {
    attempt += 1;
    id = `${baseId}-${attempt}`;
  }

  const row = await prisma.post.create({
    data: {
      id,
      slug: id,
      title: input.title,
      type: input.type,
      content: input.content,
      excerpt: input.excerpt || undefined,
      coverQuote: input.coverQuote || undefined,
      seoDescription: input.seoDescription || undefined,
      status: input.status,
      tags: input.tags,
      seriesSlug: input.seriesSlug || undefined,
      seriesTitle: input.seriesTitle || undefined,
      chapterNumber: input.chapterNumber,
      chapterTitle: input.chapterTitle || undefined,
    },
  });

  return toDomainPost(row);
};

export const updatePostRecord = async (id: string, input: PostFormInput): Promise<Post> => {
  const row = await prisma.post.update({
    where: { id },
    data: {
      title: input.title,
      type: input.type,
      content: input.content,
      excerpt: input.excerpt || null,
      coverQuote: input.coverQuote || null,
      seoDescription: input.seoDescription || null,
      status: input.status,
      tags: input.tags,
      seriesSlug: input.seriesSlug || null,
      seriesTitle: input.seriesTitle || null,
      chapterNumber: input.chapterNumber ?? null,
      chapterTitle: input.chapterTitle || null,
      updatedAt: new Date(),
    },
  });

  return toDomainPost(row);
};

export const deletePostRecord = async (id: string): Promise<void> => {
  await prisma.post.delete({ where: { id } });
};
