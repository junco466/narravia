import type { Post } from '@/domain/models/post';
import type { PostRepository } from '@/domain/repositories/PostRepository';
import { LocalPostRepository } from '@/infrastructure/repositories/LocalPostRepository';

const NETWORK_DELAY_MS = 450;

export class MockApiPostRepository implements PostRepository {
  private readonly fallbackRepository = new LocalPostRepository();

  private async withLatency<T>(factory: () => Promise<T>): Promise<T> {
    await new Promise((resolve) => setTimeout(resolve, NETWORK_DELAY_MS));
    return factory();
  }

  getPosts(): Promise<Post[]> {
    return this.withLatency(() => this.fallbackRepository.getPosts());
  }

  getPostById(id: string): Promise<Post> {
    return this.withLatency(() => this.fallbackRepository.getPostById(id));
  }

  getPostsByCategory(category: string): Promise<Post[]> {
    return this.withLatency(() => this.fallbackRepository.getPostsByCategory(category));
  }
}
