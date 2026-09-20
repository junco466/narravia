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

const EXCERPT_MAX_LENGTH = 180;

// Genera un extracto a partir del contenido markdown cuando el autor
// no escribió uno. Cómo lo hace, paso a paso:
//  1. Quita símbolos de markdown (# > * _ ` -) para que el extracto no
//     muestre "## Título" ni "**negritas**" como texto crudo.
//  2. Colapsa saltos de línea y espacios repetidos en uno solo (un
//     poema de varias estrofas queda como una sola línea corrida).
//  3. Si el texto pasa de 180 caracteres, lo corta ahí, retrocede hasta
//     el último espacio para no partir una palabra por la mitad y
//     agrega "…" al final.
// Es la misma idea del loader viejo de .md, pero con el corte limpio.
export const deriveExcerpt = (content: string): string => {
  const plain = content
    .replace(/[#>*_`\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (plain.length <= EXCERPT_MAX_LENGTH) return plain;

  const cut = plain.slice(0, EXCERPT_MAX_LENGTH);
  const lastSpace = cut.lastIndexOf(' ');
  // Si no hay espacio (texto sin palabras separadas), cortamos en seco.
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
};

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
      // Si el autor no escribió extracto, se genera desde el contenido.
      excerpt: input.excerpt || deriveExcerpt(input.content),
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
      // Al editar también: si lo dejas vacío, se regenera desde el
      // contenido actual (así no queda desactualizado tras editar).
      excerpt: input.excerpt || deriveExcerpt(input.content),
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
