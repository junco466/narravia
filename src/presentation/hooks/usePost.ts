import { serviceLocator } from '@/app/serviceLocator';
import { useAsyncResource } from '@/presentation/hooks/useAsyncResource';

export const usePost = (id: string) => {
  return useAsyncResource(() => serviceLocator.postQueryService.getById(id), [id]);
};
