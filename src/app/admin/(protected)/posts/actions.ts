'use server';

import { redirect } from 'next/navigation';
import { verifySession } from '@/lib/auth/dal';
import {
  createPostRecord,
  deletePostRecord,
  updatePostRecord,
  type PostFormInput,
} from '@/lib/admin/posts';
import type { PostStatus, PostType } from '@/domain/models/post';

export interface PostFormState {
  error?: string;
}

// Lee y valida los campos comunes del formulario. Lanza un error de
// texto simple si algo obligatorio falta — lo atrapamos en cada action
// de arriba para mostrarlo en el formulario en vez de romper la página.
const parsePostForm = (formData: FormData): PostFormInput => {
  const title = formData.get('title');
  const type = formData.get('type');
  const content = formData.get('content');
  const status = formData.get('status');

  if (typeof title !== 'string' || !title.trim()) {
    throw new Error('El título es obligatorio.');
  }
  if (typeof type !== 'string' || !['poema', 'reflexion', 'novela'].includes(type)) {
    throw new Error('Elige un tipo válido.');
  }
  if (typeof content !== 'string' || !content.trim()) {
    throw new Error('El contenido no puede estar vacío.');
  }
  if (typeof status !== 'string' || !['draft', 'published'].includes(status)) {
    throw new Error('Elige un estado válido.');
  }

  const tagsRaw = formData.get('tags');
  const tags =
    typeof tagsRaw === 'string' && tagsRaw.trim()
      ? tagsRaw.split(',').map((tag) => tag.trim()).filter(Boolean)
      : [];

  const chapterNumberRaw = formData.get('chapterNumber');
  const chapterNumber =
    typeof chapterNumberRaw === 'string' && chapterNumberRaw.trim() ? Number(chapterNumberRaw) : undefined;

  return {
    title: title.trim(),
    type: type as PostType,
    content,
    status: status as PostStatus,
    tags,
    excerpt: (formData.get('excerpt') as string) || undefined,
    coverQuote: (formData.get('coverQuote') as string) || undefined,
    seoDescription: (formData.get('seoDescription') as string) || undefined,
    seriesSlug: (formData.get('seriesSlug') as string) || undefined,
    seriesTitle: (formData.get('seriesTitle') as string) || undefined,
    chapterTitle: (formData.get('chapterTitle') as string) || undefined,
    chapterNumber,
  };
};

export async function createPost(_prevState: PostFormState, formData: FormData): Promise<PostFormState> {
  await verifySession();

  try {
    const input = parsePostForm(formData);
    await createPostRecord(input);
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'No se pudo crear el post.' };
  }

  redirect('/admin');
}

export async function updatePost(
  id: string,
  _prevState: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  await verifySession();

  try {
    const input = parsePostForm(formData);
    await updatePostRecord(id, input);
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'No se pudo guardar el post.' };
  }

  redirect('/admin');
}

export async function deletePost(formData: FormData) {
  await verifySession();

  const id = formData.get('id');
  if (typeof id === 'string' && id) {
    await deletePostRecord(id);
  }

  redirect('/admin');
}
