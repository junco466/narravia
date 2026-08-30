// Mismo patrón que /poemas/[id], solo cambia el tipo esperado.

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCachedPostById } from '@/lib/getCachedPost';
import { MarkdownArticle } from '@/presentation/components/MarkdownArticle/MarkdownArticle';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getCachedPostById(id);

  if (!post || post.type !== 'reflexion') {
    return {};
  }

  return {
    title: `${post.title} — Narravia`,
    description: post.seoDescription ?? post.excerpt,
  };
}

export default async function ReflexionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const post = await getCachedPostById(id);

  if (!post || post.type !== 'reflexion') {
    notFound();
  }

  return <MarkdownArticle post={post} />;
}
