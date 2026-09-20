// Acceso a datos de "me gusta" y comentarios. Igual que lib/admin/posts.ts,
// habla con Prisma directo (solo hay una implementación posible).
import 'server-only';
import { prisma } from '@/lib/prisma';

export interface PublicComment {
  id: number;
  authorName: string;
  body: string;
  createdAt: string;
}

export interface EngagementState {
  likeCount: number;
  liked: boolean;
  comments: PublicComment[];
}

// Límite anti-spam: máximo 3 comentarios por visitante cada 10 minutos.
const COMMENT_LIMIT = 3;
const COMMENT_WINDOW_MS = 10 * 60 * 1000;

// Solo los posts publicados admiten likes/comentarios: evita que alguien
// que adivine el id de un borrador interactúe con él.
const isPublished = async (postId: string): Promise<boolean> => {
  const post = await prisma.post.findUnique({ where: { id: postId }, select: { status: true } });
  return post?.status === 'published';
};

export const getEngagement = async (postId: string, visitorId: string | null): Promise<EngagementState> => {
  // Las 3 consultas son independientes: van en paralelo.
  const [likeCount, liked, comments] = await Promise.all([
    prisma.postLike.count({ where: { postId } }),
    visitorId
      ? prisma.postLike.findUnique({ where: { postId_visitorId: { postId, visitorId } }, select: { id: true } })
      : null,
    prisma.comment.findMany({ where: { postId }, orderBy: { createdAt: 'desc' }, take: 200 }),
  ]);

  return {
    likeCount,
    liked: Boolean(liked),
    // Ojo: NO devolvemos authorEmail ni visitorId al público.
    comments: comments.map((c) => ({
      id: c.id,
      authorName: c.authorName,
      body: c.body,
      createdAt: c.createdAt.toISOString(),
    })),
  };
};

// Alterna el like: si ya existía lo quita, si no lo crea.
export const toggleLike = async (postId: string, visitorId: string): Promise<void> => {
  if (!(await isPublished(postId))) return;

  const existing = await prisma.postLike.findUnique({
    where: { postId_visitorId: { postId, visitorId } },
    select: { id: true },
  });

  if (existing) {
    await prisma.postLike.delete({ where: { id: existing.id } });
    return;
  }

  try {
    await prisma.postLike.create({ data: { postId, visitorId } });
  } catch {
    // Doble clic muy rápido: la restricción única de la base de datos
    // rechazó el duplicado. El resultado deseado (like puesto) ya existe.
  }
};

export type AddCommentResult = { ok: true } | { ok: false; error: string };

export const addComment = async (input: {
  postId: string;
  visitorId: string;
  authorName: string;
  authorEmail?: string;
  body: string;
}): Promise<AddCommentResult> => {
  if (!(await isPublished(input.postId))) {
    return { ok: false, error: 'Este post no admite comentarios.' };
  }

  const recent = await prisma.comment.count({
    where: { visitorId: input.visitorId, createdAt: { gte: new Date(Date.now() - COMMENT_WINDOW_MS) } },
  });
  if (recent >= COMMENT_LIMIT) {
    return { ok: false, error: 'Has comentado varias veces seguidas. Intenta de nuevo en unos minutos.' };
  }

  await prisma.comment.create({ data: { ...input, authorEmail: input.authorEmail || null } });
  return { ok: true };
};

// ---- Lado admin ----

export const listCommentsForAdmin = () =>
  prisma.comment.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
    include: { post: { select: { id: true, title: true, type: true, seriesSlug: true } } },
  });

export const deleteCommentRecord = async (id: number): Promise<void> => {
  await prisma.comment.deleteMany({ where: { id } });
};

// ---- Mensajes de contacto ----

// Máximo 3 mensajes por visitante por hora.
const CONTACT_LIMIT = 3;
const CONTACT_WINDOW_MS = 60 * 60 * 1000;

export const addContactMessage = async (input: {
  visitorId: string;
  name: string;
  email: string;
  body: string;
}): Promise<AddCommentResult> => {
  const recent = await prisma.contactMessage.count({
    where: { visitorId: input.visitorId, createdAt: { gte: new Date(Date.now() - CONTACT_WINDOW_MS) } },
  });
  if (recent >= CONTACT_LIMIT) {
    return { ok: false, error: 'Ya enviaste varios mensajes. Intenta de nuevo más tarde.' };
  }

  await prisma.contactMessage.create({ data: input });
  return { ok: true };
};

export const listContactMessages = () =>
  prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 200 });

export const deleteContactMessageRecord = async (id: number): Promise<void> => {
  await prisma.contactMessage.deleteMany({ where: { id } });
};
