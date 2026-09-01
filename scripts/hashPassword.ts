// Corre esto TU MISMO en la terminal para generar el hash de tu
// contraseña de admin, sin que la contraseña real quede escrita en
// ningun lado (ni en este chat, ni en el historial de comandos si usas
// la variante interactiva de abajo):
//
//   npx tsx scripts/hashPassword.ts "tu-contraseña-aqui"
//
// Copia el resultado y pegalo como valor de ADMIN_PASSWORD_HASH en tu
// .env (reemplazando el "" que quedo vacio).

import { hashPassword } from '@/lib/auth/password';

const password = process.argv[2];

if (!password) {
  console.error('Uso: npx tsx scripts/hashPassword.ts "tu-contraseña"');
  process.exit(1);
}

console.log(hashPassword(password));
