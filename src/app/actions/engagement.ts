'use server';

// Server Actions públicas (las llama cualquier visitante, no solo tú).
// Como no hay login, la "identidad" es una cookie anónima con un UUID.
import { getVisitorId } from '@/lib/visitor';
import { isValidEmail } from '@/lib/validation';
import {
  addComment,
  getEngagement,
  toggleLike,
  type AddCommentResult,
  type EngagementState,
} from '@/lib/engagement';

export const loadEngagement = async (postId: string): Promise<EngagementState> =>
  getEngagement(postId, await getVisitorId(false));

export const toggleLikeAction = async (postId: string): Promise<EngagementState> => {
  const visitorId = (await getVisitorId(true)) as string;
  await toggleLike(postId, visitorId);
  return getEngagement(postId, visitorId);
};

export const submitCommentAction = async (
  postId: string,
  formData: FormData,
): Promise<AddCommentResult & { state?: EngagementState }> => {
  // Campo trampa (honeypot): está oculto con CSS, una persona nunca lo
  // llena, pero un bot que rellena todo sí. Fingimos éxito sin guardar
  // nada para que el bot no sepa que fue detectado.
  if (String(formData.get('website') ?? '').trim() !== '') {
    return { ok: true };
  }

  const authorName = String(formData.get('authorName') ?? '').trim();
  const authorEmail = String(formData.get('authorEmail') ?? '').trim();
  const body = String(formData.get('body') ?? '').trim();

  if (!authorName || authorName.length > 60) return { ok: false, error: 'Escribe tu nombre (máximo 60 caracteres).' };
  if (!body || body.length > 1000) return { ok: false, error: 'Escribe un comentario (máximo 1000 caracteres).' };
  if (authorEmail && !isValidEmail(authorEmail)) {
    return { ok: false, error: 'Escribe un correo válido, como nombre@dominio.com (o déjalo vacío).' };
  }

  const visitorId = (await getVisitorId(true)) as string;
  const result = await addComment({ postId, visitorId, authorName, authorEmail, body });
  if (!result.ok) return result;

  return { ok: true, state: await getEngagement(postId, visitorId) };
};
