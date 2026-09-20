'use server';

// Server Action pública del formulario de /contacto.
import { addContactMessage, type AddCommentResult } from '@/lib/engagement';
import { getVisitorId } from '@/lib/visitor';
import { isValidEmail } from '@/lib/validation';

export const submitContactAction = async (formData: FormData): Promise<AddCommentResult> => {
  // Campo trampa anti-bots (ver PostEngagement): si viene lleno,
  // fingimos éxito sin guardar nada.
  if (String(formData.get('website') ?? '').trim() !== '') {
    return { ok: true };
  }

  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const body = String(formData.get('body') ?? '').trim();

  if (!name || name.length > 60) return { ok: false, error: 'Escribe tu nombre (máximo 60 caracteres).' };
  // Aquí el correo es OBLIGATORIO (para poder responderte) y debe ser válido.
  if (!isValidEmail(email)) return { ok: false, error: 'Escribe un correo válido, como nombre@dominio.com.' };
  if (!body || body.length > 2000) return { ok: false, error: 'Escribe tu mensaje (máximo 2000 caracteres).' };

  const visitorId = (await getVisitorId(true)) as string;
  return addContactMessage({ visitorId, name, email, body });
};
