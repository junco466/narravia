import type { Post } from '@/domain/models/post';
import { NotFoundError } from '@/domain/models/errors';
import type { PostRepository } from '@/domain/repositories/PostRepository';
import { loadMarkdownPosts } from '@/infrastructure/loaders/markdownPostLoader';

export class LocalPostRepository implements PostRepository {
  async getPosts(): Promise<Post[]> {
    return loadMarkdownPosts();
  }

  async getPostById(id: string): Promise<Post> {
    const posts = await loadMarkdownPosts();
    const post = posts.find((item) => item.id === id);

    if (!post) {
      throw new NotFoundError(`No existe un post con el id ${id}`);
    }

    return post;
  }

  async getPostsByCategory(category: string): Promise<Post[]> {
    const posts = await loadMarkdownPosts();
    return posts.filter((post) => post.type === category);
  }
}
