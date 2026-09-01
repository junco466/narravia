// Punto unico donde se crea el cliente de Prisma para toda la app.
//
// Por que un archivo aparte y no "new PrismaClient()" donde se use:
// en desarrollo, Next.js recarga modulos en caliente (Fast Refresh)
// cada vez que guardas un archivo. Si creas el cliente directo en cada
// archivo, cada recarga crearia una conexion nueva a la base de datos
// sin cerrar la anterior — en minutos tendrias decenas de conexiones
// abiertas. El truco de abajo (guardar la instancia en "globalThis")
// hace que sobreviva a esas recargas y se reutilice siempre la misma.

import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const createPrismaClient = () => {
  // El adapter es quien realmente sabe hablar con Postgres (usa la
  // libreria "pg" por debajo). Prisma ya no lee DATABASE_URL solo —
  // hay que dárselo explícitamente aquí.
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
