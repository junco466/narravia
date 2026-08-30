import type { Post } from '@/domain/models/post';

export interface PostRepository {
  getPosts(): Promise<Post[]>;
  getPostById(id: string): Promise<Post>;
  getPostsByCategory(category: string): Promise<Post[]>;
}
