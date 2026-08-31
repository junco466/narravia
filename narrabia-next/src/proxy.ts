// proxy.ts corre ANTES de que cualquier página se renderice, para
// TODAS las rutas que coincidan con "matcher" (abajo). Es el equivalente
// a un guardia parado en la puerta antes de dejarte pasar al pasillo.
//
// Nota de esta versión de Next: este archivo se llamaba "middleware.ts"
// en versiones viejas — en Next 16 se renombró a "proxy.ts". Mismo
// concepto, nombre nuevo.
//
// Importante (según la propia doc de Next): esta es una revisión
// "optimista" — solo lee la cookie, sin tocar la base de datos, porque
// corre en CADA request y no debe ser lenta. La protección real y
// definitiva vuelve a revisarse también en verifySession() (el DAL),
// asi que aunque alguien lograra esquivar esto, no lograria nada.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth/session';

const LOGIN_PATH = '/admin/login';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getSession();

  // Si no hay sesión válida y NO está yendo al login, lo mandamos ahí.
  if (!session && pathname !== LOGIN_PATH) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  // Si YA hay sesión y trata de entrar al login, lo mandamos directo
  // al panel — no tiene sentido mostrarle el formulario de nuevo.
  if (session && pathname === LOGIN_PATH) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

// Solo corre para rutas /admin/* — el resto del sitio (blog público)
// no pasa por este chequeo en absoluto.
export const config = {
  matcher: ['/admin/:path*'],
};
