// Ruta "/novelas/[seriesSlug]": trae la novela en el servidor (SEO real,
// igual que en los posts) y le pasa los datos ya listos al lector
// interactivo (NovelReader), que sí necesita JS en el navegador.

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCachedNovelBySlug } from '@/lib/getCachedNovel';
import { NovelReader } from '@/presentation/components/NovelReader/NovelReader';

interface PageProps {
  params: Promise<{ seriesSlug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { seriesSlug } = await params;
  const novel = await getCachedNovelBySlug(seriesSlug);

  if (!novel) {
    return {};
  }

  return {
    title: `${novel.seriesTitle} — Narravia`,
    description: novel.description,
  };
}

export default async function NovelaDetailPage({ params }: PageProps) {
  const { seriesSlug } = await params;
  const novel = await getCachedNovelBySlug(seriesSlug);

  if (!novel) {
    notFound();
  }

  return <NovelReader novel={novel} />;
}
