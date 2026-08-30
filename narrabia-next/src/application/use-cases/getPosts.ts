import type { PostRepository } from '@/domain/repositories/PostRepository';
import type { Post } from '@/domain/models/post';

export const getPosts = async (repository: PostRepository): Promise<Post[]> => {
  const posts = await repository.getPosts();

  return [...posts].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
};
