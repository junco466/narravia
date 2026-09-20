// Identidad anónima del visitante: una cookie con un UUID al azar.
// Sirve para no duplicar likes y limitar el spam, sin pedir cuenta.
import 'server-only';
import { cookies } from 'next/headers';
import { randomUUID } from 'node:crypto';

const VISITOR_COOKIE = 'visitor_id';

// Lee la cookie del visitante; si no existe y "create" es true, la
// crea (solo se puede escribir cookies dentro de una Server Action).
// httpOnly = el JavaScript del navegador no puede leerla.
export const getVisitorId = async (create: boolean): Promise<string | null> => {
  const store = await cookies();
  const existing = store.get(VISITOR_COOKIE)?.value;
  if (existing) return existing;
  if (!create) return null;

  const id = randomUUID();
  store.set(VISITOR_COOKIE, id, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  });
  return id;
};
