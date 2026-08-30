// Carpeta "[id]" = segmento dinámico. Esta ruta responde a
// /poemas/CUALQUIER-COSA, y "CUALQUIER-COSA" llega como params.id.

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCachedPostById } from '@/lib/getCachedPost';
import { MarkdownArticle } from '@/presentation/components/MarkdownArticle/MarkdownArticle';

interface PageProps {
  params: Promise<{ id: string }>;
}

// generateMetadata corre en el servidor, ANTES de mandar la página.
// Esto es lo que resuelve el problema de SEO que hablamos al principio:
// cada poema tiene su propio <title> y <meta description> reales en el
// HTML, no un título genérico igual para todo el sitio.
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getCachedPostById(id);

  if (!post || post.type !== 'poema') {
    return {};
  }

  return {
    title: `${post.title} — Narravia`,
    description: post.seoDescription ?? post.excerpt,
  };
}

export default async function PoemaDetailPage({ params }: PageProps) {
  const { id } = await params;
  const post = await getCachedPostById(id);

  // notFound() corta el render y muestra la página 404 — es el
  // equivalente a <Navigate to="/404" /> de React Router, pero
  // resuelto en el servidor, no en el navegador.
  if (!post || post.type !== 'poema') {
    notFound();
  }

  return <MarkdownArticle post={post} />;
}
