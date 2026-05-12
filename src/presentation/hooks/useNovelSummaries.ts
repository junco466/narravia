import { serviceLocator } from '@/app/serviceLocator';
import { useAsyncResource } from '@/presentation/hooks/useAsyncResource';

export const useNovelSummaries = () => {
  return useAsyncResource(() => serviceLocator.postQueryService.getNovelSummaries(), []);
};
