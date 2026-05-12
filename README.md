# Cuaderno de Medianoche

Frontend literario construido con **React + Vite + TypeScript**, diseñado desde el inicio para escalar y para desacoplar la UI de la fuente de datos. El proyecto privilegia lectura, arquitectura y facilidad de migración hacia backend o CMS.

## Principios de diseño

- **Content-first**: la interfaz enmarca el texto y evita competir con él.
- **Source-agnostic**: la UI no sabe si el contenido viene de Markdown, REST o un CMS.
- **Layered architecture**: separación explícita entre dominio, aplicación, infraestructura y presentación.
- **Contrato estable**: el frontend consume una forma de datos consistente para permitir migraciones progresivas.
- **Preparación para SSR**: los puntos dependientes de Vite o del navegador quedan encapsulados en infraestructura/presentación.

---

## Stack

- React 18
- Vite
- TypeScript
- React Router
- Zustand
- CSS Modules
- react-markdown
- gray-matter

---

## Estructura del proyecto

```text
content/
  poemas/
  reflexiones/
  novelas/
    la-casa-del-rio/
      capitulo-1.md

src/
  app/
    App.tsx
    serviceLocator.ts
  domain/
    models/
      post.ts
      errors.ts
    repositories/
      PostRepository.ts
  application/
    services/
      PostQueryService.ts
    use-cases/
      getPosts.ts
      getPostById.ts
      getPostsByCategory.ts
  infrastructure/
    config/
      environment.ts
    http/
      HttpClient.ts
    loaders/
      markdownPostLoader.ts
    repositories/
      LocalPostRepository.ts
      ApiPostRepository.ts
      MockApiPostRepository.ts
      createPostRepository.ts
  presentation/
    components/
    hooks/
    layouts/
    pages/
    router/
    styles/
    utils/
```

---

## Decisiones de arquitectura

### 1. Repository Pattern

El frontend depende de la abstracción `PostRepository`, no de la implementación concreta.

```ts
export interface PostRepository {
  getPosts(): Promise<Post[]>;
  getPostById(id: string): Promise<Post>;
  getPostsByCategory(category: string): Promise<Post[]>;
}
```

Esto permite cambiar la fuente de datos sin modificar páginas, hooks ni componentes.

### 2. Infraestructura encapsulada

- `LocalPostRepository`: carga archivos `.md` y los transforma al contrato de dominio.
- `ApiPostRepository`: consume endpoints REST con la misma forma de salida.
- `MockApiPostRepository`: simula latencia de red sin depender aún de un backend real.

El único punto que decide qué implementación usar es `createPostRepository.ts`.

### 3. Contrato estable hacia backend

La UI trabaja sobre `Post`, que refleja el contrato base requerido por backend:

```json
[
  {
    "id": "poema-1",
    "title": "Noche sin ruido",
    "type": "poema",
    "content": "Markdown string...",
    "createdAt": "2026-04-12"
  }
]
```

Además, el frontend admite metadata opcional (`excerpt`, `seriesSlug`, `chapterNumber`, etc.) para enriquecer navegación sin romper compatibilidad.

### 4. Markdown como implementación, no como dependencia de UI

La capa de presentación nunca parsea Markdown ni frontmatter. Eso ocurre en `markdownPostLoader.ts`. El resultado es siempre un `Post` listo para ser consumido.

### 5. Preparación para Next.js / SSR

La decisión dependiente de Vite (`import.meta.glob`) vive sólo en infraestructura. En una futura migración a SSR:

- el dominio no cambia,
- la capa de aplicación no cambia,
- la UI casi no cambia,
- sólo se reescribe la implementación concreta del repositorio/cargador.

---

## Contrato API propuesto

### Obtener todos los posts

`GET /api/posts`

Respuesta:

```json
[
  {
    "id": "poema-1",
    "title": "Noche sin ruido",
    "type": "poema",
    "content": "Markdown string...",
    "createdAt": "2026-04-12"
  }
]
```

### Obtener post por ID

`GET /api/posts/:id`

Respuesta:

```json
{
  "id": "poema-1",
  "title": "Noche sin ruido",
  "type": "poema",
  "content": "Markdown string...",
  "createdAt": "2026-04-12"
}
```

### Consideraciones del contrato

- `id`, `title`, `type`, `content`, `createdAt` son obligatorios.
- El backend puede añadir metadata opcional sin romper la UI.
- El repositorio local emula exactamente la forma de datos esperada por el frontend.

---

## Flujo de datos

```text
Markdown / API
      ↓
Repository implementation
      ↓
PostQueryService (application)
      ↓
Custom hooks (presentation)
      ↓
Pages / Components
```

La regla es simple: **la UI no conoce la fuente de datos**.

---

## Cómo agregar nuevos escritos

### Poemas y reflexiones

Basta con crear un nuevo archivo `.md` dentro de:

- `content/poemas/`
- `content/reflexiones/`

Ejemplo:

```md
---
title: "Un nuevo texto"
date: "2026-04-12"
type: "poema"
excerpt: "Resumen breve"
---

Contenido en Markdown...
```

### Novelas

Crear capítulos dentro de una carpeta por novela:

```text
content/
  novelas/
    mi-novela/
      capitulo-1.md
      capitulo-2.md
```

Ejemplo de frontmatter para capítulo:

```md
---
title: "Mi novela — Capítulo 1"
date: "2026-04-12"
type: "novela"
seriesSlug: "mi-novela"
seriesTitle: "Mi novela"
chapterNumber: 1
chapterTitle: "Apertura"
excerpt: "Resumen del capítulo"
---
```

No hay que tocar componentes, rutas ni estado global.

---

## Configuración de fuente de datos

Archivo `.env`:

```bash
VITE_CONTENT_SOURCE=local
VITE_API_BASE_URL=/api
```

Valores soportados:

- `local`: carga Markdown local.
- `mock-api`: usa el repositorio mock con latencia simulada.
- `api`: consume backend real.

---

## Ejemplo de repositorio local

`LocalPostRepository` obtiene el contenido transformado desde `markdownPostLoader.ts`.

Responsabilidades:

- leer Markdown,
- separar frontmatter y body,
- mapearlo al modelo `Post`,
- entregar siempre el mismo contrato a la aplicación.

## Ejemplo de repositorio API

`ApiPostRepository` usa `fetch` vía `HttpClient` y apunta a:

- `GET /api/posts`
- `GET /api/posts/:id`

La UI no requiere cambios al migrar porque sigue consumiendo `PostRepository`.

---

## UX implementada

- modo oscuro
- scroll suave
- jerarquía tipográfica serif
- márgenes amplios e interlineado cómodo
- navegación simple
- animación visual sutil a través de transiciones ligeras
- manejo explícito de `loading` y `error`

---

## Cómo correr el proyecto

```bash
npm install
npm run dev
```

Build de producción:

```bash
npm run build
npm run preview
```

---

## Extensiones recomendadas a continuación

1. **React Query o SWR** cuando el backend real introduzca invalidación, caché y refetch más sofisticado.
2. **MSW** para pruebas y mock de contrato HTTP.
3. **SEO por ruta** con `react-helmet-async` o migración a Next.js.
4. **CMS headless**: agregar `CmsPostRepository` sin tocar presentación.
5. **Búsqueda full-text** o filtrado por tags/series.

---

## Evaluación profesional

La decisión más importante en este proyecto no es visual sino estructural: el contenido es una preocupación de infraestructura y la lectura es una preocupación de presentación. Mantener esa frontera desde el inicio evita el error común de acoplar la UI al modo actual de almacenamiento. Esa separación es la que permite escalar con bajo costo de cambio.
