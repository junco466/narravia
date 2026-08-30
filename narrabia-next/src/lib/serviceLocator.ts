import { PostQueryService } from '@/application/services/PostQueryService';
import { LocalPostRepository } from '@/infrastructure/repositories/LocalPostRepository';

const repository = new LocalPostRepository();

export const serviceLocator = {
  postQueryService: new PostQueryService(repository),
};
