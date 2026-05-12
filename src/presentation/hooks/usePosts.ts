import type { PostType } from '@/domain/models/post';
import { serviceLocator } from '@/app/serviceLocator';
import { useAsyncResource } from '@/presentation/hooks/useAsyncResource';

export const usePosts = (category?: PostType) => {
  return useAsyncResource(
    () => (category ? serviceLocator.postQueryService.getByCategory(category) : serviceLocator.postQueryService.getAll()),
    [category],
  );
};
