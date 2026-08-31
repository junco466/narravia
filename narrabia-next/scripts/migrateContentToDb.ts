// Script de UN SOLO USO: lee todos los .md (con el mismo loader que ya
// usa LocalPostRepository) y los inserta en la tabla "posts" de Postgres.
//
// Se corre a mano desde la terminal (no es parte de la app en si):
//   npx tsx scripts/migrateContentToDb.ts
//
// Usa "upsert" (update-or-insert) en vez de "create": si corres el
// script dos veces, la segunda vez ACTUALIZA los posts que ya existen
// en vez de fallar por id duplicado o crear copias. Eso lo hace seguro
// de re-ejecutar si cambias algo en un .md y quieres re-sincronizar.

// Importante: este import va PRIMERO, antes de "@/lib/prisma".
// Next.js carga el .env solo, pero este script corre AFUERA de Next
// (con tsx), asi que hay que cargarlo a mano — si no, DATABASE_URL
// llega vacio al crear el cliente de Prisma (justo lo que fallo antes).
import 'dotenv/config';
import { loadMarkdownPosts } from '@/infrastructure/loaders/markdownPostLoader';
import { prisma } from '@/lib/prisma';

async function main() {
  const posts = await loadMarkdownPosts();
  console.log(`Se encontraron ${posts.length} posts en content/. Migrando...`);

  for (const post of posts) {
    // El objeto que le pasamos a Prisma tiene que tener el "idioma" que
    // espera la base de datos: createdAt/updatedAt como Date, no string.
    await prisma.post.upsert({
      where: { id: post.id },
      create: {
        id: post.id,
        title: post.title,
        type: post.type,
        content: post.content,
        createdAt: new Date(post.createdAt),
        excerpt: post.excerpt,
        coverQuote: post.coverQuote,
        slug: post.slug,
        updatedAt: post.updatedAt ? new Date(post.updatedAt) : undefined,
        order: post.order,
        seriesSlug: post.seriesSlug,
        seriesTitle: post.seriesTitle,
        chapterNumber: post.chapterNumber,
        chapterTitle: post.chapterTitle,
        seoDescription: post.seoDescription,
      },
      update: {
        title: post.title,
        type: post.type,
        content: post.content,
        createdAt: new Date(post.createdAt),
        excerpt: post.excerpt,
        coverQuote: post.coverQuote,
        slug: post.slug,
        updatedAt: post.updatedAt ? new Date(post.updatedAt) : undefined,
        order: post.order,
        seriesSlug: post.seriesSlug,
        seriesTitle: post.seriesTitle,
        chapterNumber: post.chapterNumber,
        chapterTitle: post.chapterTitle,
        seoDescription: post.seoDescription,
      },
    });
    console.log(`  ✓ ${post.id}`);
  }

  console.log('Migracion completa.');
  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error('La migracion fallo:', error);
  await prisma.$disconnect();
  process.exit(1);
});
