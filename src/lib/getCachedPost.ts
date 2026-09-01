// Tanto generateMetadata() como la página en sí necesitan el mismo post.
// Sin ayuda, eso sería leer el mismo archivo .md dos veces por visita.
// react's cache() memoiza el resultado de la función durante UNA sola
// petición (request): la primera llamada hace el trabajo real, la
// segunda (mismo id, mismo request) reutiliza el resultado.
import { cache } from 'react';
import { serviceLocator } from '@/lib/serviceLocator';

export const getCachedPostById = cache(async (id: string) => {
  try {
    return await serviceLocator.postQueryService.getById(id);
  } catch {
    // getById lanza NotFoundError si no existe; lo convertimos en
    // "null" para que cada página decida cómo reaccionar (notFound()).
    return null;
  }
});
