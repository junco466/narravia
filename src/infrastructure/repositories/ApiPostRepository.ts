import type { Post } from '@/domain/models/post';
import { NotFoundError } from '@/domain/models/errors';
import type { PostRepository } from '@/domain/repositories/PostRepository';
import { HttpClient } from '@/infrastructure/http/HttpClient';

export class ApiPostRepository implements PostRepository {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly baseUrl = '/api',
  ) {}

  async getPosts(): Promise<Post[]> {
    return this.httpClient.get<Post[]>(`${this.baseUrl}/posts`);
  }

  async getPostById(id: string): Promise<Post> {
    try {
      return await this.httpClient.get<Post>(`${this.baseUrl}/posts/${id}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        throw new NotFoundError(`No existe un post con el id ${id}`);
      }

      throw error;
    }
  }

  async getPostsByCategory(category: string): Promise<Post[]> {
    const posts = await this.getPosts();
    return posts.filter((post) => post.type === category);
  }
}
