// Configuracion de Prisma para comandos de CLI (migrate, generate, etc.).
// "engine" ya no es una opcion valida en Prisma 7 (era de la version 6) —
// se quito, el resto sigue igual.
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
