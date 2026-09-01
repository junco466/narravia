// Hasheo de contraseñas con scrypt (viene incluido en Node, sin
// instalar nada extra). La idea de un hash de contraseña: guardamos
// algo que NO se puede revertir a la contraseña original, pero que sí
// podemos volver a calcular para comparar cuando alguien inicia sesión.
//
// "Salt" (sal): un valor aleatorio distinto para cada contraseña. Sin
// sal, dos personas con la misma contraseña ("123456") tendrían
// exactamente el mismo hash guardado — y eso le facilita el trabajo a
// un atacante (tablas precalculadas, "rainbow tables"). Con sal, cada
// hash es único aunque la contraseña sea igual.

import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const KEY_LENGTH = 64;

// Genera un hash nuevo. El resultado que guardas en ADMIN_PASSWORD_HASH
// tiene el formato "sal:hash" — necesitamos la sal para poder repetir
// el mismo cálculo después, al verificar.
export const hashPassword = (password: string): string => {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = scryptSync(password, salt, KEY_LENGTH);
  return `${salt}:${derivedKey.toString('hex')}`;
};

// Verifica una contraseña contra un hash guardado, sin nunca
// "desencriptar" nada — solo recalcula el hash con la misma sal y
// compara.
export const verifyPassword = (password: string, storedHash: string): boolean => {
  const [salt, hash] = storedHash.split(':');

  if (!salt || !hash) {
    return false;
  }

  const derivedKey = scryptSync(password, salt, KEY_LENGTH);
  const storedKey = Buffer.from(hash, 'hex');

  if (derivedKey.length !== storedKey.length) {
    return false;
  }

  // timingSafeEqual (en vez de "===") evita un ataque de "timing":
  // comparar strings normal termina apenas encuentra la primera
  // diferencia, y ese tiempo de respuesta ligeramente distinto se
  // puede medir para adivinar la contraseña letra por letra.
  return timingSafeEqual(derivedKey, storedKey);
};
