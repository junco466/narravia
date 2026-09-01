// Mismo truco que getCachedPost.ts: evita traer la novela dos veces
// (una para generateMetadata, otra para la página).
import { cache } from 'react';
import { serviceLocator } from '@/lib/serviceLocator';

export const getCachedNovelBySlug = cache(async (seriesSlug: string) => {
  try {
    return await serviceLocator.postQueryService.getNovelBySlug(seriesSlug);
  } catch {
    return null;
  }
});
