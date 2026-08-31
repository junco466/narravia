import { PostQueryService } from '@/application/services/PostQueryService';
import { PostgresPostRepository } from '@/infrastructure/repositories/PostgresPostRepository';

// Este es el unico lugar de toda la app que "decide" de donde vienen
// los datos. PostQueryService, los casos de uso, y cada pagina siguen
// exactamente iguales — solo hablan con la interfaz PostRepository,
// nunca con esta clase en concreto. Por eso cambiar esta linea alcanza.
const repository = new PostgresPostRepository();

export const serviceLocator = {
  postQueryService: new PostQueryService(repository),
};
