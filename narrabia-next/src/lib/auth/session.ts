// "server-only" hace que, si alguien por error importa este archivo
// desde un Client Component, el build falle con un mensaje claro — es
// una alarma para que SESSION_SECRET nunca termine en el navegador.
import 'server-only';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const secretKey = process.env.SESSION_SECRET;

if (!secretKey) {
  throw new Error('Falta la variable de entorno SESSION_SECRET');
}

const encodedKey = new TextEncoder().encode(secretKey);
const COOKIE_NAME = 'admin_session';
const SESSION_DURATION = '7d';

interface SessionPayload {
  role: 'admin';
  [key: string]: unknown;
}

// Firma el payload con SESSION_SECRET. El resultado es un JWT: un
// texto que cualquiera puede LEER (no es secreto), pero que nadie
// puede FABRICAR ni MODIFICAR sin conocer la clave — la firma no
// coincidiria y jwtVerify lo rechaza.
const encrypt = (payload: SessionPayload) =>
  new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(encodedKey);

const decrypt = async (session: string | undefined): Promise<SessionPayload | null> => {
  if (!session) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(session, encodedKey, { algorithms: ['HS256'] });
    return payload as SessionPayload;
  } catch {
    // Firma invalida, o expirado (jwtVerify revisa la fecha solo).
    return null;
  }
};

// Se llama justo despues de verificar la contraseña en el login.
export const createSession = async () => {
  const session = await encrypt({ role: 'admin' });
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, session, {
    httpOnly: true, // JavaScript del navegador no puede leerla (protege de ataques XSS)
    secure: process.env.NODE_ENV === 'production', // solo viaja por https en produccion
    sameSite: 'lax', // no se envia en requests iniciados desde OTROS sitios
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 dias, en segundos
  });
};

// Lee y valida la cookie actual. Devuelve null si no hay sesion o es
// invalida/expirada.
export const getSession = async (): Promise<SessionPayload | null> => {
  const cookieStore = await cookies();
  return decrypt(cookieStore.get(COOKIE_NAME)?.value);
};

export const deleteSession = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
};
