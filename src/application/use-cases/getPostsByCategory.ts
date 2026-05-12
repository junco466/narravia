import type { PostRepository } from '@/domain/repositories/PostRepository';
import type { Post, PostType } from '@/domain/models/post';

export const getPostsByCategory = async (
  repository: PostRepository,
  category: PostType,
): Promise<Post[]> => {
  const posts = await repository.getPostsByCategory(category);

  if (category === 'novela') {
    return [...posts].sort((left, right) => {
      const seriesComparison = (left.seriesTitle ?? '').localeCompare(right.seriesTitle ?? '');

      if (seriesComparison !== 0) {
        return seriesComparison;
      }

      return (left.chapterNumber ?? left.order ?? 0) - (right.chapterNumber ?? right.order ?? 0);
    });
  }

  return [...posts].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
};
