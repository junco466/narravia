// Segunda implementacion real de PostRepository (la primera fue
// LocalPostRepository, que lee archivos .md). Esta lee de Postgres.
//
// Fijate que la firma de la clase es IDENTICA a LocalPostRepository:
// mismos 3 metodos, mismos tipos de entrada/salida. Eso es lo que
// permite que, cuando cambiemos el serviceLocator para usar esta clase
// en vez de la otra, absolutamente nada mas en la app (paginas,
// PostQueryService, casos de uso) se entere del cambio.
//
// Importante: esta clase es la que usa el sitio PUBLICO. Por eso cada
// consulta filtra "status: published" — un borrador nunca debe verse
// aqui, ni siquiera si alguien adivina su URL directa. El panel de
// Admin (que sí necesita ver borradores) usa un camino de datos
// distinto: src/lib/admin/posts.ts, no este archivo.

import type { Post, PostStatus, PostType } from '@/domain/models/post';
import { NotFoundError } from '@/domain/models/errors';
import type { PostRepository } from '@/domain/repositories/PostRepository';
import { prisma } from '@/lib/prisma';
import type { Post as PrismaPost } from '@/generated/prisma/client';

// Traduce una fila de la base de datos (con Date y null) a un Post de
// dominio (con string y undefined) — el problema que explicamos arriba.
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

const PUBLISHED = { status: 'published' as const };

export class PostgresPostRepository implements PostRepository {
  async getPosts(): Promise<Post[]> {
    const rows = await prisma.post.findMany({ where: PUBLISHED });
    return rows.map(toDomainPost);
  }

  async getPostById(id: string): Promise<Post> {
    const row = await prisma.post.findUnique({ where: { id, ...PUBLISHED } });

    if (!row) {
      throw new NotFoundError(`No existe un post con el id ${id}`);
    }

    return toDomainPost(row);
  }

  async getPostsByCategory(category: string): Promise<Post[]> {
    const rows = await prisma.post.findMany({ where: { type: category as PostType, ...PUBLISHED } });
    return rows.map(toDomainPost);
  }
}
