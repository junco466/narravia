// DAL = Data Access Layer. La idea: en vez de que cada página del admin
// repita "revisa la cookie, si no hay sesión redirige al login", lo
// escribimos UNA vez aquí y todas las páginas/acciones lo llaman.
//
// cache() memoiza el resultado durante un mismo render — si dos partes
// de la misma página llaman verifySession(), la cookie se lee y
// verifica una sola vez, no dos.
import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';

export const verifySession = cache(async () => {
  const session = await getSession();

  if (!session) {
    redirect('/admin/login');
  }

  return session;
});
