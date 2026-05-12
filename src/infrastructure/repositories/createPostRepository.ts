import type { PostRepository } from '@/domain/repositories/PostRepository';
import { environment } from '@/infrastructure/config/environment';
import { HttpClient } from '@/infrastructure/http/HttpClient';
import { ApiPostRepository } from '@/infrastructure/repositories/ApiPostRepository';
import { LocalPostRepository } from '@/infrastructure/repositories/LocalPostRepository';
import { MockApiPostRepository } from '@/infrastructure/repositories/MockApiPostRepository';

export const createPostRepository = (): PostRepository => {
  switch (environment.contentSource) {
    case 'api':
      return new ApiPostRepository(new HttpClient(), environment.apiBaseUrl);
    case 'mock-api':
      return new MockApiPostRepository();
    case 'local':
    default:
      return new LocalPostRepository();
  }
};
