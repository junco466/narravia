import { serviceLocator } from '@/app/serviceLocator';
import { useAsyncResource } from '@/presentation/hooks/useAsyncResource';

export const useNovel = (seriesSlug: string) => {
  return useAsyncResource(() => serviceLocator.postQueryService.getNovelBySlug(seriesSlug), [seriesSlug]);
};
