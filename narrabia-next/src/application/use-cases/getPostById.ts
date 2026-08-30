import type { PostRepository } from '@/domain/repositories/PostRepository';
import type { Post } from '@/domain/models/post';

export const getPostById = async (repository: PostRepository, id: string): Promise<Post> => {
  return repository.getPostById(id);
};
