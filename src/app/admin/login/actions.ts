// 'use server' marca TODO este archivo como Server Actions: funciones
// que viven en el servidor, pero que un formulario en el navegador
// puede "llamar" directamente, sin que nosotros armemos una ruta de
// API a mano. Next se encarga de la comunicación por debajo.
'use server';

import { redirect } from 'next/navigation';
import { verifyPassword } from '@/lib/auth/password';
import { createSession } from '@/lib/auth/session';

export interface LoginState {
  error?: string;
}

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const username = formData.get('username');
  const password = formData.get('password');

  if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) {
    return { error: 'Completa usuario y contraseña.' };
  }

  const storedHash = process.env.ADMIN_PASSWORD_HASH;
  const isValidUsername = username === process.env.ADMIN_USERNAME;
  const isValidPassword = Boolean(storedHash) && verifyPassword(password, storedHash!);

  // Mensaje generico a propósito: no le decimos al atacante CUAL de
  // los dos campos estaba mal (evita que alguien confirme, por
  // ensayo y error, que un usuario existe).
  if (!isValidUsername || !isValidPassword) {
    return { error: 'Usuario o contraseña incorrectos.' };
  }

  await createSession();
  redirect('/admin');
}
