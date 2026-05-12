import { PostQueryService } from '@/application/services/PostQueryService';
import { createPostRepository } from '@/infrastructure/repositories/createPostRepository';

const repository = createPostRepository();

export const serviceLocator = {
  postQueryService: new PostQueryService(repository),
};
